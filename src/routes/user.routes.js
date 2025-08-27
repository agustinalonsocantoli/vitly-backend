import { Router } from "express"
import { authToken } from "../middlewares/AuthMiddleware.js"

const router = Router()

router.put("/users/:updateType", authToken, UserControllers.update)

export default router