// must come before other imports
import 'reflect-metadata'
import { tracing } from '@libs/metrics'
import './libs/container'

import express from 'express'

import { config } from './libs/config'
import { AppDataSource } from './libs/db/appDataSource'

import authRouter from './routers/authRouter'
import userRouter from './routers/userRouter'
import { metricsMiddleware, trackHttpRequests } from '@libs/metrics'
import { correlationMiddleware, httpLogger } from '@libs/log'
import { errorHandler } from '@libs/error'
import { createLogger } from '@libs/log'
import { PrometheusLogger } from '@libs/metrics'
import { checkEnvs } from '@libs/utils'

checkEnvs(config)

const log = createLogger('App')
const app = express()

app.use(express.json())
app.use(correlationMiddleware)
app.use(metricsMiddleware)
app.use(trackHttpRequests)
app.use(httpLogger)

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)

app.use(errorHandler)

AppDataSource.logger = new PrometheusLogger()
AppDataSource.initialize()
  .then(() => {
    log.info('DataSource initialized')
    app.listen(config.port, () => log.info(`${config.app} microservice is running on port ${config.port}`))
  })
  .catch((err) => log.error(err, 'DataSource initialization failed'))
