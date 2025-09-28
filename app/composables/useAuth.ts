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

export interface ValidationResult<T> {
  success: boolean
  data?: T
  errors?: Record<string, string> // Field-specific errors
}

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

  const register = async (form: RegisterFormInput): Promise<RegisterResponse> => {
    // Validate form data
    const validation = validateRegisterForm(form)
    if (!validation.success || !validation.data) {
      // Throw an error with all validation errors
      const errorMessage = validation.errors
        ? Object.values(validation.errors).join(', ')
        : 'Validation failed'
      throw new Error(errorMessage)
    }

    try {
      return await $fetch('/api/auth/register', {
              method: 'POST',
              body: validation.data // Send only email and password
            });

    } catch (error) {
      const fetchError = error as FetchError
      throw new Error(fetchError.data?.statusMessage || fetchError.message || 'Registration failed')
    }
  }

  const login = async (form: LoginRequest): Promise<void> => {
    // Validate form data
    const validation = validateLoginForm(form)
    if (!validation.success || !validation.data) {
      const errorMessage = validation.errors
        ? Object.values(validation.errors).join(', ')
        : 'Validation failed'
      throw new Error(errorMessage)
    }

    try {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: validation.data
      })

      // Refresh session on client after login
      await fetchUserSession()
    } catch (error) {
      const fetchError = error as FetchError
      throw new Error(fetchError.data?.statusMessage || fetchError.message || 'Login failed')
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST'
      })

      // Clear session on client
      await clearSession()
    } catch (error) {
      const fetchError = error as FetchError
      throw new Error(fetchError.data?.statusMessage || fetchError.message || 'Logout failed')
    }
  }

  return {
    register,
    login,
    logout,
    validateRegisterForm,
    validateLoginForm
  }
}