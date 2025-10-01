import { describe, it, expect } from 'vitest'
import { registerRequestSchema } from '#shared/schemas/auth'

describe('Auth Schemas - Password Validation', () => {
  describe('registerRequestSchema', () => {
    const validEmail = 'test@example.com'

    it('should accept password with uppercase, lowercase, digit, and symbol', () => {
      const result = registerRequestSchema.safeParse({
        email: validEmail,
        password: 'ValidPass123!'
      })

      expect(result.success).toBe(true)
    })

    it('should reject password without uppercase letter', () => {
      const result = registerRequestSchema.safeParse({
        email: validEmail,
        password: 'validpass123!'
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('uppercase')
      }
    })

    it('should reject password without lowercase letter', () => {
      const result = registerRequestSchema.safeParse({
        email: validEmail,
        password: 'VALIDPASS123!'
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('lowercase')
      }
    })

    it('should reject password without digit', () => {
      const result = registerRequestSchema.safeParse({
        email: validEmail,
        password: 'ValidPassword!'
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('digit')
      }
    })

    it('should reject password without symbol', () => {
      const result = registerRequestSchema.safeParse({
        email: validEmail,
        password: 'ValidPass123'
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('symbol')
      }
    })

    it('should reject password shorter than 12 characters', () => {
      const result = registerRequestSchema.safeParse({
        email: validEmail,
        password: 'Valid1!'
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('12 characters')
      }
    })

    it('should accept password with exactly 12 characters meeting all requirements', () => {
      const result = registerRequestSchema.safeParse({
        email: validEmail,
        password: 'ValidPass12!'
      })

      expect(result.success).toBe(true)
    })

    it('should accept password with special characters in various positions', () => {
      const passwords = [
        '!ValidPass123',
        'ValidPass123@',
        'Valid#Pass123',
        'Valid$Pass123'
      ]

      passwords.forEach(password => {
        const result = registerRequestSchema.safeParse({
          email: validEmail,
          password
        })

        expect(result.success).toBe(true)
      })
    })
  })
})