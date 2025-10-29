import pino from 'pino'
import { context, trace } from '@opentelemetry/api'
import { pinoHttp } from 'pino-http'

import { getCorrelationId } from './context'

const isProduction = process.env.NODE_ENV === 'production'

// Create transport only for dev
const transport = !isProduction
  ? pino.transport({
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        // messageFormat: (log, messageKey) => {
        //   const moduleName = log.module ? `[${log.module}] ` : '';
        //   const requestId = log.requestId ? `[${log.requestId}] ` : '';
        //   return `${requestId}${moduleName}${log[messageKey]}`;
        // },
      },
    })
  : undefined

const baseLogger = pino(
  {
    level: isProduction ? 'info' : 'debug',
    base: null,
    mixin() {
      const correlationId = getCorrelationId()
      const activeSpan = trace.getSpan(context.active())
      const spanCtx = activeSpan?.spanContext()

      return {
        ...(correlationId ? { correlationId } : {}),
        ...(spanCtx ? { traceId: spanCtx.traceId, spanId: spanCtx.spanId } : {}),
      }
    },
  },
  transport,
)

export const createLogger = (moduleName: string) => baseLogger.child({ module: moduleName })

export const httpLogger = pinoHttp({
  logger: baseLogger,
  customLogLevel: (res, err) => 'info',
  customProps: (req, res) => ({
    correlationId: getCorrelationId(),
    method: req.method,
    path: req.url,
  }),
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      query: req.query,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
    err: (err) => ({
      type: err.constructor.name,
      message: err.message,
      stack: err.stack,
    }),
  },
  autoLogging: {
    ignore: (req) => req.url === '/health' || req.url.startsWith('/static'),
  },
  wrapSerializers: true,
  genReqId: (req) => getCorrelationId?.(),
})
