import { vi } from 'vitest';

// Create mock functions that can be reused
const mockNavigateTo = vi.fn()
const mockFetch = vi.fn()
const mockClearSession = vi.fn()
const mockFetchUserSession = vi.fn()
const mockRef = vi.fn((val) => ({ value: val }))
const mockOnMounted = vi.fn((fn) => fn())

// Mock Nuxt auto-imports
vi.mock('#app', () => ({
  navigateTo: mockNavigateTo,
  useUserSession: vi.fn(() => ({
    loggedIn: { value: false },
    user: { value: null },
    fetch: mockFetchUserSession,
    clear: mockClearSession
  })),
  $fetch: mockFetch,
  ref: mockRef,
  computed: vi.fn((fn) => ({ value: fn() })),
  definePageMeta: vi.fn(),
  onMounted: mockOnMounted
}))

// Mock useAuth composable
vi.mock('~/composables/useAuth', () => ({
  useAuth: vi.fn(() => ({
    logout: vi.fn(),
    forceLocalLogout: vi.fn(),
    register: vi.fn(),
    login: vi.fn(),
    validateRegisterForm: vi.fn(),
    validateLoginForm: vi.fn()
  }))
}))

// Mock UI components
vi.mock('@nuxt/ui', () => ({
  UIcon: { template: '<div data-testid="mock-icon"></div>' },
  UButton: { template: '<button data-testid="mock-button"><slot /></button>' },
  UAlert: { template: '<div data-testid="mock-alert"><slot /></div>' },
  UAvatar: { template: '<div data-testid="mock-avatar"></div>' },
  UDropdownMenu: { template: '<div data-testid="mock-dropdown"><slot /></div>' }
}))

// Mock FadeSlideTransition
vi.mock('~/components/ui/FadeSlideTransition.vue', () => ({
  default: { template: '<div data-testid="fade-slide-transition"><slot /></div>' }
}))

// Global mocks
globalThis.ref = mockRef
globalThis.computed = vi.fn((fn) => ({ value: fn() }))
globalThis.defineEmits = vi.fn()
globalThis.defineProps = vi.fn()
globalThis.navigateTo = mockNavigateTo
globalThis.$fetch = mockFetch
globalThis.onMounted = mockOnMounted
globalThis.useUserSession = vi.fn(() => ({
  loggedIn: { value: false },
  user: { value: null },
  fetch: mockFetchUserSession,
  clear: mockClearSession
}))
globalThis.useAuth = vi.fn(() => ({
  logout: vi.fn(),
  forceLocalLogout: vi.fn(),
  register: vi.fn(),
  login: vi.fn(),
  validateRegisterForm: vi.fn(),
  validateLoginForm: vi.fn()
}))