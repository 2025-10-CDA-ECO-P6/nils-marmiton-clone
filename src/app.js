import express from 'express';
import {openDb} from './config/db.js'
import RecetteRepository from "./repositories/RecetteRepository.js";
import RecetteService from "./services/RecetteService.js";
import recetteRoutes from "./routes/recetteRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import UserRepository from "./repositories/UserRepository.js";
import UserService from "./services/UserService.js";
import 'dotenv/config';

const app = express();
app.use(express.json());
const port = 3000;

let dbConnection;

async function startServer() {
    try {
        dbConnection = await openDb();
        const recetteRepository = new RecetteRepository(dbConnection);
        const recetteService = new RecetteService(recetteRepository);
        const userRepository = new UserRepository(dbConnection);
        const userService = new UserService(userRepository);

        app.use('/api/recettes', recetteRoutes(recetteService));
        app.use('/api/auth', authRoutes(userService));

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