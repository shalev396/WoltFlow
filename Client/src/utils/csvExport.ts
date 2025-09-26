import { type CompleteUserExport } from "@/types/export";

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
 * Downloads CSV content as a file
 */
export function downloadCSV(
  csvContent: string,
  filename: string = "user-data-export.csv"
): void {
  // Create blob with UTF-8 encoding and BOM for proper Hebrew/Unicode support
  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Generates filename with current timestamp
 */
export function generateExportFilename(userEmail?: string | null): string {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, "-");
  const userPart = userEmail ? `_${userEmail.split("@")[0]}` : "";
  return `woltflow-user-data${userPart}_${timestamp}.csv`;
}

/**
 * Main function to export user data as CSV
 */
export function exportUserDataAsCSV(exportData: CompleteUserExport): void {
  const csvContent = convertUserExportToCSV(exportData);
  const filename = generateExportFilename(exportData.user.email);
  downloadCSV(csvContent, filename);
}
