import ListRepository from '../repositories/ListRepository.js';
import { createError, validateError } from '../services/HandleErrors.js';
import validationService from '../services/ValidationService.js';
import { CreateListValidator } from '../validators/ListValidators.js';

class ListBll {
    async getFilters(params) {
        const filter = {};

        if (params.status) {
            filter.status = params.status;
        }

        if (params.isFavorite) {
            filter.isFavorite = params.isFavorite === 'true';
        }

        if (params.name) {
            filter.name = { $regex: params.name, $options: 'i' };
        }

        return filter;
    }

    async getAll(params, user) {
        try {
            const filters = this.getFilters(params);

            const lists = await ListRepository.getAll(user, filters);

            return { data: lists };
        } catch (error) {
            throw error;
        }
    }

    async getById(id, user) {
        try {
            const list = await ListRepository.getById(user, id);
            if (!list) createError(404, "List not found");

            return { data: list };
        } catch (error) {
            throw error;
        }
    }

    async create(listData, user) {
        try {
            const { data, error } = await validationService.validate(CreateListValidator, listData)
            if (error) validateError(error);

            const createData = {
                user,
                ...data
            }

            const newList = await ListRepository.create(createData);

            return { data: newList };
        } catch (error) {
            throw error;
        }
    }

    async update(id, listData, user) {
        try {
            const { data, error } = await validationService.validate(CreateListValidator, listData)
            if (error) validateError(error);

            const updatedList = await ListRepository.update(user, id, data);

            return { data: updatedList };
        } catch (error) {
            throw error;
        }
    }

    async updateStatus(id, status, user) {
        try {
            const { data, error } = await validationService.validate(UpdateStatusListValidator, status)
            if (error) validateError(error);

            const response = await ListRepository.updateStatus(user, id, data);
            if (!response) createError(500, "Could not update status");

            return { data: "Status updated successfully" };
        } catch (error) {
            throw error;
        }
    }

    async updateFavorite(id, isFavorite, user) {
        try {
            const { data, error } = await validationService.validate(UpdateFavoriteListValidator, isFavorite)
            if (error) validateError(error);

            const response = await ListRepository.updateFavorite(user, id, data);
            if (!response) createError(500, "Could not update favorite");

            return { data: "Favorite status updated successfully" };
        } catch (error) {
            throw error;
        }
    }
}

export default new ListBll();