import { randomUUID } from 'crypto'
import type { Request, Response, NextFunction } from 'express'
import { asyncLocalStorage } from './context'

export const correlationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const correlationId =
    (req.headers['x-correlation-id'] as string) || randomUUID()

  asyncLocalStorage.run({ correlationId }, () => {
    req.headers['x-correlation-id'] = correlationId
    res.setHeader('X-Correlation-ID', correlationId)

    next()
  })
}