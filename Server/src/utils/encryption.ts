import crypto from "crypto";

// Encryption configuration
const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || "dev-fallback-key-32-bytes-long!"; // Should be 32 bytes
const ALGORITHM = "aes-256-cbc";

// Validate encryption key
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length < 32) {
  console.warn(
    "⚠️  ENCRYPTION_KEY is not set or too short. Using fallback key for development."
  );
}

/**
 * Encrypt a plain text string
 */
export function encrypt(text: string): string {
  if (!text) return text;

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Store IV with encrypted data (separated by colon)
  return iv.toString("hex") + ":" + encrypted;
}

/**
 * Decrypt an encrypted string
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText) return encryptedText;

  try {
    const [ivHex, encrypted] = encryptedText.split(":");
    if (!ivHex || !encrypted) {
      throw new Error("Invalid encrypted format");
    }

    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    return encryptedText; // Return as-is if decryption fails (might be plain text from old data)
  }
}
