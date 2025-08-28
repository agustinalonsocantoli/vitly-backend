import UserRepository from "../repositories/UserRepository.js";
import validationService from "../services/ValidationService.js";
import { createError } from "../services/HandleErrors.js";
import { UpdateTypesValidation, UpdateUserValidation } from "../validators/UserValidators.js";

class UserBll {
    async updateUser(userId, updateData, updateType) {
        try {
            const { data, error } = await validationService.validate(UpdateUserValidation, updateData);
            const { data: typeData, error: typeError } = await validationService.validate(UpdateTypesValidation, updateType);

            if (error) throw new Error(error);
            if (typeError) throw new Error(typeError);
            if (!userId) createError(401, "Unauthorized");

            switch (typeData) {
                case 'breakfast':
                    return await UserRepository.updateBreakfast(userId, data);
                case 'lunch':
                    return await UserRepository.updateLunch(userId, data);
                case 'snack':
                    return await UserRepository.updateSnack(userId, data);
                case 'dinner':
                    return await UserRepository.updateDinner(userId, data);
                default:
                    return await UserRepository.update(userId, data);
            }
        } catch (error) {
            throw error;
        }
    }
}

export default new UserBll();