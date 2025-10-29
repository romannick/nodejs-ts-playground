// must come before other imports
import 'reflect-metadata'
import { tracing } from '@libs/metrics'
import './libs/container'

import express from 'express'

import { config } from './libs/config'
import { AppDataSource } from './libs/db/appDataSource'
import productRouter from './routers/productRouter'
import { checkEnvs } from '@libs/utils'
import { createLogger, httpLogger } from '@libs/log'
import { correlationMiddleware } from '@libs/log'
import { metricsMiddleware, trackHttpRequests } from '@libs/metrics'
import { errorHandler } from '@libs/error'
import { PrometheusLogger } from '@libs/metrics'

checkEnvs(config)

const log = createLogger('App')
const app = express()

app.use(express.json())
app.use(correlationMiddleware)
app.use(metricsMiddleware)
app.use(trackHttpRequests)
app.use(httpLogger)

app.use('/api/products', productRouter)

app.use(errorHandler)

AppDataSource.logger = new PrometheusLogger()
AppDataSource.initialize()
  .then(() => {
    log.info('DataSource initialized')
    app.listen(config.port, () => log.info(`${config.app} microservice is running on port ${config.port}`))
  })
  .catch((err) => log.error(err, 'DataSource initialization failed'))