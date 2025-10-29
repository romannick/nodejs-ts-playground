import { Router } from 'express'
import { container } from 'tsyringe'

import UserService from '../services/userService'
import { UserDto } from '../types/response'
import { UpdateUserRequest } from '../types/request'
import { authMiddleware } from '@libs/middlewares'
import { AuthRequest, IdParams } from '@libs/types'
import { EntityNotFoundError } from '@libs/error'

const router = Router()
const userService = container.resolve(UserService)

router.get('/', authMiddleware(), async (req: AuthRequest<{}, UserDto[], void>, res) => {
  const users = await userService.getAll()

  res.json(users)
})

router.get('/:id', authMiddleware(), async (req: AuthRequest<IdParams, UserDto, void>, res) => {
  const id = req.params.id!
  const user = await userService.getById(id)

  if (!user) {
    throw new EntityNotFoundError(`'User with id=${id} was not found'`)
  }

  res.json(user)
})

router.put(
  '/:id',
  authMiddleware(),
  async (req: AuthRequest<IdParams, UserDto, UpdateUserRequest>, res) => {
    const id = req.params.id!
    const user = await userService.updateById(id, req.body)

    if (!user) {
      throw new EntityNotFoundError(`'User with id=${id} was not found'`)
    }

    res.json(user)
  },
)

router.delete(
  '/:id',
  authMiddleware(),
  async (req: AuthRequest<IdParams, void, void>, res) => {
    const id = req.params.id!
    await userService.deleteByid(id)

    res.status(204).send()
  },
)

export default router
