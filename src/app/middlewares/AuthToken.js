import jwt from 'jsonwebtoken'

export const authToken = (req, res, next) => {
    try {
        let token = req.headers['authorization']

        if (!token) return res.status(401).json({ message: 'Unauthorized' })

        token = token.replace('Bearer ', '')
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY)

        req.user = decodedToken.id
        next()
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}