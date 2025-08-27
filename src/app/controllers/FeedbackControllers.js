import { handleErrors } from "../services/HandleErrors.js";
import FeedbackBll from "../blls/FeedbackBll.js";
import loggerService from "../services/LoggerServices.js"

const logger = loggerService.getLogger()

export default class FeedbackControllers {
    static async getById(req, res) {
        try {
            const user = req.user;
            const { id } = req.params;
            const response = await FeedbackBll.getById(id, user)

            return res.status(200).json(response);
        } catch (error) {
            handleErrors(error, res, logger)
        }
    }

    static async getByDiet(req, res) {
        try {
            const user = req.user;
            const { diet } = req.params;
            const response = await FeedbackBll.getFeedbackDiet(diet, user)

            return res.status(200).json(response);
        } catch (error) {
            handleErrors(error, res, logger)
        }
    }

    static async create(req, res) {
        try {
            const user = req.user;
            const data = req.body;

            const response = await ListBll.create(data, user)

            return res.status(201).json(response);
        } catch (error) {
            handleErrors(error, res, logger)
        }
    }
}
