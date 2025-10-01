import { vi } from 'vitest';

// Mock UI components
vi.mock('@nuxt/ui', () => ({
  UIcon: { template: '<div data-testid="mock-icon"></div>' },
  UButton: { template: '<button data-testid="mock-button"><slot /></button>' },
  UAlert: { template: '<div data-testid="mock-alert"><slot /></div>' },
  UAvatar: { template: '<div data-testid="mock-avatar"></div>' },
  UDropdownMenu: { template: '<div data-testid="mock-dropdown"><slot /></div>' }
}))