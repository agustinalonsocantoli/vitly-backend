import { Schema, model } from 'mongoose'

const feedbackQuestionSchema = new Schema(
    {
        question: { type: String, required: true },
        placeholder: { type: String, required: false, default: null },
        type: { type: String, enum: ['freeText', 'multipleChoice'], required: true },
        order: { type: Number, required: true },
        options: { type: [String], required: false, default: [] },
        createdAt: { type: Date, default: Date.now },
    },
    {
        timestamps: false,
        versionKey: false
    }
)

feedbackQuestionSchema.index({ diet: 1 })

const FeedbackQuestion = model('FeedbackQuestion', feedbackQuestionSchema)



export default FeedbackQuestion