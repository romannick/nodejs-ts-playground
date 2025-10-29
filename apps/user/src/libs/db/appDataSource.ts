import dotenv from 'dotenv'

import { User, UserCredentials } from '../../entities'
import { config } from '../config'
import { createAppDataSource } from 'libs/db'

dotenv.config()

export const AppDataSource = createAppDataSource(
  config.db.host,
  config.db.port,
  config.db.user,
  config.db.password,
  config.db.database,
  [User, UserCredentials],
)