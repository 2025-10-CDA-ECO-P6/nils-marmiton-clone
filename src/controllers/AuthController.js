import {Router} from "express";
import authToken from "../middleware/auth.js";

class AuthController {
    constructor(userService) {
        this.userService = userService;
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        // POST api/auth/register
        this.router.post('/register', this.register.bind(this));

        // POST api/auth/login
        this.router.post('/', this.login.bind(this));
        // GET api/auth/me
        this.router.get('/me', authToken, this.whoAmI.bind(this));
    }

    async register(req, res) {
        try {
            const user = await this.userService.doRegister(req.body);
            res.status(201).json(user.data);
        } catch (error) {
            console.error(req.body);
            console.error('Erreur', error);
            res.status(500).json({error : "Erreur serveur"})
        }
    }

    async login(req, res) {
        try {
            const user = await this.userService.doLogin(req.body);
            res.status(200).json(user);
        } catch (error) {
            console.error(req.body);
            console.error('Erreur lors de la connexion', error);
            if(error.message.includes('incorrect') || error.message.includes('obligatoire')) {
                res.status(401).json({erreur: error.message});
            } else {
                res.status(500).json({erreur : 'Erreur serveur lors de la conenxtion'});
            }
        }

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


    getRouter() {
        return this.router
    }
}

export default AuthController;