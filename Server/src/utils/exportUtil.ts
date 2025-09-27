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
 * Interface for download task
 */
interface DownloadTask {
  type: "screenshot" | "email" | "attachment";
  url: string;
  filename: string;
  id: string;
}

/**
 * Process downloads in parallel batches to avoid overwhelming S3
 */
async function processBatchDownloads(
  tasks: DownloadTask[],
  batchSize: number = 15
): Promise<{
  screenshots: ExportFile[];
  emails: ExportFile[];
  attachments: ExportFile[];
}> {
  const screenshots: ExportFile[] = [];
  const emails: ExportFile[] = [];
  const attachments: ExportFile[] = [];

  console.log(
    `Processing ${tasks.length} downloads in batches of ${batchSize}`
  );
  const startTime = Date.now();

  // Process tasks in batches
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(tasks.length / batchSize);
    console.log(
      `Processing batch ${batchNum}/${totalBatches} (${batch.length} files)`
    );

    const batchStartTime = Date.now();

    // Download all files in this batch in parallel
    const downloadPromises = batch.map(async (task) => {
      try {
        const buffer = await downloadFileFromS3(task.url);
        if (buffer) {
          return {
            type: task.type,
            filename: task.filename,
            buffer,
            success: true,
          };
        }
        return { type: task.type, success: false, error: "No buffer returned" };
      } catch (error) {
        console.error(`Failed to download ${task.type} ${task.id}:`, error);
        return { type: task.type, success: false, error: error };
      }
    });

    // Wait for all downloads in this batch to complete
    const results = await Promise.allSettled(downloadPromises);

    // Process successful downloads
    results.forEach((result) => {
      if (result.status === "fulfilled" && result.value.success) {
        const file = result.value as {
          type: string;
          filename: string;
          buffer: Buffer;
          success: boolean;
        };
        const exportFile: ExportFile = {
          filename: file.filename,
          buffer: file.buffer,
        };

        switch (file.type) {
          case "screenshot":
            screenshots.push(exportFile);
            break;
          case "email":
            emails.push(exportFile);
            break;
          case "attachment":
            attachments.push(exportFile);
            break;
        }
      }
    });

    const batchDuration = Date.now() - batchStartTime;
    console.log(
      `Batch ${batchNum} completed in ${batchDuration}ms. Total downloaded: ${
        screenshots.length + emails.length + attachments.length
      } files`
    );
  }

  const totalDuration = Date.now() - startTime;
  console.log(
    `All batches completed in ${totalDuration}ms. Downloaded: ${
      screenshots.length + emails.length + attachments.length
    }/${tasks.length} files`
  );

  return { screenshots, emails, attachments };
}

/**
 * Collect all files (screenshots, emails, attachments) for export using parallel processing
 */
async function collectExportFiles(exportData: CompleteUserExport): Promise<{
  screenshots: ExportFile[];
  emails: ExportFile[];
  attachments: ExportFile[];
}> {
  console.log(
    "Starting to collect files for export with parallel processing..."
  );

  const downloadTasks: DownloadTask[] = [];

  // Prepare screenshot download tasks
  exportData.screenshots.forEach((screenshot) => {
    if (screenshot.screenshotUrl) {
      const filename = getFilenameFromS3Url(screenshot.screenshotUrl);
      downloadTasks.push({
        type: "screenshot",
        url: screenshot.screenshotUrl,
        filename: `${screenshot.id}_${filename}`,
        id: screenshot.id,
      });
    }
  });

  // Prepare email download tasks
  exportData.emails.forEach((email) => {
    if (email.s3EmailUrl) {
      const filename = getFilenameFromS3Url(email.s3EmailUrl);
      const extension = filename.includes(".") ? "" : ".eml";
      downloadTasks.push({
        type: "email",
        url: email.s3EmailUrl,
        filename: `${email.id}_${filename}${extension}`,
        id: email.id,
      });
    }

    // Prepare attachment download tasks
    if (email.attachmentUrls && Array.isArray(email.attachmentUrls)) {
      email.attachmentUrls.forEach((attachmentUrl, index) => {
        if (attachmentUrl) {
          const filename = getFilenameFromS3Url(attachmentUrl);
          downloadTasks.push({
            type: "attachment",
            url: attachmentUrl,
            filename: `${email.id}_attachment_${index + 1}_${filename}`,
            id: `${email.id}_${index}`,
          });
        }
      });
    }
  });

  console.log(
    `Prepared ${downloadTasks.length} download tasks (${
      exportData.screenshots.length
    } screenshots, ${exportData.emails.length} emails, ${
      downloadTasks.filter((t) => t.type === "attachment").length
    } attachments)`
  );

  // Process all downloads in parallel batches
  const result = await processBatchDownloads(downloadTasks);

  console.log(
    `Parallel collection completed: ${result.screenshots.length} screenshots, ${result.emails.length} emails, ${result.attachments.length} attachments`
  );

  return result;
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
