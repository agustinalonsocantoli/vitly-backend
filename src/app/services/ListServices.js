import { OpenAI } from "openai";
import loggerService from './LoggerServices.js';

class ListServices {

    constructor() {
        this.logger = loggerService.getLogger();
        // this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }

    _convertUnit(unit) {
        switch (unit) {
            case 'grams':
            case 'kilograms':
                return 'grams';
            case 'milliliters':
            case 'liters':
                return 'milliliters';
            case 'units':
                return 'units';
            default:
                return unit;
        }
    }

    _calculateQuantity(quantity, unit) {
        if (unit === 'kilograms') {
            return quantity * 1000;
        } else if (unit === 'liters') {
            return quantity * 1000;
        } else {
            return quantity;
        }
    }

    _cleanFoodName(foodName) {
        try {
            const cleanedName = foodName
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-zA-Z0-9\s]/g, '')
                .replace(/\s+/g, '-')
                .trim()
                .toLowerCase();

            return cleanedName;
        } catch (error) {
            this.logger.error(error);
            throw new Error("Error cleaning food name");
        }
    }

    _restoreFoodName(cleanedName) {
        try {
            const restoredName = cleanedName
                .replace(/-/g, ' ')
                .toLowerCase()
                .replace(/^./, char => char.toUpperCase())
                .trim();

            return restoredName;
        } catch (error) {
            this.logger.error(error);
            throw new Error("Error restoring food name");
        }
    }

    async generateListByDiet(diet) {
        try {
            const { meals } = diet;
            let groupedIngredients = [];

            for (const meal of meals) {
                for (const food of meal.foods) {
                    const ingredients = food.ingredients.reduce((acc, item) => {
                        const key = this._cleanFoodName(item.name);
                        const save = {
                            quantity: item.quantity,
                            unit: item.unit,
                        };

                        if (!acc[key]) acc[key] = [];
                        acc[key].push(save);

                        return acc;
                    }, {});

                    groupedIngredients.push(ingredients);
                }
            }

            const groupedFoods = groupedIngredients.reduce((acc, curr) => {
                for (const key in curr) {
                    if (!acc[key]) acc[key] = [];
                    acc[key] = acc[key].concat(curr[key]);
                }

                return acc;
            }, {});

            let list = [];
            Object.entries(groupedFoods).forEach(([key, values]) => {
                values.forEach(item => {
                    const existingItem = list.find(i => i.product === key);

                    if (existingItem) {
                        existingItem.quantity += this._calculateQuantity(item.quantity, item.unit);
                        existingItem.unit = this._convertUnit(item.unit);
                    } else {
                        list.push({
                            product: key,
                            quantity: this._calculateQuantity(item.quantity, item.unit),
                            unit: this._convertUnit(item.unit)
                        });
                    }
                });
            });

            list = list.map(item => ({
                ...item,
                product: this._restoreFoodName(item.product)
            }));

            return list;
        } catch (error) {
            this.logger.error(error);
            throw new Error("Error generating list from diet");
        }
    }

}

export default new ListServices();
