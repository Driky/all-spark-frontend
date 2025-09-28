import { z } from 'zod'
import type { FetchError } from '~~/server/utils/types'
import type { H3Event } from 'h3';

export const logoutHandler = async (event: H3Event<Request>) => {
  try {
    // Check for force parameter (skip backend call)
    const query = getQuery(event)
    const force = query.force === 'true'

    if (force) {
      // Force logout - clear session without calling backend
      await clearUserSession(event)
      return { success: true, forced: true }
    }

    // Get current user session
    const session = await getUserSession(event)

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'No active session found'
      })
    }

    // Check if auth token exists
    const apiToken = session.secure?.apiToken
    if (!apiToken) {
      throw createError({
        statusCode: 401,
        statusMessage: 'No authentication token found'
      })
    }

    // Get config
    const config = useRuntimeConfig()

    // Call backend to logout
    await $fetch(`${config.public.apiBase}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`
      }
    }).catch((error: Error) => {
      const fetchError = error as FetchError
      throw createError({
        statusCode: fetchError.statusCode || 500,
        statusMessage: fetchError.data?.message || fetchError.data?.error || 'Backend logout failed'
      })
    })

    // Clear the user session after successful backend logout
    await clearUserSession(event)

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
}

export default defineEventHandler(logoutHandler)