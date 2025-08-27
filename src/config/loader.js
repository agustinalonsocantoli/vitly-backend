import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import loggerService from '../app/services/LoggerServices.js'
import RouteServices from '../app/services/RouteServices.js'
import { rateLimiter } from '../app/middlewares/RateLimiter.js'

const logger = loggerService.getLogger()
const corsAllowed = process.env.NODE_ENV === "development"
    ? "*"
    : (process.env.CORS_ALLOWED).split(',').map(url => url.trim())

const expressLoader = async () => {
    const app = express()

    app.set('trust proxy', 1)
    app.use((req, res, next) => {
        if (req.url === '/favicon.ico') res.status(204).end();
        else next();
    });
    app.use(morgan((tokens, req, res) => {
        const ip = tokens['remote-addr'](req, res).replace('::ffff:', '')
        const method = tokens["method"](req, res)
        const url = tokens["url"](req, res)
        const status = tokens["status"](req, res)
        const responseTime = tokens['response-time'](req, res);


        return `"${ip}" - ${method} ${url} ${status} ${responseTime} ms`;
    }, {
        stream: {
            write: (message) => logger.info(message.trim())
        }
    }))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                objectSrc: ["'none'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "https:"],
            },
        },
        crossOriginEmbedderPolicy: true,
        crossOriginResourcePolicy: { policy: 'same-origin' },
        referrerPolicy: { policy: 'no-referrer' },
        permissionsPolicy: {
            directives: {
                fullscreen: ["'self'"],
                microphone: ["'self'"],
                camera: ["'self'"],
                geolocation: ["'self'"],
            },
        },
    }))
    app.use((_req, res, next) => {
        res.setHeader('Permissions-Policy', 'fullscreen=(self), microphone=(self), camera=(self), geolocation=(self)');
        next();
    });
    app.use(cors({ origin: corsAllowed }))
    app.use(rateLimiter)

    RouteServices.initializeRoutes(app)

    logger.info('Express configured successfully')
    return app
}

export default expressLoader