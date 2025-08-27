import { Schema, model } from 'mongoose'

const dietScheduleSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        diet: { type: Schema.Types.ObjectId, ref: 'Diet', required: true },
        startDate: { type: Date, default: Date.now },
        endDate: { type: Date, required: true },
        meals: {
            type: [{
                day: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], required: true },
                week: { type: Number, required: true },
                date: { type: Date, required: true },
            }],
            default: []
        },
        createdAt: { type: Date, default: Date.now },
    },
    {
        timestamps: false,
        versionKey: false
    }
)

dietScheduleSchema.index({ user: 1 })
dietScheduleSchema.index({ diet: 1 })
dietScheduleSchema.index({ user: 1, diet: 1 })



const DietSchedule = model('DietSchedule', dietScheduleSchema)

export default DietSchedule