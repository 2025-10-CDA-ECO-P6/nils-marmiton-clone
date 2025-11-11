import RecetteController from '../controllers/RecetteController.js';

const recetteRoutes = (recetteService) => {
    const controller = new RecetteController(recetteService);

    return controller.getRouter();
};

export default recetteRoutes;