import { Router } from "express"
import AuthControllers from "../app/controllers/AuthControllers.js"

const router = Router()

router.post("/auth/login", AuthControllers.login)
router.post("/auth/register", AuthControllers.register)
router.post("/auth/verify", AuthControllers.validateVerify)
router.post("/auth/resend-verify", AuthControllers.resendVerify)

export default router