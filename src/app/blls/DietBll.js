import DietRepository from "../repositories/DietRepository.js";
import UserRepository from "../repositories/UserRepository.js";
import DietScheduleRepository from "../repositories/DietScheduleRepository.js";
import { GenerateDietValidator, UpdateStatusDietValidator } from "../validators/DietValidators.js";
import ListServices from "../services/ListServices.js";
import ListRepository from "../repositories/ListRepository.js";
import { createError, validateError } from "../services/HandleErrors.js";
import DietServices from "../services/DietServices.js";
import DietScheduleServices from "../services/DietScheduleServices.js";
import { addWeeks } from "date-fns";

class DietBll {
    async getFilters(params) {
        const filter = {};

        if (params.status) {
            filter.status = params.status;
        }

        return filter;
    }

    async getAll(params, user) {
        try {
            const filter = this.getFilters(params);
            const diets = await DietRepository.getAll(filter, user);

            return { data: diets };
        } catch (error) {
            throw error
        }
    }

    async getById(id, user) {
        try {
            const diet = await DietRepository.getById(id, user);
            if (!diet) createError(404, "Diet not found");

            return { data: diet };
        } catch (error) {
            throw error
        }
    }

    async getLast(user) {
        try {
            const diet = await DietRepository.getLast(user);
            if (!diet) return { data: null };

            return { data: diet };
        } catch (error) {
            throw error
        }
    }

    async generate(dietData, user) {
        try {
            const { data, error } = await validationService.validate(GenerateDietValidator, dietData)
            if (error) validateError(error);

            const userFind = await UserRepository.getById(user);
            if (!userFind) createError(404, "User not found");

            const diet = await DietServices.generateDiet(user, data.totalWeeks);

            const newDiet = {
                user: user._id,
                goals: diet.goals,
                comments: diet.comments,
                forbidden: diet.forbidden,
                totalWeeks: diet.totalWeeks,
                meals: diet.meals,
                analyzeUser: diet.analyzeUser
            }

            const createdDiet = await DietRepository.create(newDiet);
            if (!createdDiet) createError(500, "Could not create diet");

            return { data: createdDiet };
        } catch (error) {
            throw error
        }
    }

    async startDiet(id, user) {
        try {
            const userFind = await UserRepository.getById(user);
            if (!userFind) createError(404, "User not found");

            const diet = await DietRepository.getById(id);
            if (!diet) createError(404, "Diet not found");

            const scheduleData = DietScheduleServices

            const schedule = {
                user: userFind._id,
                diet: diet._id,
                startDate: new Date(),
                meals: scheduleData,
                endDate: addWeeks(new Date(), diet.totalWeeks)
            }

            const newSchedule = await DietScheduleRepository.create(schedule)
            if (!newSchedule) createError(500, "Clound not create schedule")

            return { data: newSchedule }
        } catch (error) {
            throw error
        }
    }

    async dietToList(id, user) {
        try {
            const userFind = await UserRepository.getById(user);
            if (!userFind) createError(404, "User not found");

            const diet = await DietRepository.getById(id);
            if (!diet) createError(404, "Diet not found");

            const listData = await ListServices.generateListByDiet(diet);

            const list = {
                user: userFind._id,
                diet: diet._id,
                name: `Lista ${diet.name}`,
                products: listData,
                totalDays: diet.totalWeeks * 7
            }

            const newList = await ListRepository.create(list);
            if (!newList) createError(500, "Could not create list");

            return { data: newList };
        } catch (error) {
            throw error
        }
    }

    async updateStatus(id, status, user) {
        try {
            const { data, error } = await validationService.validate(UpdateStatusDietValidator, status)
            if (error) validateError(error);

            const response = await DietRepository.updateStatus(id, data, user);
            if (!response) createError(500, "Could not update status");

            return { data: "Status updated successfully" };
        } catch (error) {
            throw error
        }
    }
}

export default new DietBll();