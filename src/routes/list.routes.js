import { Router } from "express"
import ListControllers from "../app/controllers/ListControllers.js"
import { authToken } from "..//app/middlewares/AuthToken.js"

const router = Router()

router.get("/list", authToken, ListControllers.getAll)
router.get("/list/:id", authToken, ListControllers.getById)
router.post("/list", authToken, ListControllers.create)
router.put("/list/:id", authToken, ListControllers.update)
router.put("/list/:id/:status", authToken, ListControllers.updateStatus)
router.put("/list/:id/:favorite", authToken, ListControllers.updateFavorite)

export default router