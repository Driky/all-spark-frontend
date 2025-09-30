declare module '#auth-utils' {
  interface User {
    id: string
    email: string
  }

  interface UserSession {
    user: User
    loggedInAt: number
  }

  interface SecureSessionData {
    apiToken: string
  }
}

export {}