import mongoose from 'mongoose'
import authRoutes from '../../routes/auth.routes.js'
import dietRoutes from '../../routes/diet.routes.js'
import listRoutes from '../../routes/list.routes.js'
import userRoutes from '../../routes/user.routes.js'

class RouteServices {
    constructor() {
        this.routes = [
            authRoutes,
            dietRoutes,
            listRoutes,
            userRoutes
        ]
    }

    healthCheckRoute(app) {
        app.get('/', async (_req, res) => {
            try {
                const healthcheck = {
                    status: 'OK',
                    timestamp: new Date().toISOString(),
                    uptime: process.uptime(),
                    environment: process.env.NODE_ENV || 'development',
                    memory: process.memoryUsage(),
                    database: {
                        status: 'OK',
                        name: mongoose.connection.name,
                        connection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
                    }
                };

                if (mongoose.connection.readyState !== 1) {
                    healthcheck.status = 'ERROR';
                    healthcheck.database.status = 'ERROR';
                    return res.status(503).json(healthcheck);
                }

                res.status(200).json(healthcheck);
            } catch (error) {
                res.status(503).json({
                    status: 'ERROR',
                    timestamp: new Date().toISOString(),
                    error: error.message
                });
            }
        });
    }

    AllRoutes(app) {
        this.routes.forEach((route) => {
            app.use('/v1', route)
        });
    }

    routesNotFound(app) {
        app.use('*', (_req, res) => {
            res.status(404).json({ message: 'Route not found' })
        })
    }

    initializeRoutes(app) {
        this.AllRoutes(app)
        this.healthCheckRoute(app)
        this.routesNotFound(app)
    }
}

export default new RouteServices()