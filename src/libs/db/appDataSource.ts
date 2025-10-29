import 'reflect-metadata'

import dotenv from 'dotenv'
import { DataSource } from 'typeorm'

import { User, UserCredentials } from '../../entities'
import { config } from '../config'

dotenv.config()

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: config.db.host,
  port: config.db.port,
  username: config.db.user,
  password: config.db.password,
  database: config.db.database,
  synchronize: true, // dev only
  logging: false,
  entities: [User, UserCredentials],
})
