import { UserRole } from '../../entities'

export interface TokenPayload {
  userId: number
  email: string
  role: UserRole
}
