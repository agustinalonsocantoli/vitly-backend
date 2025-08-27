import { z } from "zod"

export const CreateListValidator = z.object({
    name: z.string().min(1, "Name is required"),
    products: z
        .array(
            z.object({
                product: z.string().min(1),
                quantity: z.number().min(1),
                unit: z.enum([
                    'kilogram', 'gram', 'liter', 'milliliter', 'unit', 'piece', 'dozen', 'box',
                    'pack', 'bottle', 'can', 'jar', 'bag', 'slice', 'cup', 'bar', 'sachet', 'roll'
                ]),
            })
        )
        .optional(),
    totalDays: z.number().min(1).optional().nullable(),
}).describe('CreateListValidator');

export const UpdateListValidator = z.object({
    name: z.string().min(1).optional(),
    products: z
        .array(
            z.object({
                product: z.string().min(1),
                quantity: z.number().min(1),
                unit: z.enum([
                    'kilogram', 'gram', 'liter', 'milliliter', 'unit', 'piece', 'dozen', 'box',
                    'pack', 'bottle', 'can', 'jar', 'bag', 'slice', 'cup', 'bar', 'sachet', 'roll'
                ]),
            })
        ).optional(),
    totalDays: z.number().min(1).optional().nullable(),
}).describe('UpdateListValidator');

export const UpdateStatusListValidator = z.enum(['pending', 'completed', 'archived']).optional().describe('UpdateStatusListValidator');
export const UpdateFavoriteListValidator = z.boolean().optional().describe('UpdateFavoriteListValidator');
