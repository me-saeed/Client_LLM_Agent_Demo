/**
 * Shared configuration values.
 *
 * Reads environment variables and exposes app-wide constants
 * with safe defaults when env values are missing.
 */

/** Salt rounds used by bcrypt when hashing passwords. Defaults to 10. */
export const passwordSecret = process.env.PASSWORD_SECRET || 10;
