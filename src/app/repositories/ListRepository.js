import List from "../models/List.model.js";
import { createError } from "../services/HandleErrors.js";

class ListRepository {
    async getAll(user, filter = {}) {
        try {
            const filters = { user, ...filter };
            return await List.find(filters);
        } catch (error) {
            throw error;
        }
    }

    async getById(user, id) {
        try {
            return await List.findOne({ user, _id: id });
        } catch (error) {
            throw error;
        }
    }

    async create(data) {
        try {
            return await List.create(data);
        } catch (error) {
            throw error;
        }
    }

    async update(user, id, data) {
        try {
            const list = await List.findOne({ user, _id: id });
            if (!list) createError(404, "List not found");

            return await List.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            throw error;
        }
    }

    async updateStatus(user, id, status) {
        try {
            const list = await List.findOne({ user, _id: id });
            if (!list) createError(404, "List not found");

            return await List.findByIdAndUpdate(id, { status }, { new: true });
        } catch (error) {
            throw error;
        }
    }

    async updateFavorite(user, id, isFavorite) {
        try {
            const list = await List.findOne({ user, _id: id });
            if (!list) createError(404, "List not found");

            return await List.findByIdAndUpdate(id, { isFavorite }, { new: true });
        } catch (error) {
            throw error;
        }
    }
}

export default new ListRepository();