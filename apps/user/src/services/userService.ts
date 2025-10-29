import { inject, injectable } from 'tsyringe'
import { DataSource, Repository } from 'typeorm'

import { User } from '../entities'
import { UserDto } from '../types/response'
import { UpdateUserRequest } from '../types/request'
import { createLogger } from '@libs/log'
import { EntityNotFoundError, ValidationError } from '@libs/error'

const log = createLogger('UserService')

@injectable()
class UserService {
  private userRepo: Repository<User>

  constructor(@inject('AppDataSource') dataSource: DataSource) {
    this.userRepo = dataSource.getRepository(User)
  }

  async getAll(): Promise<UserDto[]> {
    const users = await this.userRepo.find()

    return users.map(this.mapUserToUserDto)
  }

  async getById(id: number): Promise<UserDto | null> {
    const user = await this.userRepo.findOneBy({ id })

    if (!user) {
      return null
    }

    return this.mapUserToUserDto(user)
  }

  async updateById(id: number, request: UpdateUserRequest): Promise<UserDto> {
    const user = await this.userRepo.findOneBy({ id })
    if (!user) {
      throw new EntityNotFoundError(`User with id ${id} was not found.`)
    }

    if(!Object.values(request).length) {
      throw new ValidationError(`At least one of the following properties is required: name`)
    }

    if(request.name !== undefined) {
      user.name = request.name
    }

    await this.userRepo.save(user)

    return this.mapUserToUserDto(user)
  }

  async deleteByid(id: number): Promise<boolean> {
    const user = await this.userRepo.findOneBy({ id })
    if (!user) {
      throw new EntityNotFoundError(`User with id ${id} was not found.`)
    }

    const result = await this.userRepo.delete(id)

    return result.affected !== 0
  }

  private mapUserToUserDto(user: User): UserDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    }
  }
}

export default UserService
