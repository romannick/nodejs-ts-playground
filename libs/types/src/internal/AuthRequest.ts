import { Request } from 'express'
import { TokenPayload } from '@libs/types'

export interface AuthRequest<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: TokenPayload
}
