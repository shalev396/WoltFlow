import archiver from "archiver";
import { type CompleteUserExport } from "../types/sequelize.js";
import { downloadFileFromS3, getFilenameFromS3Url } from "./s3Util.js";
import { Readable } from "stream";

/**
 * Converts a complete user export to CSV format with table headers
 */
export function convertUserExportToCSV(exportData: CompleteUserExport): string {
  const csvLines: string[] = [];

  // Helper function to escape CSV values
  const escapeCsvValue = (value: any): string => {
    if (value === null || value === undefined) return "";
    const stringValue = String(value);
    if (
      stringValue.includes(",") ||
      stringValue.includes('"') ||
      stringValue.includes("\n")
    ) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  // Helper function to add table section
  const addTableSection = (
    tableName: string,
    data: any | any[],
    isArray: boolean = false,
    fallbackHeaders?: string[]
  ) => {
    // Add table name as header
    csvLines.push(tableName);

    if (isArray && Array.isArray(data)) {
      // Handle array data (multiple records)
      if (data.length > 0) {
        const headers = Object.keys(data[0]);
        const maxColumns = Math.max(headers.length, 1);

        // Add column headers
        csvLines.push(headers.map(escapeCsvValue).join(","));

        // Add data rows
        data.forEach((item) => {
          const row = headers.map((header) => escapeCsvValue(item[header]));
          csvLines.push(row.join(","));
        });

        // Add spacing (skip maxColumns - 1 rows for proper spacing)
        for (let i = 0; i < Math.max(0, maxColumns - 1); i++) {
          csvLines.push("");
        }
      } else if (fallbackHeaders) {
        // Show headers even when no data
        csvLines.push(fallbackHeaders.map(escapeCsvValue).join(","));
        // Add spacing
        for (let i = 0; i < Math.max(0, fallbackHeaders.length - 1); i++) {
          csvLines.push("");
        }
      }
    } else if (data) {
      // Handle single object data
      const headers = Object.keys(data);
      const values = headers.map((header) => data[header]);
      const maxColumns = Math.max(headers.length, 1);

      // Add column headers
      csvLines.push(headers.map(escapeCsvValue).join(","));

      // Add data row
      csvLines.push(values.map(escapeCsvValue).join(","));

      // Add spacing (skip maxColumns - 1 rows for proper spacing)
      for (let i = 0; i < Math.max(0, maxColumns - 1); i++) {
        csvLines.push("");
      }
    } else if (fallbackHeaders) {
      // Show headers even when no data
      csvLines.push(fallbackHeaders.map(escapeCsvValue).join(","));
      // Add spacing
      for (let i = 0; i < Math.max(0, fallbackHeaders.length - 1); i++) {
        csvLines.push("");
      }
    }
  };

  // Add tables in the specified order with fallback headers
  addTableSection("User", exportData.user, false, [
    "id",
    "googleId",
    "googleRefreshToken",
    "name",
    "email",
    "apiKey",
    "lastLoginAt",
    "createdAt",
    "updatedAt",
  ]);

  addTableSection("Settings", exportData.settings, false, [
    "id",
    "userId",
    "notificationSettingsId",
    "woltSettingsId",
    "cibusSettingsId",
    "runSettingsId",
    "createdAt",
    "updatedAt",
  ]);

  addTableSection("Wolt Settings", exportData.woltSettings, false, [
    "id",
    "woltRefreshToken",
    "woltAccessToken",
    "createdAt",
    "updatedAt",
  ]);

  addTableSection("Cibus Settings", exportData.cibusSettings, false, [
    "id",
    "cibusUsername",
    "cibusPassword",
    "cibusCompany",
    "createdAt",
    "updatedAt",
  ]);

  addTableSection(
    "Notification Settings",
    exportData.notificationSettings,
    false,
    [
      "id",
      "isEnabled",
      "notificationOnSuccess",
      "notificationOnError",
      "notificationMethod",
      "phoneNumber",
      "phoneVerified",
      "email",
      "emailVerified",
      "createdAt",
      "updatedAt",
    ]
  );

  addTableSection("Run Settings", exportData.runSettings, false, [
    "id",
    "automationMode",
    "giftAmount",
    "createdAt",
    "updatedAt",
  ]);

  addTableSection("Inbox", exportData.inbox, false, [
    "id",
    "userId",
    "emailAddress",
    "createdAt",
    "updatedAt",
  ]);

  addTableSection("Emails", exportData.emails, true, [
    "id",
    "inboxId",
    "s3EmailUrl",
    "attachmentUrls",
    "fromEmail",
    "fromName",
    "toEmail",
    "toName",
    "subject",
    "body",
    "emailDate",
    "dataExpiresAt",
    "createdAt",
    "updatedAt",
  ]);

  addTableSection(
    "Two Factor Authentication",
    exportData.twoFactorAuthentications,
    true,
    [
      "id",
      "notificationSettingsId",
      "method",
      "contact",
      "code",
      "purpose",
      "expiresAt",
      "verified",
      "dataExpiresAt",
      "createdAt",
      "updatedAt",
    ]
  );

  addTableSection("Runs", exportData.runs, true, [
    "id",
    "userId",
    "status",
    "stage",
    "automationMode",
    "amount",
    "errorMessage",
    "dataExpiresAt",
    "createdAt",
    "updatedAt",
  ]);

  addTableSection("Screenshots", exportData.screenshots, true, [
    "id",
    "runId",
    "screenshotType",
    "stage",
    "siteUrl",
    "screenshotUrl",
    "isError",
    "dataExpiresAt",
    "createdAt",
    "updatedAt",
  ]);

  addTableSection("Cibus 2FA", exportData.cibus2FAcodes, true, [
    "id",
    "userId",
    "code",
    "message",
    "receivedAt",
    "expiresAt",
    "isUsed",
    "usedAt",
    "dataExpiresAt",
    "createdAt",
    "updatedAt",
  ]);

  addTableSection("Codes", exportData.codes, true, [
    "id",
    "userId",
    "runId",
    "emailId",
    "code",
    "isUsed",
    "dataExpiresAt",
    "createdAt",
    "updatedAt",
  ]);

  // Add UTF-8 BOM for proper Hebrew and other Unicode character support
  const BOM = "\uFEFF";
  return BOM + csvLines.join("\n");
}

/**
 * Interface for files to be included in the export
 */
interface ExportFile {
  filename: string;
  buffer: Buffer;
}

/**
 * Collect all files (screenshots, emails, attachments) for export
 */
async function collectExportFiles(exportData: CompleteUserExport): Promise<{
  screenshots: ExportFile[];
  emails: ExportFile[];
  attachments: ExportFile[];
}> {
  const screenshots: ExportFile[] = [];
  const emails: ExportFile[] = [];
  const attachments: ExportFile[] = [];

  console.log("Starting to collect files for export...");

  // Collect screenshots
  for (const screenshot of exportData.screenshots) {
    if (screenshot.screenshotUrl) {
      try {
        const buffer = await downloadFileFromS3(screenshot.screenshotUrl);
        if (buffer) {
          const filename = getFilenameFromS3Url(screenshot.screenshotUrl);
          screenshots.push({
            filename: `${screenshot.id}_${filename}`,
            buffer,
          });
          console.log(`Downloaded screenshot: ${screenshot.id}`);
        }
      } catch (error) {
        console.error(`Failed to download screenshot ${screenshot.id}:`, error);
      }
    }
  }

  // Collect emails
  for (const email of exportData.emails) {
    if (email.s3EmailUrl) {
      try {
        const buffer = await downloadFileFromS3(email.s3EmailUrl);
        if (buffer) {
          const filename = getFilenameFromS3Url(email.s3EmailUrl);
          const extension = filename.includes(".") ? "" : ".eml";
          emails.push({
            filename: `${email.id}_${filename}${extension}`,
            buffer,
          });
          console.log(`Downloaded email: ${email.id}`);
        }
      } catch (error) {
        console.error(`Failed to download email ${email.id}:`, error);
      }
    }

    // Collect attachments for this email
    if (email.attachmentUrls && Array.isArray(email.attachmentUrls)) {
      for (let i = 0; i < email.attachmentUrls.length; i++) {
        const attachmentUrl = email.attachmentUrls[i];
        if (!attachmentUrl) continue;
        try {
          const buffer = await downloadFileFromS3(attachmentUrl);
          if (buffer) {
            const filename = getFilenameFromS3Url(attachmentUrl);
            attachments.push({
              filename: `${email.id}_attachment_${i + 1}_${filename}`,
              buffer,
            });
            console.log(
              `Downloaded attachment for email ${email.id}: ${filename}`
            );
          }
        } catch (error) {
          console.error(
            `Failed to download attachment for email ${email.id}:`,
            error
          );
        }
      }
    }
  }

  console.log(
    `Collected ${screenshots.length} screenshots, ${emails.length} emails, ${attachments.length} attachments`
  );

  return { screenshots, emails, attachments };
}

/**
 * Generate filename with current timestamp for export
 */
export function generateExportFilename(userEmail?: string | null): string {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, "-");
  const userPart = userEmail ? `_${userEmail.split("@")[0]}` : "";
  return `woltflow-user-data${userPart}_${timestamp}.zip`;
}

/**
 * Create a ZIP file containing CSV and all user files
 */
export async function createUserExportZip(
  exportData: CompleteUserExport
): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      const archive = archiver("zip", {
        zlib: { level: 9 }, // Maximum compression
      });

      const buffers: Uint8Array[] = [];

      // Collect archive data
      archive.on("data", (chunk: Uint8Array) => {
        buffers.push(chunk);
      });

      archive.on("error", (err: Error) => {
        console.error("Archive error:", err);
        reject(err);
      });

      archive.on("end", () => {
        console.log("Archive created successfully");
        resolve(Buffer.concat(buffers));
      });

      // Generate and add CSV file
      const csvContent = convertUserExportToCSV(exportData);
      archive.append(csvContent, { name: "database-records.csv" });
      console.log("Added CSV to archive");

      // Collect all files
      const { screenshots, emails, attachments } = await collectExportFiles(
        exportData
      );

      // Add screenshots to archive
      for (const screenshot of screenshots) {
        archive.append(screenshot.buffer, {
          name: `screenshots/${screenshot.filename}`,
        });
      }

      // Add emails to archive
      for (const email of emails) {
        archive.append(email.buffer, { name: `emails/${email.filename}` });
      }

      // Add attachments to archive
      for (const attachment of attachments) {
        archive.append(attachment.buffer, {
          name: `attachments/${attachment.filename}`,
        });
      }

      console.log("All files added to archive, finalizing...");

      // Finalize the archive
      archive.finalize();
    } catch (error) {
      console.error("Error creating export ZIP:", error);
      reject(error);
    }
  });
}

/**
 * Helper function to create a readable stream from buffer for Lambda response
 */
export function createStreamFromBuffer(buffer: Buffer): Readable {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}
