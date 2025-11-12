import {Router} from "express";

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
        this.router.post('/login', this.login.bind(this));
        // GET api/auth/me
        this.router.get('/me', this.whoAmI.bind(this));
    }

    async register(req, res) {
        try {
            const user = await this.userService.register(req.body);
            res.status(201).json(user.data);
        } catch (error) {
            console.error(req.body);
            console.error('Erreur', error);
            res.status(500).json({error : "Erreur serveur"})
        }
    }

    login(req, res) {

    }

    whoAmI(req, res) {

    }


    getRouter() {
        return this.router
    }
}

export default AuthController;