// must come before other imports
import 'reflect-metadata'
import { tracing } from '@libs/metrics'

import express from 'express'
import proxy from 'express-http-proxy'

import { checkEnvs } from '@libs/utils'
import { createLogger, getCorrelationId, httpLogger } from '@libs/log'
import { correlationMiddleware } from '@libs/log'
import { metricsMiddleware, trackHttpRequests } from '@libs/metrics'
import { errorHandler } from '@libs/error'
import { config } from './libs/config'

checkEnvs(config)

const log = createLogger('App')
const app = express()

app.use(express.json())
app.use(correlationMiddleware)
app.use(metricsMiddleware)
app.use(trackHttpRequests)
app.use(httpLogger)

const proxyOptions = {
  proxyReqPathResolver: (req) => req.originalUrl,
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    proxyReqOpts.headers['x-correlation-id'] = getCorrelationId()
    return proxyReqOpts
  },
}

app.use('/api/auth', proxy(config.microservices.user, proxyOptions))
app.use('/api/users', proxy(config.microservices.user, proxyOptions))
app.use('/api/products', proxy(config.microservices.product, proxyOptions))

app.use(errorHandler)

app.listen(config.port, () => log.info(`${config.app} microservice is running on port ${config.port}`))