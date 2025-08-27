import { Router } from "express"
import DietControllers from "../app/controllers/DietControllers.js"
import { authToken } from "../app/middlewares/AuthToken.js"

const router = Router()

router.get("/diet", authToken, DietControllers.getAll)
router.get("/diet/:id", authToken, DietControllers.getById)
router.get("/diet/last", authToken, DietControllers.getLast)
router.post("/diet/generate", authToken, DietControllers.generate)
router.put("/diet/:id/:status", authToken, DietControllers.updateStatus)
router.post("/diet/:id/start", authToken, DietControllers.startDiet)
router.post("/diet/:id/toList", authToken, DietControllers.dietToList)

export default router