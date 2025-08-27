import Feedback from "../models/feedback.model";

class FeedbackRepository {
    async getById(id, user) {
        try {
            return await Feedback.findOne({ _id: id, user });
        } catch (error) {
            throw error;
        }
    }

    async getByDietAndUser(diet, user) {
        try {
            return await Feedback.findOne({ diet, user });
        } catch (error) {
            throw error;
        }
    }

    async create(data) {
        try {
            return await Feedback.create(data);
        } catch (error) {
            throw error;
        }
    }
}

export default new FeedbackRepository();