import loggerService from './LoggerServices.js'
import User from '../models/User.model.js'
import List from '../models/List.model.js'
import Diet from '../models/Diet.model.js'
import VerifyEmail from '../models/VerifyEmail.model.js'
import DietSchedule from '../models/DietSchedule.model.js'
import Feedback from '../models/feedback.model.js'
import FeedbackQuestion from '../models/feedbackQuestion.model.js'

class CollectionServices {
    constructor() {
        this.logger = loggerService.getLogger()

        this.collections = [
            { schema: User, collectionName: 'users' },
            { schema: List, collectionName: 'lists' },
            { schema: Diet, collectionName: 'diets' },
            { schema: VerifyEmail, collectionName: 'verifyEmails' },
            { schema: DietSchedule, collectionName: 'dietSchedules' },
            { schema: Feedback, collectionName: 'feedback' },
            { schema: FeedbackQuestion, collectionName: 'feedbackQuestions' },
        ]
    }

    async createAllCollections() {
        this.collections.forEach(async ({ schema, collectionName }) => {
            await schema.createCollection()

            this.logger.info(`Collection ${collectionName} created successfully`)
        })
    }
}

export default new CollectionServices()