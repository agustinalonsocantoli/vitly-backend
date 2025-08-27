import { handleErrors } from "../services/HandleErrors.js";
import ListBll from "../blls/ListBll.js";
import loggerService from "../services/LoggerServices.js"

const logger = loggerService.getLogger()

export default class ListControllers {
    static async getAll(req, res) {
        try {
            const user = req.user;
            const params = req.query;
            const response = await ListBll.getAll(params, user)

            return res.status(200).json(response);
        } catch (error) {
            handleErrors(error, res, logger)
        }
    }

    static async getById(req, res) {
        try {
            const user = req.user;
            const { id } = req.params;
            const response = await ListBll.getById(id, user)

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

    static async update(req, res) {
        try {
            const user = req.user;
            const { id } = req.params;
            const data = req.body;

            const response = await ListBll.update(id, data, user)

            return res.status(200).json(response);
        } catch (error) {
            handleErrors(error, res, logger)
        }
    }

    static async updateStatus(req, res) {
        try {
            const user = req.user;
            const { id, status } = req.params;

            const response = await ListBll.updateStatus(id, status, user)

            return res.status(200).json(response);
        } catch (error) {
            handleErrors(error, res, logger)
        }
    }

    static async updateFavorite(req, res) {
        try {
            const user = req.user;
            const { id, favorite } = req.params;
            const isFavorite = favorite === 'true';

            const response = await ListBll.updateFavorite(id, isFavorite, user)

            return res.status(200).json(response);
        } catch (error) {
            handleErrors(error, res, logger)
        }
    }
}
