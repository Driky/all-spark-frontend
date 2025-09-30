import { z } from 'zod'

// Backend API response schemas
export const loginResponseSchema = z.object({
  data: z.object({
    token: z.string(),
    user_id: z.string()
  })
})

export const registerResponseSchema = z.object({
  data: z.object({
    user_id: z.string()
  })
})

export const errorResponseSchema = z.object({
  error: z.string()
}).or(z.object({
  message: z.string()
}))

// Password validation regex
// eslint-disable-next-line no-useless-escape
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/

// Request body schemas
export const loginRequestSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
})

export const registerRequestSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(12, 'Password must be at least 12 characters')
    .regex(passwordRegex, 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one symbol')
})

// Frontend form schema with confirmPassword field
export const registerFormSchema = registerRequestSchema
  .extend({
    confirmPassword: z.string().min(12, 'Confirm password must be at least 12 characters')
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match'
  })

// Derive types from schemas
export type LoginResponse = z.infer<typeof loginResponseSchema>
export type RegisterResponse = z.infer<typeof registerResponseSchema>
export type ErrorResponse = z.infer<typeof errorResponseSchema>
export type LoginRequest = z.infer<typeof loginRequestSchema>
export type RegisterRequest = z.infer<typeof registerRequestSchema>
export type RegisterFormInput = z.infer<typeof registerFormSchema>