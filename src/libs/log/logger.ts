import pino from 'pino'

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
      return correlationId ? { correlationId } : {}
    },
  },
  transport,
)

// Logger factory with module/file name
export const createLogger = (moduleName: string) => baseLogger.child({ module: moduleName })
