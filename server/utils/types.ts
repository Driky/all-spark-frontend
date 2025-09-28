// Error type for catch blocks
export interface FetchError extends Error {
  statusCode?: number
  data?: {
    message?: string
    error?: string
  }
}
