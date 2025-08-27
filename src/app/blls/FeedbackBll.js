import FeedbackRepository from "../repositories/FeedbackRepository";
import validationService from "../services/ValidationService";
import { FeedbackValidator } from "../validators/FeedbackValidators";

class FeedbackBll {
    async getById(id, user) {
        try {
            const feedback = await FeedbackRepository.getById(id, user);
            if (!feedback) createError(404, "Feedback not found");

            return { data: feedback };
        } catch (error) {
            throw error
        }
    }

    async getFeedbackDiet(diet, user) {
        try {
            const feedback = await FeedbackRepository.getByDietAndUser(diet, user);
            if (!feedback) return { data: null };

            return { data: feedback };
        } catch (error) {
            throw error
        }
    }

    async create(feedbackData, user) {
        try {
            const { data, error } = await validationService.validate(FeedbackValidator, feedbackData);
            if (error) throw new Error(error);

            const createFeedback = {
                user,
                ...data
            }

            const feedback = await FeedbackRepository.create(createFeedback);
            return { data: feedback };
        } catch (error) {
            throw error
        }
    }
}

export default new FeedbackBll();