// ============================================================================
// CODE TYPES
// ============================================================================
// Types related to gift codes and promo codes

// Code model - matches backend Code schema
export interface Code {
  id: string; // UUID
  userId: string; // Foreign key to Users table
  runId: string | null; // Foreign key to Runs table (which run generated this code)
  emailId: string | null; // Foreign key to Emails table (which email contained this code)
  code: string; // The actual gift card code
  isUsed: boolean; // Whether the code has been used/redeemed
  dataExpiresAt: Date; // Data retention expiry (daily purge)
  createdAt: Date;
  updatedAt: Date;
}
