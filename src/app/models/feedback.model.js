import { Schema, model } from 'mongoose'

const feedbackSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        diet: { type: Schema.Types.ObjectId, ref: 'Diet', required: true },
        responses: {
            type: [{
                question: { type: string, required: true },
                answer: { type: string, required: true },
            }], required: true
        },
        createdAt: { type: Date, default: Date.now },
    },
    {
        timestamps: false,
        versionKey: false
    }
)


feedbackSchema.index({ user: 1 })
feedbackSchema.index({ diet: 1 })
feedbackSchema.index({ user: 1, diet: 1 })

const Feedback = model('Feedback', feedbackSchema)

export default Feedback