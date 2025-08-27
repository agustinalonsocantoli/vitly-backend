import AuthBll from "../blls/AuthBll.js"
import loggerService from "../services/LoggerServices.js"
import { handleErrors } from "../services/HandleErrors.js";

const logger = loggerService.getLogger()

export default class AuthControllers {
    static async login(req, res) {
        try {
            const data = req.body
            const response = await AuthBll.login(data)

            return res.status(200).json(response)
        } catch (error) {
            handleErrors(error, res, logger)
        }
    }

    static async register(req, res) {
        try {
            const data = req.body
            const response = await AuthBll.register(data)

            return res.status(201).json(response)
        } catch (error) {
            handleErrors(error, res, logger)
        }
    }

    static async validateVerify(req, res) {
        try {
            const data = req.body
            const response = await AuthBll.validateVerify(data)

            return res.status(200).json(response)
        } catch (error) {
            handleErrors(error, res, logger)
        }
    }

    static async resendVerify(req, res) {
        try {
            const data = req.body
            const response = await AuthBll.resendVerify(data)

            return res.status(200).json(response)
        } catch (error) {
            handleErrors(error, res, logger)
        }
    }
}
