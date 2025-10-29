import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'
import { AuthRequest, TokenPayload, UserRole } from '@libs/types'

export const authMiddleware =
  (requiredRole?: UserRole) => (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid Authorization header' })
    }

    const token = authHeader.split(' ')[1]

    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET) as TokenPayload
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' })
    }

    const insufficientRole = () => {
      res.status(401).json({ message: 'Insufficient access!' })
    }

    switch (requiredRole) {
      case UserRole.Admin: {
        if (req.user.role !== UserRole.Admin) {
          return insufficientRole()
        }
      }
    }

    next()
  }
