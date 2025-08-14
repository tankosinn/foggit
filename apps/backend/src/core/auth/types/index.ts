export interface UserPayload {
  email: string
  sub?: string
  requiresOnboarding?: boolean
}

export interface ResetPasswordPayload {
  email: string
}
