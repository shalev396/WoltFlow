import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import Screenshot from "../models/Screenshot.js";

// Environment variables
dotenv.config();
const ENV = process.env["ENV"];
let ENV_ASSETS_BUCKET_NAME = "";
if (ENV === "prod") {
  ENV_ASSETS_BUCKET_NAME = process.env["S3_ASSETS_BUCKET_NAME_PROD"] || "";
} else if (ENV === "dev") {
  ENV_ASSETS_BUCKET_NAME = process.env["S3_ASSETS_BUCKET_NAME_DEV"] || "";
} else if (ENV === "local") {
  ENV_ASSETS_BUCKET_NAME = process.env["S3_ASSETS_BUCKET_NAME_DEV"] || "";
}
const ASSETS_BUCKET_NAME = ENV_ASSETS_BUCKET_NAME;
// AWS Configuration
const AWS_REGION = process.env["AWS_REGION"];

if (!AWS_REGION || !ASSETS_BUCKET_NAME) {
  throw new Error(
    `Missing one or more environment variables: AWS_REGION=${AWS_REGION}, ASSETS_BUCKET_NAME=${ASSETS_BUCKET_NAME}, ENV=${ENV}`
  );
}

// Initialize S3 client with explicit credentials
const s3 = new S3Client({
  region: AWS_REGION,
});

/**
 * Convert an image file to base64 string with proper format.
 * @param imagePath Path to the image file
 * @returns Base64 string with data URI format or null if error
 */
export function convertImageToBase64(imagePath: string): string | null {
  try {
    const fs = require("fs");
    const path = require("path");

    const imageBuffer = fs.readFileSync(imagePath);
    const encodedString = imageBuffer.toString("base64");

    // Get the file extension
    const ext = path.extname(imagePath).slice(1).toLowerCase() || "png";

    // Map common image extensions to MIME types
    const mimeTypes: { [key: string]: string } = {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      gif: "image/gif",
      bmp: "image/bmp",
    };

    const mimeType = mimeTypes[ext] || "image/png";
    return `data:${mimeType};base64,${encodedString}`;
  } catch (error) {
    console.error(`Error converting image to base64: ${error}`);
    return null;
  }
}

/**
 * Upload a Base64-encoded image to S3 and return its CloudFront URL.
 * @param base64Image Base64 image string: "data:image/jpeg;base64,<data>"
 * @param folder Folder (key prefix) in S3 bucket (e.g., "images")
 * @returns Full CloudFront URL (e.g., "https://woltflow.shalev396.com/images/UUID.jpg")
 */
export async function uploadImageToS3(
  base64Image: string,
  folder: string = "images"
): Promise<string> {
  // 1. Parse the Base64 data; pattern captures "image/type" and the actual data
  const match = base64Image.match(/^data:(?<type>[^;]+);base64,(?<data>.+)$/);
  if (!match || !match.groups) {
    throw new Error("Invalid base64 image format");
  }

  const contentType = match.groups["type"]; // e.g., "image/jpeg"
  const base64Data = match.groups["data"]; // the raw Base64 data

  let imgBuffer: Buffer;
  try {
    imgBuffer = Buffer.from(base64Data!, "base64");
  } catch (error) {
    console.error("Base64 decoding failed:", error);
    throw new Error("Base64 decoding failed");
  }

  // 2. Determine file extension (e.g., "jpeg" from "image/jpeg")
  const extension = contentType?.split("/")[1] || "jpg";
  const filename = `${uuidv4()}.${extension}`;
  const key = `${folder}/${filename}`;

  // 3. Upload to S3
  try {
    const uploadParams: PutObjectCommandInput = {
      Bucket: ASSETS_BUCKET_NAME!,
      Key: key,
      Body: imgBuffer,
      ContentType: contentType!,
    };

    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);
    console.log(`Image uploaded successfully to ${ASSETS_BUCKET_NAME}/${key}`);
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    throw error;
  }

  // 4. Return the CloudFront or direct S3 URL
  const url =
    process.env["ENV"] === "prod"
      ? `https://woltflow.shalev396.com/${key}`
      : `https://dev.woltflow.shalev396.com/${key}`;
  return url;
}

/**
 * Upload a Base64-encoded image to S3 and save the record to Screenshot database.
 * @param base64Image Base64 image string: "data:image/jpeg;base64,<data>"
 * @param runId The run ID to associate with this screenshot
 * @param isError Whether this screenshot represents an error state
 * @param siteUrl The site URL where the screenshot was taken
 * @param screenshotType The type of screenshot (default: "step")
 * @param stage The automation stage when screenshot was taken (optional)
 * @param folder Folder (key prefix) in S3 bucket (default: "screenshots")
 * @returns Screenshot database record
 */
export async function uploadImageToS3AndSaveToDb(
  base64Image: string,
  runId: string,
  isError: boolean = false,
  siteUrl?: string,
  screenshotType: "error" | "success" | "step" | "debug" | "final" = "step",
  stage?: string,
  folder: string = "images"
): Promise<Screenshot> {
  try {
    // 1. Upload image to S3
    const imageUrl = await uploadImageToS3(base64Image, folder);

    // 2. Determine screenshot type based on isError
    const actualScreenshotType = isError ? "error" : screenshotType;

    // 3. Save screenshot record to database
    const screenshot = await Screenshot.create({
      runId: runId,
      screenshotUrl: imageUrl, // The actual S3 URL for the screenshot
      siteUrl: siteUrl, // The site URL where the screenshot was taken
      screenshotType: actualScreenshotType,
      stage: stage,
      isError: isError,
    });

    console.log(`Screenshot saved to database with ID: ${screenshot.id}`);
    return screenshot;
  } catch (error) {
    console.error("Error uploading image to S3 and saving to database:", error);
    throw error;
  }
}

/**
 * Upload a screenshot file directly from file path to S3 and save to database.
 * @param imagePath Path to the image file
 * @param runId The run ID to associate with this screenshot
 * @param isError Whether this screenshot represents an error state
 * @param siteUrl The site URL where the screenshot was taken
 * @param screenshotType The type of screenshot (default: "step")
 * @param stage The automation stage when screenshot was taken (optional)
 * @param folder Folder (key prefix) in S3 bucket (default: "screenshots")
 * @returns Screenshot database record or null if conversion fails
 */
export async function uploadImageFileToS3AndSaveToDb(
  imagePath: string,
  runId: string,
  isError: boolean = false,
  siteUrl?: string,
  screenshotType: "error" | "success" | "step" | "debug" | "final" = "step",
  stage?: string,
  folder: string = "images"
): Promise<Screenshot | null> {
  try {
    // 1. Convert image file to base64
    const base64Image = convertImageToBase64(imagePath);
    if (!base64Image) {
      console.error("Failed to convert image to base64");
      return null;
    }

    // 2. Upload to S3 and save to database
    return await uploadImageToS3AndSaveToDb(
      base64Image,
      runId,
      isError,
      siteUrl,
      screenshotType,
      stage,
      folder
    );
  } catch (error) {
    console.error(
      "Error uploading image file to S3 and saving to database:",
      error
    );
    throw error;
  }
}
