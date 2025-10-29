import { Request, Router } from 'express'
import { container } from 'tsyringe'

import AuthService from '../services/authService'
import { RefreshTokenRequest, SignupRequest } from '../types/request'
import { Token } from '../types/response'
import { LoginRequest } from '../types/request'
import { ValidationError } from '@libs/error'

const router = Router()
const authService = container.resolve(AuthService)

router.post('/signup', async (req: Request<void, Token, SignupRequest>, res) => {
  const { name, credentials } = req.body

  const token = await authService.signup(name, credentials)

  res.status(201).send(token)
})

router.post('/login', async (req: Request<void, Token, LoginRequest>, res) => {
  const token = await authService.login(req.body.credentials)

  res.status(200).send(token)
})

router.post('/refresh', async (req: Request<{}, Token, RefreshTokenRequest>, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) {
    throw new ValidationError("'refreshToken' is required!")
  }

  const token = authService.refreshToken(refreshToken)

  res.status(200).send(token)
})

export default router
