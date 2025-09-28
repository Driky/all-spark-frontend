import { loginRequestSchema, loginResponseSchema } from '#shared/schemas/auth'
import type { FetchError, ZodError } from '~~/server/utils/types'

export default defineEventHandler(async (event) => {
  try {
    // Validate request body
    const body = await readBody(event)
    const validatedInput = loginRequestSchema.parse(body)

    // Get config
    const config = useRuntimeConfig()

    // Call backend API
    const response = await $fetch(`${config.public.apiBase}/api/auth/login`, {
      method: 'POST',
      body: validatedInput
    }).catch((error: Error) => {
      // Handle fetch errors
      const fetchError = error as FetchError
      throw createError({
        statusCode: fetchError.statusCode || 500,
        statusMessage: fetchError.data?.message || fetchError.data?.error || 'Login failed'
      })
    })

    // Validate backend response
    const validatedResponse = loginResponseSchema.parse(response)

    // Set user session with encrypted cookie
    await setUserSession(event, {
      user: {
        id: validatedResponse.data.user_id,
        email: validatedInput.email
      },
      loggedInAt: Date.now(),
      secure: {
        apiToken: validatedResponse.data.token
      }
    })

    return { success: true }
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      const zodError = error as ZodError
      throw createError({
        statusCode: 400,
        statusMessage: zodError.errors[0]?.message || 'Invalid request'
      })
    }
    // Re-throw other errors
    throw error
  }
})