import User from "../models/User.model";

class UserRepository {
    async getUsers() {
        try {
            return await User.find().select('-password');
        } catch (error) {
            throw error;
        }
    }

    async getById(userId) {
        try {
            return await User.findById(userId).select('-password');
        } catch (error) {
            throw error;
        }
    }

    async getByEmail(email) {
        try {
            return await User.findOne({ email }).select('-password');
        } catch (error) {
            throw error;
        }
    }

    async getLoginUser(identifier) {
        try {
            return await User.findOne({
                $or: [
                    { email: identifier },
                    { phone: identifier }
                ]
            }).select('+password');
        } catch (error) {
            throw error;
        }
    }

    async update(userId, updateData) {
        try {
            return await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
        } catch (error) {
            throw error;
        }
    }

    async updateBreakfast(userId, breakfastData) {
        try {
            return await User.findByIdAndUpdate(userId,
                { $set: { 'diet.breakfast': breakfastData } },
                { new: true }
            ).select('-password');
        } catch (error) {
            throw error;
        }
    }

    async updateLunch(userId, lunchData) {
        try {
            return await User.findByIdAndUpdate(userId,
                { $set: { 'diet.lunch': lunchData } },
                { new: true }
            ).select('-password');
        } catch (error) {
            throw error;
        }
    }

    async updateSnack(userId, snackData) {
        try {
            return await User.findByIdAndUpdate(userId,
                { $set: { 'diet.snack': snackData } },
                { new: true }
            ).select('-password');
        } catch (error) {
            throw error;
        }
    }

    async updateDinner(userId, dinnerData) {
        try {
            return await User.findByIdAndUpdate(userId,
                { $set: { 'diet.dinner': dinnerData } },
                { new: true }
            ).select('-password');
        } catch (error) {
            throw error;
        }
    }

    async register(userData) {
        try {
            return await User.create(userData);
        } catch (error) {
            throw error;
        }
    }
}

export default new UserRepository();