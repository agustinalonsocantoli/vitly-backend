import Diet from '../models/Diet.js';

class DietRepository {
    async getAll(filter, user) {
        try {
            const filters = { user, ...filter };
            return await Diet.find(filters);
        } catch (error) {
            throw error;
        }
    }

    async getById(id, user) {
        try {
            return await Diet.findOne({ _id: id, user }).populate('dietSchedules').lean();
        } catch (error) {
            throw error;
        }
    }

    async getLast(user) {
        try {
            const lastInProgress = await Diet.findOne({ user, status: "progress" }).sort({ createdAt: -1 });
            if (!lastInProgress) {
                return await Diet.findOne({ user }).sort({ createdAt: -1 });
            }

            return lastInProgress;
        } catch (error) {
            throw error;
        }
    }

    async create(data) {
        try {
            return await Diet.create(data);
        } catch (error) {
            throw error;
        }
    }

    async updateStatus(id, status, user) {
        try {
            const diet = await Diet.findOne({ user, _id: id });
            if (!diet) createError(404, "Diet not found");

            return await Diet.findByIdAndUpdate(id, { status }, { new: true });
        } catch (error) {
            throw error;
        }
    }
}

export default new DietRepository();