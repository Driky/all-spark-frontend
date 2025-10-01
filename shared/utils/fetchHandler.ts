import type { FetchError } from 'ofetch'

/**
 * Extracts error message from FetchError in a consistent way
 *
 * @param error - The FetchError object
 * @param defaultMessage - The fallback message to use if no error message is found
 * @returns The extracted error message
 */
export function handleFetchError(error: FetchError, defaultMessage: string): string {
  // Priority: statusMessage > error > message from data, then error.message, then default
  return error.data?.statusMessage
    || error.data?.error
    || error.data?.message
    || error.message
    || defaultMessage
}