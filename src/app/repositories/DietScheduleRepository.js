import DietSchedule from '../models/DietSchedule.model.js';

class DietScheduleRepository {
    async getByDietAndUser(diet, user) {
        try {
            return await DietSchedule.findOne({ diet, user });
        } catch (error) {
            throw error
        }
    }

    async create(dietSchedule) {
        try {
            return await DietSchedule.create(dietSchedule);
        } catch (error) {
            throw error
        }
    }
}

export default new DietScheduleRepository();