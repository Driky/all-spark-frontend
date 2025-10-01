import { resendVerificationRequestSchema } from '#shared/schemas/auth'
import { z } from 'zod'
import type { FetchError } from '~~/server/utils/types'
import { handleServerFetchError } from '~~/server/utils/fetchHandler'

export default defineEventHandler(async (event) => {
  try {
    // Validate request body
    const body = await readBody(event)
    const validatedInput = resendVerificationRequestSchema.parse(body)

    // Get config
    const config = useRuntimeConfig()

    // Resend verification email
    await $fetch(`${config.public.apiBase}/api/auth/resend-verification`, {
      method: 'POST',
      body: validatedInput
    }).catch((error: Error) => {
      const fetchError = error as FetchError
      throw createError({
        statusCode: fetchError.statusCode || 500,
        statusMessage: handleServerFetchError(fetchError, 'Failed to resend verification email')
      })
    })

    // Return success
    return {
      success: true,
      message: 'Verification email resent successfully'
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