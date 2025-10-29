import dotenv from 'dotenv'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
// import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'
// import { Resource } from '@opentelemetry/resources'
import { createLogger } from '@libs/log'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { JaegerExporter } from '@opentelemetry/exporter-jaeger'

dotenv.config()

// const traceExporter = new JaegerExporter({
//   endpoint: process.env.JAEGER_HTTP_COLLECTOR,
// })
const traceExporter = new OTLPTraceExporter({
  url: process.env.JAEGER_HTTP_COLLECTOR,
  headers: {},
})
const app = process.env.APP

const sdk = new NodeSDK({
  traceExporter,
  // resource: {
  //   [ATTR_SERVICE_NAME]: app,
  // ),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-http': { enabled: true },
      '@opentelemetry/instrumentation-express': { enabled: true },
      '@opentelemetry/instrumentation-pino': { enabled: true },
    }),
  ],
})

const log = createLogger('Tracing')

sdk.start()
log.info(`🚀 OpenTelemetry (Jaeger) started for ${app}`)

process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => log.info('Tracing terminated'))
    .catch((err) => log.error(`Error shutting down tracing. Error=${err}`))
})
