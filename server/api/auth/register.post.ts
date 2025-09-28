import { registerRequestSchema, registerResponseSchema } from '#shared/schemas/auth'
import { z } from 'zod'
import type { FetchError } from '~~/server/utils/types'

export default defineEventHandler(async (event) => {
  try {
    // Validate request body
    const body = await readBody(event)
    const validatedInput = registerRequestSchema.parse(body)

    // Get config
    const config = useRuntimeConfig()

    // Register user
    const registerResponse = await $fetch(`${config.public.apiBase}/api/auth/register`, {
      method: 'POST',
      body: validatedInput
    }).catch((error: Error) => {
      const fetchError = error as FetchError
      throw createError({
        statusCode: fetchError.statusCode || 500,
        statusMessage: fetchError.data?.message || fetchError.data?.error || 'Registration failed'
      })
    })

    registerResponseSchema.parse(registerResponse)

    // Return success with email for verification message
    // User must verify email before they can login
    return {
      success: true,
      email: validatedInput.email,
      message: 'Registration successful. Please check your email to verify your account.'
    }
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: error.issues[0]?.message || 'Invalid request'
      })
    }
    // Re-throw other errors
    throw error
  }
})