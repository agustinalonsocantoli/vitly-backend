import z from "zod";

export const FeedbackValidator = z.object({
    diet: z
        .string({
            required_error: "Diet ID is required",
        })
        .min(1),
    responses: z
        .array(
            z.object({
                question: z.string().min(1),
                answer: z.string().min(1),
            })
        ).min(1, "At least one response is required"),
}).describe('FeedbackValidator');
