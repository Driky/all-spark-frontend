// Error type for catch blocks
export interface FetchError extends Error {
  statusCode?: number
  data?: {
    message?: string
    error?: string
  }
}

export interface ZodError extends Error {
  name: 'ZodError'
  errors: Array<{
    message?: string
  }>
}