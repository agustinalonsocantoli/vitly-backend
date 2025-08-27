import z from "zod";

export const GenerateDietValidator = z.object({
    totalWeeks: z.number({
        required_error: "Total weeks is required",
    })
        .min(1, "Total weeks must be at least 1")
        .max(4, "Total weeks must be at most 4"),
}).describe('GenerateDietValidator');

export const UpdateStatusDietValidator = z.enum(['generated', 'progress', 'completed']).optional().describe('UpdateStatusDietValidator');