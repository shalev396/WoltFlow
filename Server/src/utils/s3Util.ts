import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  type PutObjectCommandInput,
  type GetObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { Run } from "../classes/index.js";
import fs from "fs";
import path from "path";

// Environment variables
dotenv.config();

if (!process.env.AWS_REGION || !process.env.S3_ASSETS_BUCKET_NAME) {
  throw new Error(
    `Missing one or more environment variables: AWS_REGION=${process.env.AWS_REGION}, ASSETS_BUCKET_NAME=${process.env.S3_ASSETS_BUCKET_NAME}, ENV=${process.env.ENV}`
  );
}

// Initialize S3 client with explicit credentials
const s3 = new S3Client({
  region: process.env.AWS_REGION,
});

/**
 * Convert an image file to base64 string with proper format.
 * @param imagePath Path to the image file
 * @returns Base64 string with data URI format or null if error
 */
export function convertImageToBase64(imagePath: string): string | null {
  try {
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
 * @returns Full CloudFront URL (e.g., "https://{DOMAIN_NAME}/images/UUID.jpg")
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
      Bucket: process.env.S3_ASSETS_BUCKET_NAME!,
      Key: key,
      Body: imgBuffer,
      ContentType: contentType!,
    };

    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);
    console.log(
      `Image uploaded successfully to ${process.env.S3_ASSETS_BUCKET_NAME}/${key}`
    );
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    throw error;
  }

  // 4. Return the CloudFront or direct S3 URL
  const url =
    process.env.ENV === "prod"
      ? `https://${process.env.DOMAIN_NAME}/${key}`
      : `https://${process.env.DOMAIN_NAME}/${key}`;
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
): Promise<void> {
  try {
    const imageUrl = await uploadImageToS3(base64Image, folder);
    const actualScreenshotType = isError ? "error" : screenshotType;

    const screenshot = await Run.saveScreenshot(
      runId,
      imageUrl,
      isError,
      siteUrl,
      actualScreenshotType,
      stage,
    );

    console.log(`Screenshot saved to database with ID: ${screenshot.id}`);
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
): Promise<void> {
  try {
    const base64Image = convertImageToBase64(imagePath);
    if (!base64Image) {
      console.error("Failed to convert image to base64");
      return;
    }

    await uploadImageToS3AndSaveToDb(
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

/**
 * Download a file from S3 and return its Buffer content with retry logic.
 * @param s3Url Full S3 URL (e.g., "https://domain.com/folder/file.jpg")
 * @param retries Number of retries for failed downloads
 * @returns Buffer containing the file data or null if error
 */
export async function downloadFileFromS3(
  s3Url: string,
  retries: number = 3
): Promise<Buffer | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Extract bucket and key from URL
      // URLs can be:
      // - https://domain.com/folder/file.jpg (CloudFront)
      // - https://bucket-name.s3.region.amazonaws.com/folder/file.jpg (direct S3)

      let bucket: string;
      let key: string;

      if (s3Url.includes("amazonaws.com")) {
        // Direct S3 URL
        const url = new URL(s3Url);
        bucket = url.hostname.split(".")[0] || "";
        key = url.pathname.substring(1); // Remove leading slash
      } else {
        // CloudFront URL — only the assets bucket remains after the
        // email-forwarding subsystem was retired.
        const url = new URL(s3Url);
        bucket = process.env.S3_ASSETS_BUCKET_NAME || "";
        key = url.pathname.substring(1);
      }

      if (!bucket) {
        console.error(`Could not determine bucket from URL: ${s3Url}`);
        return null;
      }

      const params: GetObjectCommandInput = {
        Bucket: bucket,
        Key: key,
      };

      const command = new GetObjectCommand(params);
      const response = await s3.send(command);

      if (response.Body) {
        // Convert stream to buffer efficiently
        const chunks: Uint8Array[] = [];
        const stream = response.Body as AsyncIterable<Uint8Array>;

        for await (const chunk of stream) {
          chunks.push(chunk);
        }

        return Buffer.concat(chunks);
      }

      return null;
    } catch (error: unknown) {
      const err = error as Error & { message?: string };
      console.error(
        `Error downloading file from S3 (attempt ${attempt}/${retries}): ${s3Url}`,
        err?.message || error
      );

      if (attempt < retries) {
        // Wait before retry with exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Max 5 seconds delay
        console.log(`Retrying download in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  console.error(`Failed to download file after ${retries} attempts: ${s3Url}`);
  return null;
}

/**
 * Extract filename from S3 URL
 * @param s3Url Full S3 URL
 * @returns Filename or generated name if extraction fails
 */
export function getFilenameFromS3Url(s3Url: string): string {
  try {
    const url = new URL(s3Url);
    const pathParts = url.pathname.split("/");
    const filename = pathParts[pathParts.length - 1];
    return filename || "file";
  } catch {
    console.error(`Error extracting filename from URL: ${s3Url}`);
    return "file";
  }
}

/**
 * Upload ZIP buffer to S3 and generate a presigned download URL
 * @param zipBuffer The ZIP file buffer to upload
 * @param filename The filename for the ZIP file
 * @returns Object with S3 URL and presigned download URL
 */
export async function uploadZipToS3AndGetDownloadUrl(
  zipBuffer: Buffer,
  filename: string
): Promise<{ s3Url: string; downloadUrl: string }> {
  const key = `exports/${filename}`;

  try {
    // Upload ZIP file to S3
    const uploadParams: PutObjectCommandInput = {
      Bucket: process.env.S3_ASSETS_BUCKET_NAME!,
      Key: key,
      Body: zipBuffer,
      ContentType: "application/zip",
      ContentDisposition: `attachment; filename="${filename}"`,
      // S3 lifecycle policy will automatically delete this file after 24 hours
    };

    const uploadCommand = new PutObjectCommand(uploadParams);
    await s3.send(uploadCommand);

    console.log(
      `ZIP file uploaded to S3: s3://${process.env.S3_ASSETS_BUCKET_NAME}/${key}`
    );

    // Generate presigned URL for download (valid for 24 hours)
    const downloadCommand = new GetObjectCommand({
      Bucket: process.env.S3_ASSETS_BUCKET_NAME!,
      Key: key,
    });

    const downloadUrl = await getSignedUrl(s3, downloadCommand, {
      expiresIn: 24 * 60 * 60, // 24 hours in seconds
    });

    const s3Url = `s3://${process.env.S3_ASSETS_BUCKET_NAME}/${key}`;

    console.log(
      `Generated presigned download URL (expires in 24h): ${downloadUrl.substring(
        0,
        100
      )}...`
    );

    return {
      s3Url,
      downloadUrl,
    };
  } catch (error) {
    console.error("Error uploading ZIP to S3:", error);
    throw new Error(`Failed to upload ZIP file to S3: ${error}`);
  }
}
