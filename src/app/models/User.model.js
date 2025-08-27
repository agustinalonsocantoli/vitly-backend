import { Schema, model } from 'mongoose'
import { email } from 'zod/v4'

const userSchema = new Schema(
    {
        firstName: { type: String, required: false },
        lastName: { type: String, required: false },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: false },
        password: { type: String, required: true, select: false },

        gender: { type: String, enum: ['male', 'female'], required: false, default: null },
        weight: { type: Number, required: false, default: null },
        height: { type: Number, required: false, default: null },
        age: { type: Number, required: false, default: null },
        activity: { type: String, enum: ['sedentary', 'light', 'moderate', 'active', 'intense'], default: null },
        job: { type: String, required: false, default: null },


        allergens: { type: [String], default: [] },
        intolerances: { type: [String], default: [] },
        dislikedFoods: { type: [String], default: [] },

        strictDiet: { type: Boolean, default: false },
        diet: {
            breakfast: {
                carbohydrates: { type: Number, default: 0 },
                proteins: { type: Number, default: 0 },
                fats: { type: Number, default: 0 },
                vegetables: { type: Number, default: 0 }
            },
            lunch: {
                carbohydrates: { type: Number, default: 0 },
                proteins: { type: Number, default: 0 },
                fats: { type: Number, default: 0 },
                vegetables: { type: Number, default: 0 }
            },
            snack: {
                carbohydrates: { type: Number, default: 0 },
                proteins: { type: Number, default: 0 },
                fats: { type: Number, default: 0 },
                vegetables: { type: Number, default: 0 }
            },
            dinner: {
                carbohydrates: { type: Number, default: 0 },
                proteins: { type: Number, default: 0 },
                fats: { type: Number, default: 0 },
                vegetables: { type: Number, default: 0 }
            },
        },
        goals: {
            type: String, enum: [
                'lose_fast_no_muscle',
                'lose_slow_keep_muscle',
                'lose_gain_muscle',
                'maintain_gain_muscle',
                'maintain_all',
                'gain_muscle_any_fat',
                'gain_muscle_clean',
                'gain_weight_strength',
                'cut_max_keep_muscle',
                'recomp',
            ], default: null
        },

        mealsPerDay: { type: Number, default: 4 },
        exerciseType: { type: [String], default: [] }, // Aca haremos checkbox y pondremos los tipos de ejercicios
        medicalConditions: { type: [String], default: [] },

        createdAt: { type: Date, default: Date.now },
    },
    {
        timestamps: false,
        versionKey: false
    }
)

userSchema.index({ email: 1 })
userSchema.index({ phone: 1 })
userSchema.index({ email: 1, phone: 1 })

const User = model('User', userSchema)

export default User