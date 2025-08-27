import mongoose from 'mongoose';
import FeedbackQuestion from '../app/models/feedbackQuestion.model.js';
import loggerService from '../app/services/LoggerServices.js';
import dotenv from 'dotenv';
dotenv.config();

const seedDatabase = async (data) => {
    const MONGODB_URL = process.env.MONGODB_URL;
    const logger = loggerService.getLogger();

    try {
        await mongoose.connect(MONGODB_URL);
        logger.info('Connected to database');
        await FeedbackQuestion.insertMany(data);

        logger.info('Feedback questions seeded successfully');
    } catch (error) {
        logger.error('Error seeding the database:', error);
    } finally {
        await mongoose.connection.close();
    }
};

export const feedbackQuestions = [
    {
        question: "¿Cómo te ha resultado seguir esta dieta?",
        placeholder: "Comparte tu experiencia general, qué tal te has sentido, si has tenido alguna dificultad...",
        type: "freeText",
        order: 0,
        options: [],
    },
    {
        question: "¿Qué te gustaría cambiar o mejorar para la próxima dieta?",
        placeholder: "Sugerencias sobre tipos de comida, preparación, cantidades, horarios...",
        type: "freeText",
        order: 6,
        options: [],
    },
    {
        question: "¿Cómo valorarías esta dieta en general?",
        placeholder: null,
        type: "multipleChoice",
        order: 2,
        options: [
            "No me ha gustado",
            "Ha estado correcta",
            "Me ha gustado mucho"
        ],
    },
    {
        question: "¿Cómo te has sentido de saciedad durante el día?",
        placeholder: null,
        type: "multipleChoice",
        order: 3,
        options: [
            "Con hambre frecuente",
            "Satisfecho/a",
            "Demasiado lleno/a"
        ],
    },
    {
        question: "¿Cómo han sido tus niveles de energía?",
        placeholder: null,
        type: "multipleChoice",
        order: 4,
        options: [
            "Baja energía/cansancio",
            "Normal",
            "Energía y vitalidad"
        ],
    },
    {
        question: "¿Cómo valorarías la variedad de comidas?",
        placeholder: null,
        type: "multipleChoice",
        order: 5,
        options: [
            "Poca variedad",
            "Variedad adecuada",
            "Demasiada variedad"
        ],
    }
]

seedDatabase(feedbackQuestions);
