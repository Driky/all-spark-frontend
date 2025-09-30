import { loginRequestSchema, loginResponseSchema } from '#shared/schemas/auth'
import { z } from 'zod'
import type { FetchError } from '~~/server/utils/types'
import { handleServerFetchError } from '~~/server/utils/fetchHandler'

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
        statusMessage: handleServerFetchError(fetchError, 'Login failed')
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