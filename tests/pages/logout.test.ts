import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LogoutPage from '~/pages/logout.vue'

// Mock composables
const mockLogout = vi.fn()
const mockForceLocalLogout = vi.fn()
const mockNavigateTo = vi.fn()

// Mock the useAuth composable for this test
vi.mock('~/composables/useAuth', () => ({
  useAuth: () => ({
    logout: mockLogout,
    forceLocalLogout: mockForceLocalLogout
  })
}))

// Mock Nuxt functions globally for this test
globalThis.useAuth = () => ({
  logout: mockLogout,
  forceLocalLogout: mockForceLocalLogout
})
globalThis.navigateTo = mockNavigateTo
globalThis.definePageMeta = vi.fn()
globalThis.onMounted = vi.fn((fn) => fn())

describe('LogoutPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should show spinner on mount', () => {
    const wrapper = mount(LogoutPage)

    // Should show loading state
    expect(wrapper.find('[data-testid="logout-spinner"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Signing out...')
  })

  it('should call logout on mount', async () => {
    mockLogout.mockResolvedValue({ success: true, data: undefined })

    mount(LogoutPage)

    // Wait for next tick to ensure mounted hook runs
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(mockLogout).toHaveBeenCalledTimes(1)
  })

  it('should redirect to /login on successful logout', async () => {
    mockLogout.mockResolvedValue({ success: true, data: undefined })

    const wrapper = mount(LogoutPage)

    // Wait for async operations
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(mockNavigateTo).toHaveBeenCalledWith('/login')
  })

  it('should show error message on logout failure', async () => {
    const errorMessage = 'Failed to connect to server'
    mockLogout.mockResolvedValue({
      success: false,
      errors: { general: errorMessage }
    })

    const wrapper = mount(LogoutPage)

    // Wait for async operations
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

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

    const wrapper = mount(LogoutPage)

    // Wait for async operations
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    const retryButton = wrapper.find('[data-testid="retry-button"]')
    expect(retryButton.exists()).toBe(true)
    expect(retryButton.text()).toContain('Try Again')
  })

  it('should call logout again when retry button is clicked', async () => {
    mockLogout.mockResolvedValueOnce({
      success: false,
      errors: { general: 'Connection error' }
    })

    const wrapper = mount(LogoutPage)

    // Wait for first logout attempt
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

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

    const wrapper = mount(LogoutPage)

    // Wait for async operations
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

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

    const wrapper = mount(LogoutPage)

    // Wait for first logout attempt
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    // Click force logout button
    await wrapper.find('[data-testid="force-logout-button"]').trigger('click')

    expect(mockForceLocalLogout).toHaveBeenCalledTimes(1)

    // Should redirect after force logout
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(mockNavigateTo).toHaveBeenCalledWith('/login')
  })

  it('should show loading state while retrying', async () => {
    mockLogout.mockResolvedValueOnce({
      success: false,
      errors: { general: 'Connection error' }
    })

    const wrapper = mount(LogoutPage)

    // Wait for first logout attempt
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    // Mock a delayed response for retry
    mockLogout.mockImplementation(() => new Promise(resolve =>
      setTimeout(() => resolve({ success: true, data: undefined }), 100)
    ))

    // Click retry button
    await wrapper.find('[data-testid="retry-button"]').trigger('click')

    // Should show loading state during retry
    expect(wrapper.find('[data-testid="logout-spinner"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="logout-error"]').exists()).toBe(false)
  })
})