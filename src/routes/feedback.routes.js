import { Router } from "express"
import FeedbackControllers from "../app/controllers/FeedbackControllers.js"
import { authToken } from "../app/middlewares/AuthToken.js"

const router = Router()

router.get("/feedback/:diet", authToken, FeedbackControllers.getByDiet)
router.post("/feedback", authToken, FeedbackControllers.create)

export default router