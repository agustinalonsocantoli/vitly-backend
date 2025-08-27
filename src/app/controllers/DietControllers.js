import User from "../models/User.model.js";
import loggerService from "../services/LoggerServices.js"
import ListServices from "../services/ListServices.js";
import Diet from "../models/Diet.model.js";
import DietServices from "../services/DietServices.js";
import List from "../models/List.model.js";
import { handleErrors } from "../services/HandleErrors.js";
import DietBll from "../blls/DietBll.js";

const logger = loggerService.getLogger()

export default class DietControllers {
    static async getAll(req, res) {
        try {
            const user = req.user;
            const params = req.query;
            const response = await DietBll.getAll(params, user)

            return res.status(200).json(response);
        } catch (error) {
            handleErrors(error, res, logger);
        }
    }

    static async getById(req, res) {
        try {
            const user = req.user;
            const { id } = req.params;
            const response = await DietBll.getById(id, user)

            return res.status(200).json(response);
        } catch (error) {
            handleErrors(error, res, logger);
        }
    }

    static async getLast(req, res) {
        try {
            const user = req.user;
            const response = await DietBll.getLast(user)

            return res.status(200).json(response);
        } catch (error) {
            handleErrors(error, res, logger);
        }
    }

    static async generate(req, res) {
        try {
            const user = req.user;
            const data = req.body;
            const response = await DietBll.generate(data, user)

            return res.status(200).json(response);
        } catch (error) {
            handleErrors(error, res, logger);
        }
    }

    static async startDiet(req, res) {
        try {
            const user = req.user;
            const { id } = req.params;
            const response = await DietBll.startDiet(id, user)

            return res.status(200).json(response);
        } catch (error) {
            handleErrors(error, res, logger);
        }
    }

    static async dietToList(req, res) {
        try {
            const user = req.user;
            const { id } = req.params;

            const response = await DietBll.dietToList(id, user)

            return res.status(200).json(response);
        } catch (error) {
            handleErrors(error, res, logger);
        }
    }

    static async updateStatus(req, res) {
        try {
            const user = req.user;
            const { id, status } = req.params;

            const response = await DietBll.updateStatus(id, status, user)

            return res.status(200).json(response);
        } catch (error) {
            handleErrors(error, res, logger);
        }
    }
}
