import expressLoader from './config/loader.js'
import { connectDB } from './config/db.js'
import dotenv from 'dotenv'
import loggerService from './app/services/LoggerServices.js'

dotenv.config()
const logger = loggerService.getLogger()

const main = async () => {
    try {
        const app = await expressLoader()
        await connectDB()

        app.listen(process.env.PORT, () => {
            logger.info(`Server is running on port ${process.env.PORT}`)
        })
    } catch (error) {
        logger.error(error.message)
    }
}

main()