import DbFeederController from "../controllers/DbFeederController.js";

const scrapeRoutes = (recipesScrapperService) => {
    const controller = new DbFeederController(recipesScrapperService);
     return controller.getRouter();
}

export default scrapeRoutes;