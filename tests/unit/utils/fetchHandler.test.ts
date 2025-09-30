import { describe, it, expect } from 'vitest'
import { handleFetchError } from '#shared/utils/fetchHandler'
import type { FetchError } from 'ofetch'

describe('fetchHandler utility', () => {
  describe('handleFetchError', () => {
    it('should extract statusMessage from fetchError.data', () => {
      const mockError = {
        data: {
          statusMessage: 'Invalid credentials'
        }
      } as FetchError

      const result = handleFetchError(mockError, 'Login failed')

      expect(result).toBe('Invalid credentials')
    })

    it('should fallback to error message if no statusMessage', () => {
      const mockError = {
        message: 'Network error'
      } as FetchError

      const result = handleFetchError(mockError, 'Login failed')

      expect(result).toBe('Network error')
    })

    it('should use default message if no statusMessage or message', () => {
      const mockError = {} as FetchError

      const result = handleFetchError(mockError, 'Login failed')

      expect(result).toBe('Login failed')
    })

    it('should prioritize statusMessage over message', () => {
      const mockError = {
        data: {
          statusMessage: 'Status message'
        },
        message: 'Error message'
      } as FetchError

      const result = handleFetchError(mockError, 'Default message')

      expect(result).toBe('Status message')
    })

    it('should handle error with only data.message', () => {
      const mockError = {
        data: {
          message: 'Data message'
        }
      } as FetchError

      const result = handleFetchError(mockError, 'Default message')

      expect(result).toBe('Data message')
    })

    it('should handle error with data.error', () => {
      const mockError = {
        data: {
          error: 'Error from backend'
        }
      } as FetchError

      const result = handleFetchError(mockError, 'Default message')

      expect(result).toBe('Error from backend')
    })
  })
})