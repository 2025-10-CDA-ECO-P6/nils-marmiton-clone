import {Router} from "express";
import authToken from "../middleware/auth.js";

class UserController {
    constructor(userService) {
        this.userService = userService;
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get('/me',  this.whoAmI.bind(this));
    }

    getRouter() {
        return this.router;
    }

    async whoAmI(req, res) {
        try {
            const user = await this.userService.getCurrentUser(req.user.id);
            return res.status(200).json(user);
        } catch (error) {
            console.error(req.user.id);
            console.error('Erreur', error);
            res.status(500).json({error : "Erreur serveur"})
        }
    }
}

export default UserController;