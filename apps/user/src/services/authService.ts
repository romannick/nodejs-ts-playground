import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'
import { DataSource, Repository } from 'typeorm'

import { User, UserCredentials } from '../entities'
import { config } from '../libs/config'
import { Token } from '../types/response'
import { TokenPayload } from '@libs/types'
import { UnauthorizedError, ValidationError } from '@libs/error'
import { createLogger } from '@libs/log'
import { decodeBase64 } from '@libs/utils'

const log = createLogger('AuthService')

@injectable()
class AuthService {
  private userRepo: Repository<User>
  private userCredentialsRepo: Repository<UserCredentials>

  constructor(@inject('AppDataSource') dataSource: DataSource) {
    this.userRepo = dataSource.getRepository(User)
    this.userCredentialsRepo = dataSource.getRepository(UserCredentials)
  }

  async signup(name: string, credentials: string): Promise<Token> {
    const { email, password } = this.parseCredentials(credentials)

    log.debug(`signup: Create user with email ${email}`)

    const existingUser = await this.userRepo.findOneBy({ email })
    if (existingUser) {
      throw new ValidationError(`Email ${email} is already in use`)
    }

    const passwordSeed = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password + passwordSeed, 10)

    const user = this.userRepo.create({
      name,
      email,
      credentials: {
        password: hashedPassword,
        passwordSeed,
      },
    })
    await this.userRepo.save(user)

    return this.generateToken({ userId: user.id, email, role: user.role })
  }

  async login(credentials: string): Promise<Token> {
    const { email, password } = this.parseCredentials(credentials)

    const user = await this.userRepo.findOne({
      where: { email },
      relations: ['credentials'],
    })
    if (!user) {
      throw new UnauthorizedError()
    }

    const isValid = bcrypt.compareSync(
      password + user.credentials.passwordSeed,
      user.credentials.password,
    )
    if (!isValid) {
      throw new UnauthorizedError()
    }

    return this.generateToken({ userId: user.id, email, role: user.role })
  }

  refreshToken(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, config.jwt.secret) as TokenPayload

      return this.generateToken(payload, true)
    } catch (err) {
      log.error(err)
      throw new UnauthorizedError('Invalid or expired refresh token')
    }
  }

  private generateToken(payload: TokenPayload, noOptions = false): Token {
    const accessToken = jwt.sign(
      payload,
      config.jwt.secret,
      noOptions ? undefined : { expiresIn: config.jwt.accessTokenExpiresInSec },
    )
    const refreshToken = jwt.sign(
      payload,
      config.jwt.secret,
      noOptions ? undefined : { expiresIn: config.jwt.refreshTokenExpiresInSec },
    )

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresInSec: config.jwt.accessTokenExpiresInSec,
      refreshTokenExpiresInSec: config.jwt.refreshTokenExpiresInSec,
    }
  }

  private parseCredentials(credentials: string): { email: string; password: string } {
    const decoded = decodeBase64(credentials)

    const credentialsParsed = decoded.split(config.credentialsDelimiter)
    if (credentialsParsed.length !== 2) {
      throw new ValidationError(`Invalid credentials format`)
    }

    const [email, password] = credentialsParsed

    return { email, password }
  }
}

export default AuthService
