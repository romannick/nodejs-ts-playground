import dotenv from 'dotenv'

dotenv.config()

export const config = {
  app: process.env.APP,
  port: Number(process.env.PORT),
  jwt: {
    secret: process.env.JWT_SECRET!,
  },
  microservices: {
    user: process.env.MICROSERVICE_USER,
    product: process.env.MICROSERVICE_PRODUCT,
  }
}