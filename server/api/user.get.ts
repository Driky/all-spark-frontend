export default defineEventHandler(async (event) => {
  // Require a user session (returns 401 if no session)
  const session = await requireUserSession(event)

  // Return user information
  return session.user
})