import symbol from 'log-symbols'
import pc from 'picocolors'

export const logInfo = (... args) => console.log(`${symbol.info} ${pc.cyan(... args)}`)
export const logSuccess = (... args) => console.log(`${symbol.success} ${pc.green(... args)}`)
export const logError = (... args) => console.log(`${symbol.error} ${pc.red(... args)}`)
export const logWarning = (... args) => console.log(`${symbol.warning} ${pc.orange(... args)}`)