import mongoose from 'mongoose'
import dotenv from 'dotenv'
import loggerService from '../app/services/LoggerServices.js'
import CollectionServices from '../app/services/CollectionServices.js'

dotenv.config()
const logger = loggerService.getLogger()

export const connectDB = async () => {
    const MONGODB_URL = process.env.MONGODB_URL

    if (!MONGODB_URL) {
        logger.error('MONGODB_URL is required')
        process.exit(1)
    }

    try {
        logger.info('Connect to database started')
        mongoose.set('strictPopulate', false)
        await mongoose.connect(MONGODB_URL)

        await CollectionServices.createAllCollections()

        logger.info('Database connected successfully')
    } catch (error) {
        logger.error('Error connecting to database:', error)
    }
}