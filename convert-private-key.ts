import bs58 from 'bs58'; // For base58 encoding/decoding
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Convert a private key from a base58 string to a Uint8Array.
 * @param base58PrivateKey - The private key in base58 format.
 * @returns The private key as a Uint8Array.
 */
function privateKeyFromBase58(base58PrivateKey: string): Uint8Array {
  return bs58.decode(base58PrivateKey);
}

/**
 * Convert a private key from a Uint8Array to a base58 string.
 * @param uint8ArrayPrivateKey - The private key as a Uint8Array.
 * @returns The private key in base58 format.
 */
function privateKeyToBase58(uint8ArrayPrivateKey: Uint8Array): string {
  return bs58.encode(uint8ArrayPrivateKey);
}

/**
 * Convert a private key from a comma-separated string to a Uint8Array.
 * @param csvPrivateKey - The private key as a comma-separated string.
 * @returns The private key as a Uint8Array.
 */
function privateKeyFromCSV(csvPrivateKey: string): Uint8Array {
  return new Uint8Array(csvPrivateKey.split(',').map(byte => parseInt(byte.trim()));
}

/**
 * Convert a private key from a Uint8Array to a comma-separated string.
 * @param uint8ArrayPrivateKey - The private key as a Uint8Array.
 * @returns The private key as a comma-separated string.
 */
function privateKeyToCSV(uint8ArrayPrivateKey: Uint8Array): string {
  return Array.from(uint8ArrayPrivateKey).join(',');
}

// Example usage
const base58PrivateKey = process.env.PRIVATE_KEY!;
const csvPrivateKey = '3,221,45,67,89,123,45,67,89,123,45,67,89,123,45,67,89,123,45,67,89,123,45,67,89,123,45,67,89,123,45,67,89,123,45,67,89,123,45,67,89,123,45,67,89,123,45,67,89,123,45,67,89,123,45,67,89,123,45,67,89,123,45,67,89';

// Convert base58 to Uint8Array
const uint8ArrayFromBase58 = privateKeyFromBase58(base58PrivateKey);
console.log('Uint8Array from base58:', uint8ArrayFromBase58);

// Convert Uint8Array to base58
const base58FromUint8Array = privateKeyToBase58(uint8ArrayFromBase58);
console.log('Base58 from Uint8Array:', base58FromUint8Array);

// Convert CSV to Uint8Array
const uint8ArrayFromCSV = privateKeyFromCSV(csvPrivateKey);
console.log('Uint8Array from CSV:', uint8ArrayFromCSV);

// Convert Uint8Array to CSV
const csvFromUint8Array = privateKeyToCSV(uint8ArrayFromCSV);
console.log('CSV from Uint8Array:', csvFromUint8Array);