import { OpenAI } from "openai";
import loggerService from './LoggerServices.js';
import { ACTIVITY, GOALS } from '../enums/user.enums.js';

class DietServices {

    constructor() {
        this.logger = loggerService.getLogger();
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }

    cleanOpenAIResponse(response) {
        return response
            .trim()
            .replace(/^```json\s*/i, '')
            .replace(/^```\s*/i, '')
            .replace(/\s*```$/i, '')
            .trim();
    }

    async validatedTotalMeals(validatedDiet, generateData) {
        const { user, userProfile, totalWeeks, previousDiet } = generateData;
        const totalDays = totalWeeks * 7;
        const totalMeals = totalDays * 3;
        let diet = validatedDiet;

        if (!diet.meals || diet.meals.length < totalMeals) {
            const newDiet = await this.generateBaseDiet(user, userProfile, totalWeeks, previousDiet);

            if (!newDiet.meals || newDiet.meals.length < totalMeals) {
                throw new Error("Failed to generate diet, not enough meals.");
            }

            diet = newDiet;
        }

        return diet;
    }

    async generateDiet(user, totalWeeks, previousDiet = null) {
        try {
            if (totalWeeks < 1 || totalWeeks > 4) {
                throw new Error("Total weeks must be between 1 and 4");
            }

            if (previousDiet) {
                previousDiet = await this.analyzePreviusDiet(previousDiet, user);
            }

            const userProfile = await this.analyzeUserProfile(user, previousDiet);
            let baseDiet = await this.generateBaseDiet(user, userProfile, totalWeeks, previousDiet);

            baseDiet = await this.validatedTotalMeals(baseDiet, { user, userProfile, totalWeeks, previousDiet });

            const validatedDiet = await this.optimizeAndValidateDiet(baseDiet, user, userProfile);
            const reviewedDiet = await this.nutritionalReview(validatedDiet);

            console.log(JSON.stringify(validatedDiet, null, 2));

            return {
                meals: validatedDiet.meals,
                goals: reviewedDiet.goals,
                comments: reviewedDiet.comments,
                forbidden: reviewedDiet.forbidden,
                analyzeUser: userProfile,
                totalWeeks: totalWeeks,
            };
        } catch (error) {
            this.logger.error("Error generating diet:", error);
            throw new Error(error);
        }
    }

    extractFoodsFromDiet(diet) {
        const foods = new Set();
        if (diet.meals && Array.isArray(diet.meals)) {
            diet.meals.forEach(meal => {
                if (meal.foods && Array.isArray(meal.foods)) {
                    meal.foods.forEach(food => {
                        foods.add(food.food);
                    });
                }
            });
        }
        return Array.from(foods);
    }

    extractMealPatterns(diet) {
        const patterns = {};
        if (diet.meals && Array.isArray(diet.meals)) {
            diet.meals.forEach(meal => {
                if (!patterns[meal.meal]) {
                    patterns[meal.meal] = 0;
                }
                patterns[meal.meal]++;
            });
        }
        return patterns;
    }

    async analyzePreviusDiet(previousDiet, user) {
        try {
            const foodsUsed = this.extractFoodsFromDiet(previousDiet);
            const mealPatterns = this.extractMealPatterns(previousDiet);


            const messages = [
                {
                    role: "system",
                    content: `Eres un nutricionista experto analizando el historial alimentario de un cliente.
                    Tu trabajo es extraer insights clave para la próxima dieta.
                    
                    Responde en formato JSON compacto:
                    {
                        "foodsToAvoid": ["alimento1", "alimento2"],
                        "preferredFoods": ["alimento1", "alimento2"],
                        "mealComplexity": "simple|medium|complex",
                        "varietyLevel": "low|medium|high",
                        "recommendations": "string conciso"
                    }`
                },
                {
                    role: "user",
                    content: `Analiza esta dieta anterior y extrae insights para la siguiente:
                    
                    USUARIO ACTUAL:
                    - Objetivo actual: ${GOALS[user.goals] || user.goals || 'No especificado'}
                    - Comidas por día: ${user.mealsPerDay}
                    - Dieta estricta: ${user.strictDiet ? 'Sí' : 'No'}
                    
                    DIETA ANTERIOR COMPLETA:
                    - Creada: ${previousDiet.createdAt}
                    - Objetivo anterior: ${previousDiet.goals || 'No especificado'}
                    - Comentarios nutricionales previos: ${previousDiet.comments || 'No disponibles'}
                    - Restricciones/Prohibiciones previas: ${previousDiet.forbidden || 'No especificadas'}
                    
                    ANÁLISIS DE ALIMENTOS:
                    - Alimentos utilizados (${foodsUsed.length} total): ${foodsUsed.join(', ')}
                    - Patrones de comida: ${JSON.stringify(mealPatterns)}
                    
                    EVOLUCIÓN REQUERIDA:
                    - ¿Mantener continuidad o evolucionar?
                    
                    Extrae insights para crear una dieta evolutiva que mejore la anterior.`
                }
            ];

            const result = await this.openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages,
                temperature: 0.2,
                max_tokens: 500
            });

            const response = result.choices[0].message.content;
            const cleanedResponse = this.cleanOpenAIResponse(response);

            return JSON.parse(cleanedResponse);

        } catch (error) {
            this.logger.error("Error analyzing history insights:", error);
            return null;
        }
    }

    async analyzeUserProfile(user, previousDiet = null) {
        try {
            const allergens = (user.allergens && user.allergens.length > 0) ? user.allergens.join(', ') : 'Ninguno';
            const intolerances = (user.intolerances && user.intolerances.length > 0) ? user.intolerances.join(', ') : 'Ninguna';
            const dislikedFoods = (user.dislikedFoods && user.dislikedFoods.length > 0) ? user.dislikedFoods.join(', ') : 'Ninguno';
            const breakfast = `${user.diet.breakfast.carbohydrates}g carbs, ${user.diet.breakfast.proteins}g proteínas, ${user.diet.breakfast.fats}g grasas`
            const lunch = `${user.diet.lunch.carbohydrates}g carbs, ${user.diet.lunch.proteins}g proteínas, ${user.diet.lunch.fats}g grasas`
            const snack = `${user.diet.snack.carbohydrates}g carbs, ${user.diet.snack.proteins}g proteínas, ${user.diet.snack.fats}g grasas`
            const dinner = `${user.diet.dinner.carbohydrates}g carbs, ${user.diet.dinner.proteins}g proteínas, ${user.diet.dinner.fats}g grasas`

            const distribucionMacro = `
            - Desayuno: ${breakfast}
            - Almuerzo: ${lunch}
            - Merienda: ${snack}
            - Cena: ${dinner}
        `;

            const exercise = (user.exerciseType && user.exerciseType.length > 0) ? user.exerciseType.join(', ') : 'Ninguno';
            const medicalConditions = (user.medicalConditions && user.medicalConditions.length > 0) ? user.medicalConditions.join(', ') : 'Ninguna';

            const previousContext = previousDiet ?
                `INSIGHTS DE HISTORIAL PREVIO:
                - Alimentos a evitar repetir: ${previousDiet.foodsToAvoid?.join(', ') || 'Ninguno'}
                - Alimentos que funcionaron bien: ${previousDiet.preferredFoods?.join(', ') || 'Ninguno'}
                - Complejidad de comidas anterior: ${previousDiet.mealComplexity}
                - Nivel de variedad logrado: ${previousDiet.varietyLevel}
                - Evolución necesaria: ${previousDiet.evolutionNeeded || 'Continuar patrón actual'}
                - Aspectos de continuidad: ${previousDiet.continuityAspects || 'Ninguno específico'}
                - Recomendaciones de evolución: ${previousDiet.recommendations}`
                :
                'Sin historial previo';

            const messages = [
                {
                    role: 'system',
                    content: `Eres un nutricionista experto especializado en análisis de perfiles de usuarios. 
                    Tu trabajo es analizar el perfil del usuario y proporcionar recomendaciones nutricionales específicas.
                    Responde en formato JSON:
                    {
                        "recommendations": "string",
                        "calorieNeeds": number,
                        "macroDistribution": "string",
                        "specialConsiderations": "string"
                    }
                    `
                },
                {
                    role: 'user',
                    content: `Analiza el siguiente perfil de usuario y proporciona recomendaciones nutricionales:

                    DATOS PERSONALES:
                    - Nombre: ${user.firstName} ${user.lastName}
                    - Edad: ${user.age} años
                    - Peso: ${user.weigth} kg
                    - Altura: ${user.height} cm
                    - Sexo: ${user.gender}
                    - Actividad física: ${ACTIVITY[user.activity] || user.activity || 'No especificado'}
                    - Trabajo: ${user.job}

                    OBJETIVOS:
                    - Meta principal: ${GOALS[user.goals] || user.goals || 'No especificado'}
                    - Tiene objetivos definidos: ${!user.goals ? 'No' : 'Sí'}

                    RESTRICCIONES ALIMENTARIAS:
                    - Alergias: ${allergens}
                    - Intolerancias: ${intolerances}
                    - Alimentos que no le gustan: ${dislikedFoods}

                    ${previousContext}

                    DISTRIBUCIÓN MACRO ACTUAL:
                    ${user.strictDiet ? distribucionMacro : 'No se proporciona distribución macro actual.'}

                    EJERCICIO:
                    - Tipos de ejercicio: ${exercise}
                    - Comidas por día: ${user.mealsPerDay}

                    CONDICIONES MÉDICAS: ${medicalConditions}
                    `
                },
            ]

            const result = await this.openai.chat.completions.create({
                model: "gpt-4o",
                messages,
                temperature: 0.3,
            });

            const response = result.choices[0].message.content;
            const cleanedResponse = this.cleanOpenAIResponse(response);

            return JSON.parse(cleanedResponse);
        } catch (error) {
            this.logger.error("Error analyzing user profile:", error);
            throw new Error(error);
        }
    }

    async generateBaseDiet(user, userProfile, totalWeeks, previousDiet = null) {
        try {
            const breakfast = `${user.diet.breakfast.carbohydrates}g carbs, ${user.diet.breakfast.proteins}g proteínas, ${user.diet.breakfast.fats}g grasas`
            const lunch = `${user.diet.lunch.carbohydrates}g carbs, ${user.diet.lunch.proteins}g proteínas, ${user.diet.lunch.fats}g grasas`
            const snack = `${user.diet.snack.carbohydrates}g carbs, ${user.diet.snack.proteins}g proteínas, ${user.diet.snack.fats}g grasas`
            const dinner = `${user.diet.dinner.carbohydrates}g carbs, ${user.diet.dinner.proteins}g proteínas, ${user.diet.dinner.fats}g grasas`

            const distribucionMacro = `
            - Desayuno: ${breakfast}
            - Almuerzo: ${lunch}
            - Merienda: ${snack}
            - Cena: ${dinner}
            `;

            const previousContext = previousDiet ?
                `GUÍA DE EVOLUCIÓN NUTRICIONAL:
                
                CONTINUIDAD (mantener):
                - Alimentos que funcionaron: ${previousDiet.preferredFoods?.join(', ') || 'Ninguno detectado'}
                - Aspectos exitosos: ${previousDiet.continuityAspects}
                
                EVOLUCIÓN (mejorar):
                - Evitar repetir: ${previousDiet.foodsToAvoid?.join(', ') || 'Ninguno específico'}
                - Complejidad objetivo: ${previousDiet.mealComplexity} → incrementar gradualmente
                - Variedad objetivo: ${previousDiet.varietyLevel} → mejorar
                - ${previousDiet.evolutionNeeded}
                
                ESTRATEGIA: ${previousDiet.recommendations}`
                :
                'Enfócate en alimentos básicos, introduce variedad gradual y establece una base sólida';

            const messages = [
                {
                    role: "system",
                    content: `Eres un nutricionista experto especializado en crear planes de alimentación personalizados.
                    Debes crear una dieta completa y detallada basada en el perfil del usuario.

                    ${previousDiet && `
                    IMPORTANTE - EVOLUCIÓN NUTRICIONAL:
                    ${previousContext}
                    
                    REGLAS DE EVOLUCIÓN:
                    - Introduce 60-70% de alimentos NUEVOS respecto a la dieta anterior
                    - Mantén 30-40% de alimentos que funcionaron bien
                    - Evoluciona la complejidad gradualmente
                    - Respeta las restricciones previas que fueron efectivas
                    - Mejora la variedad sin perder la funcionalidad`
                        }
                    
                    IMPORTANTE: Responde ÚNICAMENTE con un JSON válido que contenga un array "meals" con el siguiente formato:
                    {
                        "meals": [
                            {
                                "day": "Day of the week (monday, tuesday, wednesday, thursday, friday, saturday, sunday)",
                                "meal": "Meal type (breakfast, morningSnack, lunch, afternoonSnack, dinner)",
                                "weekNumber": 1,
                                "isFreeMeal": false (Si es comida libre marcamos como true y no es necesario incluir "food"),
                                "food": {
                                    "name": "Nombre del alimento en español",
                                    "cookInstructions": "Instrucciones de cocción en español (opcional) o null",
                                    "ingredients": [
                                        { "name": "Nombre del ingrediente en español", "quantity": número, "unit": "unidad de medida (kilogram, gram, liter, milliliter, unit)" },
                                        { "name": "Agua", "quantity": 200, "unit": "milliliter" }
                                    ],
                                    "maxProtein": número_gramos,
                                    "maxCarbs": número_gramos,
                                    "maxVegetables": número_gramos,
                                    "maxFats": número_gramos
                                }
                            }
                        ]
                    }
                    
                    REGLAS IMPORTANTES PARA EL FORMATO:
                    1. weekNumber DEBE ser un número entero (1, 2, 3, 4), NO string
                    2. day DEBE ser exactamente uno de: monday, tuesday, wednesday, thursday, friday, saturday, sunday
                    3. meal DEBE ser exactamente uno de: breakfast, morningSnack, lunch, afternoonSnack, dinner
                    4. ingredients DEBE ser un array de objetos con las propiedades: name, quantity, unit
                        4.1 name DEBE ser un string en español
                        4.2 quantity DEBE ser un número
                        4.3 unit DEBE ser uno de los siguientes: kilogram, gram, liter, milliliter, unit
                    5. Todos los valores nutricionales (maxProtein, maxCarbs, etc.) DEBEN ser números (enteros o decimales)


                    REGLAS IMPORTANTES:
                    1. Crear ${totalWeeks} semanas de dieta (repetir el ciclo si es necesario)
                    2. Incluir ${user.mealsPerDay} comidas por día según el usuario prefiera
                    3. EVITAR completamente: ${user.dislikedFoods ? user.dislikedFoods.join(', ') : '-'}
                    4. Respetar alergias: ${(user.allergens && user.allergens.length > 0) ? user.allergens.join(', ') : 'Ninguna'}
                    5. Respetar intolerancias: ${(user.intolerances && user.intolerances.length > 0) ? user.intolerances.join(', ') : 'Ninguna'}
                    6. Seguir distribución macro del usuario si strictDiet es true
                    7. Los valores nutricionales deben ser precisos y realistas
                    8. Incluir variedad en los alimentos
                    9. No repetir alimentos en el mismo día e intentar no repetir en la semana.
                    10. Si son varias semanas de dieta no repetir el mismo ciclo de comidas.
                    11. Considerar el objetivo: ${GOALS[user.goals] || user.goals || 'No especificado'}.
                    12. TODOS los alimentos deben estar nombrados en ESPAÑOL para el usuario final.
                    13. El Usuario puede tener maximo 1 dia libre por semana, si es así, marcar isFreeMeal como true y no incluir "food" en ese caso.
                    `
                },
                {
                    role: "user",
                    content: `Genera una dieta completa de ${totalWeeks} semanas para:
                    PERFIL USUARIO:
                    ${JSON.stringify(user, null, 2)}

                    ANÁLISIS NUTRICIONAL:
                    ${JSON.stringify(userProfile, null, 2)}

                    ${previousDiet && `EVOLUCIÓN NUTRICIONAL PREVIA: 
                        ${JSON.stringify(previousDiet, null, 2)}`}

                    DISTRIBUCIÓN MACRO OBJETIVO POR COMIDA:
                    ${user.strictDiet ? distribucionMacro : 'No se proporciona distribución macro actual.'}

                    Genera ÚNICAMENTE el JSON solicitado sin texto adicional.
                    `
                },
            ];

            const result = await this.openai.chat.completions.create({
                model: "gpt-4o",
                messages,
                temperature: 0.5,
            });

            const response = result.choices[0].message.content;
            const cleanedResponse = this.cleanOpenAIResponse(response);

            const parsedDiet = JSON.parse(cleanedResponse);

            if (parsedDiet.meals) {
                parsedDiet.meals = parsedDiet.meals.map(meal => {
                    if (typeof meal.weekNumber === 'string') {
                        meal.weekNumber = parseInt(meal.weekNumber);
                    }

                    if (typeof meal.isFreeMeal !== 'boolean') {
                        meal.isFreeMeal = false;
                    }

                    if (['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].indexOf(meal.day) === -1) {
                        throw new Error(`Invalid day: ${meal.day}`);
                    }

                    if (['breakfast', 'morningSnack', 'lunch', 'afternoonSnack', 'dinner'].indexOf(meal.meal) === -1) {
                        throw new Error(`Invalid meal type: ${meal.meal}`);
                    }

                    if (meal.food) {
                        if (typeof meal.food.maxProtein === 'string') {
                            meal.food.maxProtein = Number(meal.food.maxProtein);
                        }
                        if (typeof meal.food.maxCarbs === 'string') {
                            meal.food.maxCarbs = Number(meal.food.maxCarbs);
                        }
                        if (typeof meal.food.maxVegetables === 'string') {
                            meal.food.maxVegetables = Number(meal.food.maxVegetables);
                        }
                        if (typeof meal.food.maxFats === 'string') {
                            meal.food.maxFats = Number(meal.food.maxFats);
                        }
                    }

                    return meal;
                })
            }

            return parsedDiet;
        } catch (error) {
            this.logger.error("Error generating base diet:", error);
            throw new Error(error);
        }
    }

    async optimizeAndValidateDiet(baseDiet, user, userProfile) {
        try {
            const dislikedFoods = (user.dislikedFoods && user.dislikedFoods.length > 0) ? user.dislikedFoods.join(', ') : 'Ninguno';
            const breakfast = `${user.diet.breakfast.carbohydrates}g carbs, ${user.diet.breakfast.proteins}g proteínas, ${user.diet.breakfast.fats}g grasas`
            const lunch = `${user.diet.lunch.carbohydrates}g carbs, ${user.diet.lunch.proteins}g proteínas, ${user.diet.lunch.fats}g grasas`
            const snack = `${user.diet.snack.carbohydrates}g carbs, ${user.diet.snack.proteins}g proteínas, ${user.diet.snack.fats}g grasas`
            const dinner = `${user.diet.dinner.carbohydrates}g carbs, ${user.diet.dinner.proteins}g proteínas, ${user.diet.dinner.fats}g grasas`

            const distribucionMacro = `
            - Desayuno: ${breakfast}
            - Almuerzo: ${lunch}
            - Merienda: ${snack}
            - Cena: ${dinner}
            `;

            const messages = [
                {
                    role: "system",
                    content: `Eres un nutricionista senior experto en optimización y validación de dietas. Tu trabajo es realizar una revisión completa y exhaustiva de la dieta generada, aplicando dos niveles de control de calidad:

                    NIVEL 1 - OPTIMIZACIÓN:
                    1. Validar que los valores nutricionales sean correctos y realistas
                    2. Verificar que se respeten todas las restricciones alimentarias
                    3. Evaluar que la distribución macro sea adecuada para los objetivos
                    4. Asegurar variedad suficiente en los alimentos
                    5. Confirmar que las cantidades sean prácticas y realizables
                    6. Eliminar repeticiones de alimentos en el mismo día o semana

                    NIVEL 2 - VALIDACIÓN FINAL:
                    7. Verificar coherencia nutricional general del plan completo
                    8. Confirmar adecuación total al objetivo del usuario
                    9. Evaluar practicidad de todas las comidas propuestas
                    10. Asegurar balance perfecto y variedad óptima
                    11. Verificar cumplimiento absoluto de todas las restricciones
                    12. Realizar ajustes finales de precisión nutricional

                    INSTRUCCIONES:
                    - Aplica ambos niveles de revisión en una sola pasada
                    - Corrige cualquier error encontrado sin excepción
                    - Optimiza la dieta manteniendo el formato JSON exacto
                    - Si encuentras algo perfecto, manténlo tal como está
                    - Prioriza la seguridad nutricional y el cumplimiento de restricciones
                    
                    Responde ÚNICAMENTE con el JSON final de la dieta optimizada y validada.
                    `
                },
                {
                    role: "user",
                    content: `Realiza optimización completa y validación final de esta dieta:

                    DIETA A REVISAR:
                    ${JSON.stringify(baseDiet, null, 2)}

                    PERFIL COMPLETO DEL USUARIO:
                    - Nombre: ${user.firstName} ${user.lastName}
                    - Objetivo: ${GOALS[user.goals] || user.goals || 'No especificado'}
                    - Peso: ${user.weigth}kg 
                    - Altura: ${user.height}cm
                    - Edad: ${user.age} años
                    - Sexo: ${user.gender}
                    - Actividad: ${ACTIVITY[user.activity] || user.activity || 'No especificado'}
                    - Tipo de ejercicio: ${user.exerciseType?.join(', ') || 'Ninguno'}
                    - Restricciones alimentarias: ${dislikedFoods}
                    - Alergias: ${(user.allergens && user.allergens.length > 0) ? user.allergens.join(', ') : 'Ninguna'}
                    - Intolerancias: ${(user.intolerances && user.intolerances.length > 0) ? user.intolerances.join(', ') : 'Ninguna'}
                    - Dieta estricta: ${user.strictDiet}

                    ANÁLISIS NUTRICIONAL PREVIO:
                    ${JSON.stringify(userProfile, null, 2)}

                    MACROS OBJETIVO POR COMIDA:
                    ${user.strictDiet ? distribucionMacro : 'Flexibilidad en distribución macro'}

                    Aplica optimización y validación completa. Devuelve el JSON final perfeccionado.
                    `
                },
            ];

            const result = await this.openai.chat.completions.create({
                model: "gpt-4o",
                messages,
                temperature: 0.15,
            });

            const response = result.choices[0].message.content;
            const cleanedResponse = this.cleanOpenAIResponse(response);

            return JSON.parse(cleanedResponse);
        } catch (error) {
            this.logger.error("Error validating and optimizing diet:", error);
            throw new Error(error);
        }
    }

    async nutritionalReview(diet) {
        try {
            const messages = [
                {
                    role: "system",
                    content: `Eres un nutricionista profesional que acaba de crear una dieta personalizada para un cliente.
                    Debes generar:
                    1. Una descripción del objetivo nutricional específico para este usuario
                    2. Comentarios y recomendaciones profesionales como nutricionista
                    3. Recomendaciones sobre hábitos o alimentos a evitar/limitar

                    
                    Responde en formato JSON:
                    {
                        "goals": "string",
                        "comments": "string",
                        "forbidden": "string"
                    }
                    
                    - goals: Una descripción del objetivo nutricional específico del usuario basado en su perfil (ej: "El usuario busca pérdida de grasa manteniendo masa muscular", "Objetivo de ganancia de peso saludable", etc.)
                    - comments: Comentarios profesionales, recomendaciones y consejos personalizados para seguir la dieta correctamente. NO incluyas referencias a contacto posterior ya que es una dieta autogenerada.
                    - forbidden: Recomendaciones sobre hábitos alimentarios o alimentos que sería mejor evitar o limitar durante este plan nutricional. Redáctalo de manera positiva y educativa, no prohibitiva.

                    
                    NO menciones que fue generado por IA. Habla en primera persona como nutricionista.
                    `
                },
                {
                    role: "user",
                    content: `Genera metadata profesional para esta dieta:
                    
                    DIETA CREADA:
                    ${JSON.stringify(diet, null, 2)}
                    
                    Genera un texto motivador y comentarios profesionales personalizados.`
                }
            ];

            const result = await this.openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages,
                temperature: 0.4,
            });

            const response = result.choices[0].message.content;
            const cleanedResponse = this.cleanOpenAIResponse(response);

            return JSON.parse(cleanedResponse);
        } catch (error) {
            this.logger.error("Error generating diet metadata:", error);
            throw new Error(error);
        }
    }
}

export default new DietServices();
