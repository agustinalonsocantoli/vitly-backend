import log4js from 'log4js'

class LoggerService {
    _env = process.env.NODE_ENV || 'development'

    constructor() {
        this.initializeLogger()
    }

    initializeLogger() {
        log4js.configure({
            appenders: { console: { type: 'console' }, },
            categories: {
                development: {
                    appenders: ['console'],
                    level: 'DEBUG'
                },
                production: {
                    appenders: ['console'],
                    level: 'INFO'
                },
                default: {
                    appenders: ['console'],
                    level: 'DEBUG'
                }
            }
        })

        this.logger = log4js.getLogger(this._env)
    }

    getLogger() {
        return this.logger
    }
}

export default new LoggerService()