import UserRepository from "../repositories/UserRepository.js";
import VerifyEmailRepository from "../repositories/VerifyEmailRepository.js";
import validationService from "../services/ValidationService.js";
import { LoginValidator, RegisterValidator, ResendVerifyValidator, VerifyValidator } from "../validators/AuthValidators.js";
import emailService from "../services/EmailServices.js"
import { createError, validateError } from "../services/HandleErrors.js";
import argon2 from "argon2"
import jwt from "jsonwebtoken"
import VerifyEmail from "../models/VerifyEmail.model.js";

class AuthBll {
    async login(credentials) {
        try {
            const { data, error } = await validationService.validate(LoginValidator, credentials)
            if (error) validateError(error);

            const user = await UserRepository.getLoginUser(data.user);
            if (!user) {
                const findVerify = await VerifyEmailRepository.getByEmail(data.user);

                if (findVerify) {
                    const code = await VerifyEmailRepository.generateUniqueCode();
                    const verify = await VerifyEmailRepository.updateCode(data.email, code);

                    if (!verify) createError(500, "Could not create verification");
                    await emailService.sendVerifyCode(data.email, verify.code);

                    return {
                        type: 'verify',
                        user: { email: findVerify.email },
                        token: null,
                    }
                } else {
                    createError(401, "Invalid credentials");
                }
            }

            const verifyPassword = await argon2.verify(user?.password, data?.password)
            if (!verifyPassword) createError(401, "Invalid credentials");

            const token = jwt.sign({ id: user?._id }, process.env.TOKEN_SECRET_KEY)
            const userResponse = await UserRepository.getById(user?._id);

            return {
                type: 'login',
                token,
                user: userResponse
            };
        } catch (error) {
            throw error;
        }
    }

    async register(user) {
        try {
            const { data, error } = await validationService.validate(RegisterValidator, user)
            if (error) validateError(error);

            const findUser = await UserRepository.getByEmail(data.email);
            if (findUser) createError(409, "User already exists");

            const findVerify = await VerifyEmailRepository.getByEmail(data.email);
            const code = await VerifyEmail.generateUniqueCode();
            let verify;

            if (findVerify) {
                verify = await VerifyEmailRepository.updateCode(data.email, code);
            } else {
                verify = await VerifyEmailRepository.createVerify({
                    email: data.email,
                    password: data.password,
                    code: code
                });
            }

            if (!verify) createError(500, "Could not create verification");

            await emailService.sendVerifyCode(data.email, verify.code);

            return {
                type: 'verify',
                user: { email: verify.email }
            }
        } catch (error) {
            throw error;
        }
    }

    async validateVerify(verifyData) {
        try {
            const { data, error } = await validationService.validate(VerifyValidator, verifyData)
            if (error) validateError(error);

            const findVerify = await VerifyEmailRepository.getByEmailAndCode(data.email, data.code);
            if (!findVerify) createError(400, "Invalid verification code");

            if (findVerify.expiredCode < new Date()) createError(400, "Verification code has expired");
            console.log(findVerify)
            const newUser = await UserRepository.register({
                email: findVerify.email,
                password: findVerify.password
            });

            const token = jwt.sign({ id: newUser._id }, process.env.TOKEN_SECRET_KEY)
            const userResponse = await UserRepository.getById(newUser._id);
            await VerifyEmailRepository.deleteVerify(data.email);

            return {
                type: 'login',
                token,
                user: userResponse
            };
        } catch (error) {
            throw error;
        }
    }

    async resendVerify(resendData) {
        try {
            const { data, error } = await validationService.validate(ResendVerifyValidator, resendData)
            if (error) validateError(error);

            const findUser = await UserRepository.getByEmail(data.email);
            if (findUser) createError(409, "User exists and verified");

            const findVerify = await VerifyEmailRepository.getByEmail(data.email);
            if (!findVerify) createError(400, "Invalid email");

            const code = await VerifyEmail.generateUniqueCode();
            const verify = await VerifyEmailRepository.updateCode(data.email, code);
            if (!verify) createError(500, "Could not create verification");

            await emailService.sendVerifyCode(data.email, verify.code);

            return {
                type: 'verify',
                user: { email: findVerify.email }
            }
        } catch (error) {
            throw error;
        }
    }
}

export default new AuthBll();