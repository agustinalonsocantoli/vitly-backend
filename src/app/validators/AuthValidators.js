import { z } from "zod"

export const LoginValidator = z.object({
    user: z
        .string({
            required_error: "Email/Phone is required",
        })
        .trim()
        .toLowerCase(),

    password: z
        .string({
            required_error: "Password is required",
        })
}).describe('LoginValidator')

export const RegisterValidator = z.object({
    email: z
        .string({
            required_error: "Email is required",
        })
        .email("Invalid email format")
        .trim()
        .toLowerCase(),
    password: z
        .string({
            required_error: "Password is required",
        })
        .min(8, "Password must be at least 8 characters"),
}).describe('RegisterValidator')

export const VerifyValidator = z.object({
    email: z
        .string({
            required_error: "Email is required",
        })
        .email("Invalid email format")
        .trim()
        .toLowerCase(),
    code: z
        .string({
            required_error: "Code is required",
        })
        .min(6, "Code must be 6 characters")
        .max(6, "Code must be 6 characters"),
}).describe('VerifyValidator')

export const ResendVerifyValidator = z.object({
    email: z
        .string({
            required_error: "Email is required",
        })
        .email("Invalid email format")
        .trim()
        .toLowerCase(),
}).describe('ResendVerifyValidator')