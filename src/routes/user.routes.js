import { Router } from "express"
import UserControllers from "../app/controllers/UserControllers.js"
import { authToken } from "../app/middlewares/AuthToken.js"

const router = Router()

router.put("/users/:updateType", authToken, UserControllers.update)

export default router