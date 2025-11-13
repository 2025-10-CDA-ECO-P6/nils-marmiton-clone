import {Router} from "express";

class DbFeederController {
    constructor(recipesScrapperService) {
        this.recipesScrapperService = recipesScrapperService;
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        // get /private/scrape
        this.router.get('/scrape', this.scrapeAndSave.bind(this));
    }


    async scrapeAndSave(req, res){
        try {
            const results = await this.recipesScrapperService.scrape();

            const savedResults = results.filter(r => r !== null && !r.error);
            const successCount = savedResults.length;
            const errorCount = results.length - successCount;

            res.status(201).json({
                message : 'Terminé ! ',
                totalUrlsProcessed : successCount,
                recipesFailed : errorCount
            })
        } catch (error) {
            console.error("Erreur critique lors de l'exécution du scrapping :", error.message);
            res.status(500).json({
                error: "Échec du processus de scraping.",
                detail: error.message
            });
        }
    }

    getRouter() {
        return this.router
    }
}

export default DbFeederController;