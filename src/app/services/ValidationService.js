import { z } from 'zod';
import loggerService from './LoggerServices.js';

class ValidationService {
    constructor() {
        this.logger = loggerService.getLogger();
    }

    async validate(schema, data) {
        try {
            this.logger.debug('Validating data:', {
                schemaName: schema.description || 'unnamed schema',
                dataKeys: Object.keys(data)
            });

            const validatedData = schema.parse(data);

            this.logger.debug('Data validation successful');
            return { data: validatedData };
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formattedErrors = error.errors.map(err => ({
                    path: err.path.join('.'),
                    message: err.message
                }));

                this.logger.warn('Validation failed:', {
                    errors: formattedErrors,
                    receivedData: data
                });

                return {
                    error: {
                        message: "Validation error",
                        error: formattedErrors
                    }
                };
            }

            this.logger.error('Unexpected validation error:', error);
            return {
                error: {
                    message: "Internal validation error"
                }
            };
        }
    }
}

export default new ValidationService();
