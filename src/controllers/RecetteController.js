import {Router} from "express";
import authToken from "../middleware/auth.js";

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
        this.router.get('/:documentId', this.getRecette.bind(this))

        // DELETE api/recette/:id
        this.router.delete('/:documentId', this.deleteRecette.bind(this))

        // POST /api/recettes
        this.router.post('/', authToken, this.createRecette.bind(this));

        // UPDATE /api/recettes/:id
        this.router.patch('/:documentId', this.updateRecette.bind(this));

    }


    async getRecette(req, res) {
        try {
            const recette = await this.recetteService.getRecetteByDocumentId(req.params.documentId);
            res.status(200).json(recette);
        } catch (error) {
            console.error('Erreur', error);
            res.status(500).json({error : "Erreur Serveur"})
        }
    }

    async getRecettes(req, res) {
        const page = req.params.page;
        const limit = req.params.limit;
        try {
            const recettes = await this.recetteService.getAllRecettes(page, limit);
            res.status(200).json(recettes);
        } catch (error) {
            console.error('Erreur', error);
            res.status(500).json({error : "Erreur serveur"})
        }
    }

    async deleteRecette(req, res) {
        try {
            const recetteToDelete = req.params.documentId;
            const isDeleted = await this.recetteService.deleteRecette(recetteToDelete);
            if(!isDeleted) {
                return res.status(404).json({ message: 'Recette non trouvée ou déjà supprimée.' });
            }

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
            const recette = await this.recetteService.updateRecette(req.params.documentId , req.body);
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