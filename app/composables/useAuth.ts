import type { FetchError } from 'ofetch'
import { z } from 'zod'
import {
  loginRequestSchema,
  registerFormSchema,
  type LoginRequest,
  type RegisterRequest,
  type RegisterFormInput
} from '#shared/schemas/auth'

export interface RegisterResponse {
  success: boolean
  email: string
  message: string
}

// Discriminated union types for type-safe error handling
export type SuccessResult<T> = {
  success: true
  data: T
  errors?: never
}

export type ErrorResult = {
  success: false
  errors: Record<string, string>
  data?: never
}

export type ValidationResult<T> = SuccessResult<T> | ErrorResult

export const useAuth = () => {
  const { fetch: fetchUserSession, clear: clearSession } = useUserSession()

  const validateRegisterForm = (form: RegisterFormInput): ValidationResult<RegisterRequest> => {
    try {
      const validated = registerFormSchema.parse(form)
      // Return only email and password for the API call
      return {
        success: true,
        data: {
          email: validated.email,
          password: validated.password
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Create a map of field names to error messages
        const errors: Record<string, string> = {}
        error.issues.forEach((issue) => {
          const field = issue.path.join('.')
          // Only store the first error for each field
          if (!errors[field]) {
            errors[field] = issue.message
          }
        })
        return {
          success: false,
          errors
        }
      }
      return {
        success: false,
        errors: { general: 'Validation failed' }
      }
    }
  }

  const validateLoginForm = (form: LoginRequest): ValidationResult<LoginRequest> => {
    try {
      const validated = loginRequestSchema.parse(form)
      return { success: true, data: validated }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {}
        error.issues.forEach((issue) => {
          const field = issue.path.join('.')
          if (!errors[field]) {
            errors[field] = issue.message
          }
        })
        return {
          success: false,
          errors
        }
      }
      return {
        success: false,
        errors: { general: 'Validation failed' }
      }
    }
  }

  const register = async (form: RegisterFormInput): Promise<ValidationResult<RegisterResponse>> => {
    // Validate form data
    const validation = validateRegisterForm(form)
    if (!validation.success) {
      return validation
    }

    try {
      const response = await $fetch('/api/auth/register', {
        method: 'POST',
        body: validation.data // Send only email and password
      })
      return {
        success: true,
        data: response
      }
    } catch (error) {
      const fetchError = error as FetchError
      return {
        success: false,
        errors: {
          general: fetchError.data?.statusMessage || fetchError.message || 'Registration failed'
        }
      }
    }
  }

  const login = async (form: LoginRequest): Promise<ValidationResult<void>> => {
    // Validate form data
    const validation = validateLoginForm(form)
    if (!validation.success) {
      return validation
    }

    try {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: validation.data
      })

      // Refresh session on client after login
      await fetchUserSession()

      return {
        success: true,
        data: undefined
      }
    } catch (error) {
      const fetchError = error as FetchError
      return {
        success: false,
        errors: {
          general: fetchError.data?.statusMessage || fetchError.message || 'Login failed'
        }
      }
    }
  }

  const logout = async (): Promise<ValidationResult<void>> => {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST'
      })

      // Clear session on client
      await clearSession()

      return {
        success: true,
        data: undefined
      }
    } catch (error) {
      const fetchError = error as FetchError
      return {
        success: false,
        errors: {
          general: fetchError.data?.statusMessage || fetchError.message || 'Logout failed'
        }
      }
    }
  }

  const forceLocalLogout = async (): Promise<ValidationResult<void>> => {
    try {
      // Clear session without calling API
      await clearSession()

      return {
        success: true,
        data: undefined
      }
    } catch (error) {
      // Force logout should always succeed
      return {
        success: true,
        data: undefined
      }
    }
  }

  return {
    register,
    login,
    logout,
    forceLocalLogout,
    validateRegisterForm,
    validateLoginForm
  }
}