import { NextFunction, Request, Response } from 'express'

import { createLogger } from '@libs/log'
import { CustomError } from './customErrors'

const log = createLogger('ErrorHandler')

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  log.error({ err, url: req.url, method: req.method }, 'Handle error')

  if (err instanceof CustomError) {
     res.status(err.status).send({ message: err.message })
  } else {
    res.status(500).send({ message: 'Internal server error' })
  }
}
