# Temporary Wolt Code Handlers

This folder contains temporary handlers for bulk processing of Wolt gift card codes.

## Functions

### 1. getAllWoltCodes.ts

Scans all Wolt emails from the last 6 months and extracts gift card codes.

**Usage:**

- Endpoint: GET with `userId` query parameter
- Searches Gmail for Wolt gift card emails
- Extracts codes from PDF attachments
- Saves new codes to database (avoids duplicates)
- Returns summary of processed codes

**Example:**

```
GET /api/temp/get-all-codes?userId=your-user-id
```

**Response:**

```json
{
  "message": "Successfully scanned all Wolt emails",
  "emailsFound": 25,
  "codesProcessed": 24,
  "newCodes": 15,
  "processedCodes": ["CODE123", "CODE456", ...]
}
```

### 2. applyAllCodes.ts

Applies all unused gift card codes for a user sequentially.

**Usage:**

- Endpoint: GET with `userId` query parameter
- Gets all unused codes from database
- Uses Selenium to apply each code on Wolt website
- Marks codes as used after successful application
- Takes screenshots for each attempt
- Creates a Run record to track the bulk operation

**Example:**

```
GET /api/temp/apply-all-codes?userId=your-user-id
```

**Response:**

```json
{
  "message": "Bulk code application completed",
  "runId": 123,
  "totalCodes": 10,
  "successfulApplications": 8,
  "failedApplications": 2,
  "results": [
    {
      "codeId": 1,
      "code": "CODE123",
      "success": true,
      "screenshotUrl": "https://..."
    },
    {
      "codeId": 2,
      "code": "CODE456",
      "success": false,
      "error": "Code input field not found",
      "screenshotUrl": "https://..."
    }
  ]
}
```

## Prerequisites

1. User must have valid Gmail OAuth tokens
2. User must have valid Wolt authentication tokens (wrtoken, wtoken)
3. Database must be properly configured and accessible

## Error Handling

- Individual email processing errors don't stop the entire scan
- Individual code application errors don't stop the entire bulk application
- Screenshots are taken for both successful and failed attempts
- All errors are logged with detailed information

## Safety Features

- Checks for existing codes before saving duplicates
- Marks codes as used only after successful application
- Creates Run records for tracking and auditing
- Includes delays between operations to avoid overwhelming APIs/websites
