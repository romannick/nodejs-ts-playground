import dotenv from 'dotenv'

dotenv.config()

export const config = {
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

const checkEnvsRecursive = (obj: Record<string, any>, prefix = '') => {
  Object.entries(obj).forEach(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key

    if (value === undefined || value === null) {
      throw new Error(`Missing environment variable: ${fullKey}`)
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      checkEnvsRecursive(value, fullKey)
    }
  })
}

export const checkEnvs = () => {
  checkEnvsRecursive(config)
}
