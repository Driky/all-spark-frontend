import { describe, it, expect, vi, beforeEach } from 'vitest'

// Create mock functions
const mockGetQuery = vi.fn()
const mockGetUserSession = vi.fn()
const mockClearUserSession = vi.fn()
const mockCreateError = vi.fn()
const mockUseRuntimeConfig = vi.fn()
const mockFetch = vi.fn()

// Stub global functions that are used at module load time
vi.stubGlobal('defineEventHandler', vi.fn((handler) => handler))
vi.stubGlobal('getQuery', mockGetQuery)
vi.stubGlobal('createError', mockCreateError)
vi.stubGlobal('getUserSession', mockGetUserSession)
vi.stubGlobal('clearUserSession', mockClearUserSession)
vi.stubGlobal('useRuntimeConfig', mockUseRuntimeConfig)
vi.stubGlobal('$fetch', mockFetch)

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
    mockGetQuery.mockReturnValue({}) // No force parameter
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
    mockGetQuery.mockReturnValue({ force: 'true' })
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
    mockGetQuery.mockReturnValue({}) // No force parameter
    mockGetUserSession.mockResolvedValue(null)
    mockCreateError.mockImplementation((error) => {
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
    mockGetQuery.mockReturnValue({}) // No force parameter
    mockGetUserSession.mockResolvedValue(mockSession)
    mockCreateError.mockImplementation((error) => {
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
    mockGetQuery.mockReturnValue({}) // No force parameter
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
    mockCreateError.mockImplementation((error) => {
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