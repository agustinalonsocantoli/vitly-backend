import { Schema, model } from 'mongoose'
import argon2 from 'argon2'

const verifyEmailSchema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        code: { type: String, required: true, unique: true },
        expiredCode: { type: Date, default: () => new Date(Date.now() + 15 * 60 * 1000) },
        createdAt: { type: Date, default: Date.now },
    },
    {
        timestamps: false,
        versionKey: false
    }
)

verifyEmailSchema.index({ email: 1 })
verifyEmailSchema.index({ code: 1 })
verifyEmailSchema.index({ email: 1, code: 1 })

verifyEmailSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await argon2.hash(this.password)

        next()
    }
    else next()
})

verifyEmailSchema.methods.generateUniqueCode = async function () {
    let code;
    let isUnique = false;

    while (!isUnique) {
        code = Math.floor(100000 + Math.random() * 900000).toString();

        const existingCode = await VerifyEmail.findOne({ code });

        if (!existingCode) {
            isUnique = true;
        }
    }

    return code;
}

const VerifyEmail = model('VerifyEmail', verifyEmailSchema)

export default VerifyEmail