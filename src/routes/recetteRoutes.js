import RecetteController from '../controllers/RecetteController.js';
import recetteService from "../services/RecetteService.js";

const recetteRoutes = (recetteService) => {
    const controller = new RecetteController(recetteService);
    return controller.getRouter();
};

export default recetteRoutes;