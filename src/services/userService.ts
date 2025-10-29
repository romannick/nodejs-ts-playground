import { inject, injectable } from 'tsyringe'
import { DataSource, Repository } from 'typeorm'

import { User } from '../entities'
import { EntityNotFoundError } from '../libs/error/customErrors'
import { createLogger } from '../libs/log/logger'
import { UserDto } from '../types/response'

const log = createLogger('UserService')

@injectable()
class UserService {
  private userRepo: Repository<User>

  constructor(@inject('AppDataSource') dataSource: DataSource) {
    this.userRepo = dataSource.getRepository(User)
  }

  async getUsers(): Promise<UserDto[]> {
    const users = await this.userRepo.find()

    return users.map(this.mapUserToUserDto)
  }

  async getUserById(id: number): Promise<UserDto | null> {
    const user = await this.userRepo.findOneBy({ id })

    if (!user) {
      return null
    }

    return this.mapUserToUserDto(user)
  }

  async updateUser(id: number, data: Partial<User>): Promise<UserDto> {
    const user = await this.userRepo.findOneBy({ id })
    if (!user) {
      throw new EntityNotFoundError(`User with id ${id} was not found.`)
    }

    Object.assign(user, data)
    await this.userRepo.save(user)

    return this.mapUserToUserDto(user)
  }

  async deleteUser(id: number): Promise<boolean> {
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
