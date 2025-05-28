import crypto from "crypto";

const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY! || "SP123454321#abc12345678912345678"; // 32 characters long
const ALGORITHM = "aes-256-ecb"; // ECB mode doesn't use IV

console.log("Using encryption key:", ENCRYPTION_KEY.length);
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
  throw new Error("ENCRYPTION_KEY must be exactly 32 characters long");
}

// Simple encryption without IV (less secure)
export function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(
    "aes-256-ecb",
    Buffer.from(ENCRYPTION_KEY),
    null
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

export function decrypt(text: string): string {
  const decipher = crypto.createDecipheriv(
    "aes-256-ecb",
    Buffer.from(ENCRYPTION_KEY),
    null
  );
  let decrypted = decipher.update(text, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// Alternative: Use a fixed IV (still not recommended for production)
export function encryptWithFixedIV(text: string): string {
  const fixedIV = Buffer.from("1234567890123456"); // 16 bytes fixed IV
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY),
    fixedIV
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted; // No IV prefix needed since it's fixed
}

export function decryptWithFixedIV(text: string): string {
  const fixedIV = Buffer.from("1234567890123456"); // Same 16 bytes fixed IV
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY),
    fixedIV
  );
  let decrypted = decipher.update(text, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
