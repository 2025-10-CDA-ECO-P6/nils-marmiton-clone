import {Router} from "express";

class RecetteController {
    constructor(recetteService) {
        this.recetteService = recetteService;
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {

        // GET /api/recettes
        this.router.get('/', this.getRecettes.bind(this));

        //  GET api/recettes/:id
        this.router.get('/:id', this.getRecette.bind(this))

        // DELETE api/recette/:id
        this.router.delete('/:id', this.deleteRecette.bind(this))

        // POST /api/recettes
        this.router.post('/', this.createRecette.bind(this));

        // UPDATE /api/recettes/:id
        this.router.patch('/:id', this.updateRecette.bind(this));

    }


    async getRecette(req, res) {
        try {
            const recette = await this.recetteService.getRecetteById(req.params.id);
            res.json(recette);
        } catch (error) {
            console.error('Erreur', error);
            res.status(500).json({error : "Erreur Serveur"})
        }
    }

    async getRecettes(req, res) {
        try {
            const recettes = await this.recetteService.getAllRecettes();
            res.json(recettes);
        } catch (error) {
            console.error('Erreur', error);
            res.status(500).json({error : "Erreur serveur"})
        }
    }

    async deleteRecette(req, res) {
        try {
            const recetteToDelete = req.params.id;
            const isDeleted = await this.recetteService.deleteRecette(recetteToDelete);
            if(!isDeleted) {
                return res.status(404).json({ message: 'Recette non trouvée ou déjà supprimée.' });            }
            return res.status(204).end();
        } catch (error) {
            console.error('Erreur', error);
            res.status(500).json({error: 'Erreur serveur'})
        }
    }

    async createRecette(req, res) {
        try {
            const recette = await this.recetteService.createNewRecette(req.body);
            res.status(201).json(recette.data);
        } catch (error) {
            console.error(req.body);
            console.error('Erreur', error);
            res.status(500).json({error : "Erreur serveur"})
        }
    }

    async updateRecette(req, res) {
        try {
            const recette = await this.recetteService.updateRecette(req.params.id , req.body);
            res.status(200).json(recette);
        } catch (error) {
            console.error(req.body);
            console.error('Erreur', error);
            res.status(500).json({error : "Erreur serveur"})        }
    }

    getRouter() {
        return this.router;
    }
}

export default RecetteController;