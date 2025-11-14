import express from 'express';
import recetteRoutes from "./routes/recetteRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import 'dotenv/config';
import authToken from "./middleware/auth.js";
import scrapeRoutes from "./routes/scrapeRoutes.js";
import ApplicationContext from "./ApplicationContext.js";
import userRoutes from "./routes/userRoutes.js";


const app = express();
app.use(express.json());
const port = 1337;


async function startServer() {
    try {

        const context = new ApplicationContext();
        await context.initialize();

        const recetteService = context.getBean('recetteService');
        const userService = context.getBean('userService');
        const recipesScrapperService = context.getBean('recipesScrapperService');

        app.use('/api/recipes', recetteRoutes(recetteService));
        app.use('/api/auth/local',  authRoutes(userService));
        app.use('/api/users', authToken, userRoutes(userService));
        app.use('/private', authToken, scrapeRoutes(recipesScrapperService));

        // Démarrage du serveur
        app.listen(port, () => {
            console.log(`Serveur is running ... go to http://localhost:${port}`);
        });


        // Fermer la connexion proprement
        process.on('SIGINT', async() => {
            await context.destroy()
            process.exit(0);
        })
    } catch (error) {
        console.error("Echec du démarrage du serveur en raison d'une erreur DB: ", error.message)
        process.exit(1);
    }
}

startServer();


