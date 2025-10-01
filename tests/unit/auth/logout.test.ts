import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useH3TestUtils } from '~~/tests/unit/setup'
import type { H3Error } from 'h3'

const { getQuery, createError } = useH3TestUtils()

const mockGetUserSession = vi.fn()
const mockClearUserSession = vi.fn()
const mockFetch = vi.fn()
const mockUseRuntimeConfig = vi.fn()

// Stub global functions that are used at module load time
vi.stubGlobal('getUserSession', mockGetUserSession)
vi.stubGlobal('clearUserSession', mockClearUserSession)
vi.stubGlobal('$fetch', mockFetch)
vi.stubGlobal('useRuntimeConfig', mockUseRuntimeConfig)

describe('Server logout handler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should import and call the handler function', async () => {
    const { logoutHandler } = await import('~~/server/api/auth/logout.post')

    expect(typeof logoutHandler).toBe('function')
  })

  it('should call backend API and clear session on successful logout', async () => {
    const mockEvent = { user: 'mock-event' }
    const mockSession = {
      secure: {
        apiToken: 'user-jwt-token'
      }
    }

    // Setup mocks
    getQuery.mockReturnValue({}) // No force parameter
    mockGetUserSession.mockResolvedValue(mockSession)
    mockUseRuntimeConfig.mockReturnValue({
      public: {
        apiBase: 'http://localhost:4000'
      }
    })
    mockFetch.mockResolvedValue({ success: true })
    mockClearUserSession.mockResolvedValue(undefined)

    const { logoutHandler } = await import('~~/server/api/auth/logout.post')
    const result = await logoutHandler(mockEvent)

    expect(mockGetUserSession).toHaveBeenCalledWith(mockEvent)
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer user-jwt-token'
      }
    })
    expect(mockClearUserSession).toHaveBeenCalledWith(mockEvent)
    expect(result).toEqual({ success: true })
  })

  it('should skip backend call and clear session when force=true', async () => {
    const mockEvent = { user: 'mock-event' }

    // Setup mocks for force logout
    getQuery.mockReturnValue({ force: 'true' })
    mockClearUserSession.mockResolvedValue(undefined)

    const { logoutHandler } = await import('~~/server/api/auth/logout.post')
    const result = await logoutHandler(mockEvent)

    // Should skip session check and backend call
    expect(mockGetUserSession).not.toHaveBeenCalled()
    expect(mockFetch).not.toHaveBeenCalled()
    expect(mockClearUserSession).toHaveBeenCalledWith(mockEvent)
    expect(result).toEqual({ success: true, forced: true })
  })

  it('should throw error when no session found', async () => {
    const mockEvent = { user: 'mock-event' }

    // Setup mocks
    getQuery.mockReturnValue({}) // No force parameter
    mockGetUserSession.mockResolvedValue(null)
    createError.mockImplementation((error: Partial<H3Error<unknown>>) => {
      throw new Error(error.statusMessage)
    })

    const { logoutHandler } = await import('~~/server/api/auth/logout.post')

    await expect(logoutHandler(mockEvent)).rejects.toThrow('No active session found')
    expect(mockGetUserSession).toHaveBeenCalledWith(mockEvent)
    expect(mockFetch).not.toHaveBeenCalled()
    expect(mockClearUserSession).not.toHaveBeenCalled()
  })

  it('should throw error when auth token is missing', async () => {
    const mockEvent = { user: 'mock-event' }
    const mockSession = {
      secure: {} // No apiToken
    }

    // Setup mocks
    getQuery.mockReturnValue({}) // No force parameter
    mockGetUserSession.mockResolvedValue(mockSession)
    createError.mockImplementation((error: Partial<H3Error<unknown>>) => {
      throw new Error(error.statusMessage)
    })

    const { logoutHandler } = await import('~~/server/api/auth/logout.post')

    await expect(logoutHandler(mockEvent)).rejects.toThrow('No authentication token found')
    expect(mockGetUserSession).toHaveBeenCalledWith(mockEvent)
    expect(mockFetch).not.toHaveBeenCalled()
    expect(mockClearUserSession).not.toHaveBeenCalled()
  })

  it('should throw error and not clear session when backend fails', async () => {
    const mockEvent = { user: 'mock-event' }
    const mockSession = {
      secure: {
        apiToken: 'user-jwt-token'
      }
    }

    // Setup mocks
    getQuery.mockReturnValue({}) // No force parameter
    mockGetUserSession.mockResolvedValue(mockSession)
    mockUseRuntimeConfig.mockReturnValue({
      public: {
        apiBase: 'http://localhost:4000'
      }
    })
    mockFetch.mockRejectedValue({
      statusCode: 500,
      data: { message: 'Backend logout failed' }
    })
    createError.mockImplementation((error: Partial<H3Error<unknown>>) => {
      throw new Error(error.statusMessage)
    })

    const { logoutHandler } = await import('~~/server/api/auth/logout.post')

    await expect(logoutHandler(mockEvent)).rejects.toThrow('Backend logout failed')
    expect(mockGetUserSession).toHaveBeenCalledWith(mockEvent)
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:4000/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer user-jwt-token'
      }
    })
    expect(mockClearUserSession).not.toHaveBeenCalled()
  })
})