import 'reflect-metadata'
import './libs/container'

import express from 'express'
import promBundle from 'express-prom-bundle'

import { checkEnvs, config } from './libs/config'
import { AppDataSource } from './libs/db/appDataSource'
import { errorHandler } from './libs/error/errorHandler'
import { correlationMiddleware } from './libs/log/correlationMiddleware'
import { createLogger } from './libs/log/logger'
import authRouter from './routers/authRouter'
import userRouter from './routers/userRouter'
import { trackHttpRequests } from './libs/metrics/trackHttpRequests'
import { PrometheusLogger } from './libs/metrics/prometheusLogger'

checkEnvs()

const log = createLogger('App')
const app = express()
const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  promClient: {
    collectDefaultMetrics: {},
  },
  metricsPath: '/metrics',
})

// client.collectDefaultMetrics({ timeout: 5000 })

app.use(express.json())
app.use(correlationMiddleware)
app.use(metricsMiddleware)
app.use(trackHttpRequests);

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)

app.use(errorHandler)

AppDataSource.logger = new PrometheusLogger();
AppDataSource.initialize()
  .then(() => {
    log.info('DataSource initialized')
    app.listen(config.port, () => log.info('Server running on port 3000'))
  })
  .catch((err) => log.error(err, 'DataSource initialization failed'))
