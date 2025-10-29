import dotenv from 'dotenv'

dotenv.config()

export const config = {
  app: process.env.APP,
  port: Number(process.env.PORT),
  jwt: {
    secret: process.env.JWT_SECRET!,
    accessTokenExpiresInSec: 60 * 60,
    refreshTokenExpiresInSec: 60 * 60 * 24 * 7,
  },
  db: {
    port: Number(process.env.DB_PORT),
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_DATABASE!,
  },
  credentialsDelimiter: ':'
}