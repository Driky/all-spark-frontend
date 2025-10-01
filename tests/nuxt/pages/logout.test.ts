import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import LogoutPage from '~/pages/logout.vue'

// Use vi.hoisted to ensure mocks are initialized before imports
const { mockNavigateTo, mockLogout, mockForceLocalLogout } = vi.hoisted(() => ({
  mockNavigateTo: vi.fn(),
  mockLogout: vi.fn().mockResolvedValue({ success: true, data: undefined }),
  mockForceLocalLogout: vi.fn().mockResolvedValue({ success: true, data: undefined })
}))

// Mock Nuxt auto-imports
mockNuxtImport('navigateTo', () => mockNavigateTo)
mockNuxtImport('useAuth', () => () => ({
  logout: mockLogout,
  forceLocalLogout: mockForceLocalLogout
}))

describe('LogoutPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Reset mocks to prevent test pollution (best practice)
    mockNavigateTo.mockReset()
    mockLogout.mockReset()
    mockForceLocalLogout.mockReset()
  })

  it('should show spinner on mount', async () => {
    const wrapper = await mountSuspended(LogoutPage)

    // Should show loading state
    expect(wrapper.find('[data-testid="logout-spinner"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Signing out...')
  })

  it('should call logout on mount', async () => {
    mockLogout.mockResolvedValue({ success: true, data: undefined })

    await mountSuspended(LogoutPage)

    // mountSuspended waits for async operations
    expect(mockLogout).toHaveBeenCalledTimes(1)
  })

  it('should redirect to /login on successful logout', async () => {
    mockLogout.mockResolvedValue({ success: true, data: undefined })

    await mountSuspended(LogoutPage)

    // navigateTo should be called with '/login'
    expect(mockNavigateTo).toHaveBeenCalledWith('/login')
  })

  it('should show error message on logout failure', async () => {
    const errorMessage = 'Failed to connect to server'
    mockLogout.mockResolvedValue({
      success: false,
      errors: { general: errorMessage }
    })

    const wrapper = await mountSuspended(LogoutPage)

    // Wait for async operations to complete
    await flushPromises()

    // Should show error state
    expect(wrapper.find('[data-testid="logout-error"]').exists()).toBe(true)
    expect(wrapper.text()).toContain(errorMessage)
    expect(wrapper.find('[data-testid="logout-spinner"]').exists()).toBe(false)
  })

  it('should show retry button on failure', async () => {
    mockLogout.mockResolvedValue({
      success: false,
      errors: { general: 'Connection error' }
    })

    const wrapper = await mountSuspended(LogoutPage)

    // Wait for async operations to complete
    await flushPromises()

    const retryButton = wrapper.find('[data-testid="retry-button"]')
    expect(retryButton.exists()).toBe(true)
    expect(retryButton.text()).toContain('Try Again')
  })

  it('should call logout again when retry button is clicked', async () => {
    mockLogout.mockResolvedValueOnce({
      success: false,
      errors: { general: 'Connection error' }
    })

    const wrapper = await mountSuspended(LogoutPage)

    // Wait for first logout attempt
    await flushPromises()

    // Clear mock call history
    mockLogout.mockClear()
    mockLogout.mockResolvedValueOnce({ success: true, data: undefined })

    // Click retry button
    await wrapper.find('[data-testid="retry-button"]').trigger('click')

    expect(mockLogout).toHaveBeenCalledTimes(1)
  })

  it('should show force logout button on failure', async () => {
    mockLogout.mockResolvedValue({
      success: false,
      errors: { general: 'Connection error' }
    })

    const wrapper = await mountSuspended(LogoutPage)

    // Wait for async operations to complete
    await flushPromises()

    const forceButton = wrapper.find('[data-testid="force-logout-button"]')
    expect(forceButton.exists()).toBe(true)
    expect(forceButton.text()).toContain('Force Local Sign Out')
  })

  it('should call forceLocalLogout when force logout button is clicked', async () => {
    mockLogout.mockResolvedValueOnce({
      success: false,
      errors: { general: 'Connection error' }
    })
    mockForceLocalLogout.mockResolvedValueOnce({ success: true, data: undefined })

    const wrapper = await mountSuspended(LogoutPage)

    // Wait for first logout attempt
    await flushPromises()

    // Click force logout button
    await wrapper.find('[data-testid="force-logout-button"]').trigger('click')

    expect(mockForceLocalLogout).toHaveBeenCalledTimes(1)

    // Should redirect after force logout
    await flushPromises()
    expect(mockNavigateTo).toHaveBeenCalledWith('/login')
  })

  it('should show loading state while retrying', async () => {
    mockLogout.mockResolvedValueOnce({
      success: false,
      errors: { general: 'Connection error' }
    })

    const wrapper = await mountSuspended(LogoutPage)

    // Wait for first logout attempt
    await flushPromises()

    // Mock a delayed response for retry
    let resolveLogout: (value: unknown) => void
    mockLogout.mockImplementation(() => new Promise(resolve => {
      resolveLogout = resolve
    }))

    // Click retry button
    await wrapper.find('[data-testid="retry-button"]').trigger('click')
    await flushPromises()

    // Should show loading state during retry (before promise resolves)
    expect(wrapper.find('[data-testid="logout-spinner"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="logout-error"]').exists()).toBe(false)

    // Clean up by resolving the promise
    resolveLogout!({ success: true, data: undefined })
  })
})