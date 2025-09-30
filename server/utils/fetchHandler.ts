import type { FetchError } from '~~/server/utils/types'

/**
 * Extracts error message from server-side FetchError in a consistent way
 *
 * @param error - The FetchError object from server-side fetch
 * @param defaultMessage - The fallback message to use if no error message is found
 * @returns The extracted error message
 */
export function handleServerFetchError(error: FetchError, defaultMessage: string): string {
  // Priority: message > error from data, then default
  return error.data?.message
    || error.data?.error
    || defaultMessage
}