import { z } from 'zod'

export const UpdateTypesValidation = z.enum(['breakfast', 'lunch', 'snack', 'dinner', 'general']).describe('UpdateTypesValidation')

export const UpdateUserValidation = z.object({
    firstName: z
        .string()
        .min(1, "First name must be at least 1 characters")
        .optional(),
    lastName: z
        .string()
        .min(1, "Last name must be at least 1 characters")
        .optional(),
    phone: z
        .string()
        .min(1, "Phone number must be at least 1 character")
        .optional(),
    weigth: z
        .number()
        .min(0, "Weight must be a positive number")
        .optional(),
    height: z
        .number()
        .min(0, "Height must be a positive number")
        .optional(),
    age: z
        .number()
        .min(0, "Age must be a positive number")
        .max(90, "Age must be less than or equal to 90")
        .optional(),
    activity: z
        .enum(['sedentary', 'light', 'moderate', 'active', 'intense'])
        .optional()
        .nullable(),
    job: z
        .string()
        .min(1, "Job must be at least 1 character")
        .optional(),
    allergens: z
        .array(z.string())
        .optional(),
    intolerances: z
        .array(z.string())
        .optional(),
    strictDiet: z
        .boolean()
        .optional(),
    diet: z
        .object({
            breakfast: z.object({
                carbohydrates: z.number({
                    required_error: "Carbohydrates for breakfast are required",
                }),
                proteins: z.number({
                    required_error: "Proteins for breakfast are required",
                }),
                fats: z.number({
                    required_error: "Fats for breakfast are required",
                }),
                vegetables: z.number({
                    required_error: "Vegetables for breakfast are required",
                }),
            }).optional(),
            lunch: z.object({
                carbohydrates: z.number({
                    required_error: "Carbohydrates for breakfast are required",
                }),
                proteins: z.number({
                    required_error: "Proteins for breakfast are required",
                }),
                fats: z.number({
                    required_error: "Fats for breakfast are required",
                }),
                vegetables: z.number({
                    required_error: "Vegetables for breakfast are required",
                }),
            }).optional(),
            snack: z.object({
                carbohydrates: z.number({
                    required_error: "Carbohydrates for breakfast are required",
                }),
                proteins: z.number({
                    required_error: "Proteins for breakfast are required",
                }),
                fats: z.number({
                    required_error: "Fats for breakfast are required",
                }),
                vegetables: z.number({
                    required_error: "Vegetables for breakfast are required",
                }),
            }).optional(),
            dinner: z.object({
                carbohydrates: z.number({
                    required_error: "Carbohydrates for breakfast are required",
                }),
                proteins: z.number({
                    required_error: "Proteins for breakfast are required",
                }),
                fats: z.number({
                    required_error: "Fats for breakfast are required",
                }),
                vegetables: z.number({
                    required_error: "Vegetables for breakfast are required",
                }),
            }).optional(),
        })
        .optional()
        .nullable(),
    goals: z
        .enum([
            'lose_fast_no_muscle',
            'lose_slow_keep_muscle',
            'lose_gain_muscle',
            'maintain_gain_muscle',
            'maintain_all',
            'gain_muscle_any_fat',
            'gain_muscle_clean',
            'gain_weight_strength',
            'cut_max_keep_muscle',
            'recomp'
        ])
        .optional()
        .nullable(),
    dislikedFoods: z
        .array(z.string())
        .optional()
        .nullable(),
    mealsPerDay: z
        .number()
        .optional()
        .nullable(),
    exerciseType: z
        .array(z.string())
        .optional()
        .nullable(),
    medicalConditions: z
        .array(z.string())
        .optional()
        .nullable(),

}).describe('UpdateUserValidation')
