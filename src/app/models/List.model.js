import { Schema, model } from 'mongoose'

const listSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        diet: { type: Schema.Types.ObjectId, ref: 'Diet', required: false },
        name: { type: String, required: true },
        products: [
            {
                product: { type: String, required: true },
                quantity: { type: Number, required: true },
                unit: {
                    type: String,
                    enum: [
                        'kilogram', 'gram', 'liter', 'milliliter', 'unit', 'piece', 'dozen', 'box',
                        'pack', 'bottle', 'can', 'jar', 'bag', 'slice', 'cup', 'bar', 'sachet', 'roll'
                    ],
                    default: 'unit'
                },
            }
        ],
        isFavorite: { type: Boolean, default: false },
        status: {
            type: String,
            enum: ['pending', 'completed', 'archived'],
            default: 'pending'
        },
        totalDays: { type: Number, required: false, default: null },
        createdAt: { type: Date, default: Date.now },
    },
    {
        timestamps: false,
        versionKey: false
    }
)


listSchema.index({ user: 1 })
listSchema.index({ user: 1, name: 1 })
listSchema.index({ user: 1, status: 1 })

const List = model('List', listSchema)



export default List