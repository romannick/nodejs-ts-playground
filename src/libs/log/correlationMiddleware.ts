import { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'

import { asyncLocalStorage } from './context'

export const correlationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const correlationId = (req.headers['x-correlation-id'] as string) || uuidv4()

  asyncLocalStorage.run({ correlationId }, () => {
    res.setHeader('X-Correlation-ID', correlationId)
    next()
  })
}
