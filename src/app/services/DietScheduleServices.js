import { addDays } from 'date-fns';
import loggerService from './LoggerServices.js';

class DietScheduleServices {
    constructor() {
        this.logger = loggerService.getLogger();
    }

    async generateScheduleByDiet(totalWeeks) {
        try {
            const startDate = new Date();
            const firstMonday = startDate.getDay() === 1 ? startDate : nextMonday(startDate);
            const schedule = [];

            for (let week = 1; week <= totalWeeks; week++) {
                const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

                for (const day of daysOfWeek) {
                    schedule.push({
                        day,
                        week,
                        date: addDays(firstMonday, ((week - 1) * 7) + daysOfWeek.indexOf(day))
                    });
                }
            }

            return schedule;
        } catch (error) {
            this.logger.error(error);
            throw new Error("Error generating schedule from diet");
        }
    }

}

export default new DietScheduleServices();