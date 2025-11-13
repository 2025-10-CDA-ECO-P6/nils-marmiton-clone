import express from 'express';
import {openDb} from './config/db.js'
import RecetteRepository from "./repositories/RecetteRepository.js";
import RecetteService from "./services/RecetteService.js";
import recetteRoutes from "./routes/recetteRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import UserRepository from "./repositories/UserRepository.js";
import UserService from "./services/UserService.js";
import 'dotenv/config';
import RecipesScrapperService from "./services/recipesScrapperService.js";
import IngredientRepository from "./repositories/IngredientRepository.js";
import authToken from "./middleware/auth.js";
import scrapeRoutes from "./routes/scrapeRoutes.js";
import Recette from "./models/Recette.js";
import User from "./models/User.js";


const app = express();
app.use(express.json());
const port = 3000;

let dbConnection;

async function startServer() {
    try {
        dbConnection = await openDb();
        const JWT_SECRET = process.env.JWT_SECRET;
        const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

        const recetteRepository = new RecetteRepository(dbConnection);
        const userRepository = new UserRepository(dbConnection);
        const ingredientRepository = new IngredientRepository(dbConnection);
        const recetteService = new RecetteService(recetteRepository, Recette);
        const userService = new UserService(userRepository, JWT_SECRET, JWT_EXPIRES_IN, User);
        const recipesScrapperService = new RecipesScrapperService(recetteRepository, ingredientRepository);

        app.use('/api/recettes', recetteRoutes(recetteService));
        app.use('/api/auth',  authRoutes(userService));
        app.use('/private', authToken, scrapeRoutes(recipesScrapperService));

        // Démarrage du serveur
        app.listen(port, () => {
            console.log(`Serveur is running ... go to http://localhost:${port}`);
        });

    } catch (error) {
        console.error("Echec du démarrage du serveur en raison d'une erreur DB: ", error.message)
        process.exit(1);
    }
}

startServer();


// Fermer la connexion proprement
process.on('SIGINT', () => {
    dbConnection.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connexion à la base de données fermée');
        process.exit(0);
    });
});