import { UserRole } from '../enums'

export interface TokenPayload {
  userId: number
  email: string
  role: UserRole
}
