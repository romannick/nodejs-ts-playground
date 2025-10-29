import { AsyncLocalStorage } from 'node:async_hooks'

interface RequestContext {
  correlationId: string
}

export const asyncLocalStorage = new AsyncLocalStorage<RequestContext>()

export const getRequestContext = () => asyncLocalStorage.getStore()
export const getCorrelationId = () => getRequestContext()?.correlationId