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

export const checkEnvs = (confObj: Object) => {
  checkEnvsRecursive(confObj)
}
