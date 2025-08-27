import { Resend } from 'resend';
import loggerService from './LoggerServices.js';
import { verifyCode } from '../../templates/verifyCode.js';
import dotenv from 'dotenv';

dotenv.config();
const logger = loggerService.getLogger()

class EmailServices {
    #key = process.env.RESEND_API_KEY
    #from = process.env.RESEND_EMAIL_FROM

    constructor() {
        this.resend = new Resend(this.#key);
    }

    async _sendEmail({
        email,
        subject,
        content,
    }) {
        try {
            const { data, error } = await this.resend.emails.send({
                from: this.#from,
                to: [email],
                subject,
                html: content,
            });

            if (error) {
                logger.error(error);
                throw new Error('Failed to send email');
            }

            return data;
        } catch (error) {
            logger.error(error);
            throw new Error('Failed to send email');
        }
    }

    async sendVerifyCode({
        email,
        code
    }) {
        try {
            const content = verifyCode(code);
            const subject = 'Código de verificación';

            const send = await this._sendEmail({
                email,
                subject,
                content,
            });

            return send;
        } catch (error) {
            logger.error(error);
            throw new Error('Failed to send email');
        }
    }
}

export default new EmailServices();