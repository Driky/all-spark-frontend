import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies
const mockFetch = vi.fn()
const mockClearSession = vi.fn()
const mockFetchUserSession = vi.fn()

// Stub global functions
vi.stubGlobal('$fetch', mockFetch)
vi.stubGlobal('useUserSession', () => ({
  fetch: mockFetchUserSession,
  clear: mockClearSession
}))

describe('useAuth composable - logout methods', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('logout', () => {
    it('should call API and clear session on success', async () => {
      mockFetch.mockResolvedValue({ success: true })

      const { useAuth } = await import('~/composables/useAuth')
      const { logout } = useAuth()
      const result = await logout()

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/logout', {
        method: 'POST'
      })
      expect(mockClearSession).toHaveBeenCalled()
      expect(result).toEqual({
        success: true,
        data: undefined
      })
    })

    it('should return error without clearing session on API failure', async () => {
      const errorMessage = 'Server connection failed'
      mockFetch.mockRejectedValue({
        data: { statusMessage: errorMessage }
      })

      const { useAuth } = await import('~/composables/useAuth')
      const { logout } = useAuth()
      const result = await logout()

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/logout', {
        method: 'POST'
      })
      expect(mockClearSession).not.toHaveBeenCalled()
      expect(result).toEqual({
        success: false,
        errors: {
          general: errorMessage
        }
      })
    })

    it('should return generic error message when API error has no statusMessage', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      const { useAuth } = await import('~/composables/useAuth')
      const { logout } = useAuth()
      const result = await logout()

      expect(result).toEqual({
        success: false,
        errors: {
          general: 'Network error'
        }
      })
    })

    it('should return default error message when no error details available', async () => {
      mockFetch.mockRejectedValue({})

      const { useAuth } = await import('~/composables/useAuth')
      const { logout } = useAuth()
      const result = await logout()

      expect(result).toEqual({
        success: false,
        errors: {
          general: 'Logout failed'
        }
      })
    })
  })

  describe('forceLocalLogout', () => {
    it('should clear session without calling API', async () => {
      const { useAuth } = await import('~/composables/useAuth')
      const { forceLocalLogout } = useAuth()
      const result = await forceLocalLogout()

      expect(mockFetch).not.toHaveBeenCalled()
      expect(mockClearSession).toHaveBeenCalled()
      expect(result).toEqual({
        success: true,
        data: undefined
      })
    })

    it('should return success even if clearSession fails', async () => {
      mockClearSession.mockRejectedValue(new Error('Clear session failed'))

      const { useAuth } = await import('~/composables/useAuth')
      const { forceLocalLogout } = useAuth()
      const result = await forceLocalLogout()

      expect(mockClearSession).toHaveBeenCalled()
      // Should still return success for force logout
      expect(result).toEqual({
        success: true,
        data: undefined
      })
    })
  })

  describe('existing methods should still work', () => {
    it('should have register method', async () => {
      const { useAuth } = await import('~/composables/useAuth')
      const { register } = useAuth()
      expect(typeof register).toBe('function')
    })

    it('should have login method', async () => {
      const { useAuth } = await import('~/composables/useAuth')
      const { login } = useAuth()
      expect(typeof login).toBe('function')
    })

    it('should have validation methods', async () => {
      const { useAuth } = await import('~/composables/useAuth')
      const { validateRegisterForm, validateLoginForm } = useAuth()
      expect(typeof validateRegisterForm).toBe('function')
      expect(typeof validateLoginForm).toBe('function')
    })
  })
})