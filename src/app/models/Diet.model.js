import { Schema, model } from 'mongoose'
import { format } from 'date-fns'

const dietSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: false, default: () => `Dieta - ${format(new Date(), 'dd/MM/yyyy')}` },
        goals: { type: String, default: Date.now },
        comments: { type: String, default: null },
        forbidden: { type: String, default: null },
        totalWeeks: { type: Number, enum: [1, 2, 3, 4], required: true },
        status: {
            type: String,
            enum: ['generated', 'progress', 'completed'],
            default: 'generated'
        },
        meals: {
            type: [{
                day: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], required: true },
                meal: { type: String, enum: ['breakfast', 'morningSnack', 'lunch', 'afternoonSnack', 'dinner'], required: true },
                isFreeMeal: { type: Boolean, default: false },
                weekNumber: { type: Number, required: true },
                food: {
                    name: { type: String, required: true },
                    cookInstructions: { type: String, default: null },
                    ingredients: {
                        type: [{
                            name: { type: String, required: true },
                            quantity: { type: Number, required: true },
                            unit: {
                                type: String,
                                enum: ['kilogram', 'gram', 'liter', 'milliliter', 'unit'],
                                required: true
                            }
                        }], default: []
                    },
                    maxProtein: { type: Number, required: true },
                    maxCarbs: { type: Number, required: true },
                    maxVegetables: { type: Number, required: true },
                    maxFats: { type: Number, required: true },
                }
            }],
            default: []
        },
        analyzeUser: {
            recommendations: { type: String, default: null },
            calorieNeeds: { type: Number, default: null },
            macroDistribution: { type: String, default: null },
            specialConsiderations: { type: String, default: null },
        },
        createdAt: { type: Date, default: Date.now },
    },
    {
        timestamps: false,
        versionKey: false
    }
)

dietSchema.index({ user: 1 })
dietSchema.index({ user: 1, name: 1 })

dietSchema.virtual('dietSchedules', {
    ref: 'DietSchedule',
    localField: '_id',
    foreignField: 'diet',
    justOne: false,
})
dietSchema.set('toJSON', { virtuals: true });
dietSchema.set('toObject', { virtuals: true });

const Diet = model('Diet', dietSchema)

export default Diet