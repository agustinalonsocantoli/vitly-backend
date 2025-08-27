import User from "../models/User.model";
import VerifyEmail from "../models/VerifyEmail.model";

class VerifyEmailRepository {
    async getByEmail(email) {
        try {
            return await VerifyEmail.findOne({ email }).select('-password');
        } catch (error) {
            throw error;
        }
    }

    async getByEmailAndCode(email, code) {
        try {
            return await VerifyEmail.findOne({ email, code }).select('-password');
        } catch (error) {
            throw error;
        }
    }

    async updateCode(email, code) {
        try {
            return await VerifyEmail.findOneAndUpdate(
                { email },
                { code, expiredCode: new Date(Date.now() + 15 * 60 * 1000) },
                { new: true }
            );
        } catch (error) {
            throw error;
        }
    }

    async createVerify(verifyData) {
        try {
            return await VerifyEmail.create(verifyData);
        } catch (error) {
            throw error;
        }
    }

    async deleteVerify(email) {
        try {
            return await VerifyEmail.findOneAndDelete({ email });
        } catch (error) {
            throw error;
        }
    }
}

export default new VerifyEmailRepository();