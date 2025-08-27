import loggerService from "../services/LoggerServices.js"
import userBll from "../blls/UserBll.js"
import { handleErrors } from "../services/HandleErrors.js"

const logger = loggerService.getLogger()

export default class UserControllers {
    static async update(req, res) {
        try {
            const userId = req.userId
            const updateType = req.params.updateType

            const updatedUser = await userBll.updateUser(userId, data, updateType)

            return res.status(204).json({ data: updatedUser })
        } catch (error) {
            handleErrors(error, res, logger)
        }
    }
}
