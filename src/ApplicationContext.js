import {openDb} from "./config/db.js";
import RecetteRepository from "./repositories/RecetteRepository.js";
import UserRepository from "./repositories/UserRepository.js";
import IngredientRepository from "./repositories/IngredientRepository.js";
import BrowserDriver from "./services/utils/BrowserDriver.js";
import PassWordHasher from "./services/utils/PassWordHasher.js";
import RecetteService from "./services/RecetteService.js";
import UserService from "./services/UserService.js";
import User from "./models/User.js";
import RecipesScrapperService from "./services/recipesScrapperService.js";
import Recette from "./models/Recette.js";

class ApplicationContext {
    constructor() {
        if (ApplicationContext.instance) {

        }
        this.beans = {};
        this.initialized = false;
        ApplicationContext.instance = this;
    }

    async initialize () {
        if (this.initialized) {
            console.warn('Application Context deja initialisé');
            return this
        }
        //db
        this.beans.db = await this.createSingleton('db', async () => await openDb());
        //repo
        this.beans.recetteRepository = this.createSingleton('recetteRepository', ()=> new RecetteRepository(this.beans.db));
        this.beans.userRepository = this.createSingleton('userRepository', ()=> new UserRepository(this.beans.db));
        this.beans.ingredientRepository = this.createSingleton('ingredientRepository', ()=> new IngredientRepository(this.beans.db));
        //utils
        this.beans.browserDriver = this.createSingleton('browserDriver', ()=> new BrowserDriver());
        this.beans.passwordHasher = this.createSingleton('passwordHasher', ()=> new PassWordHasher());
        //services
        this.beans.recetteService = this.createSingleton('recetteService',
            () => new RecetteService(
                this.beans.recetteRepository,
                Recette,
            )
        );
        this.beans.userService = this.createSingleton('userService',
            () => new UserService(
                this.beans.userRepository,
                process.env.JWT_SECRET,
                process.env.JWT_EXPIRES_IN,
                User,
                this.beans.passwordHasher
            )
        );
        this.beans.recipesScrapperService = this.createSingleton('recipesScrapperService',
            () => new RecipesScrapperService(
                this.beans.recetteRepository,
                this.beans.ingredientRepository,
                this.beans.browserDriver
            )
        );

        this.initialized = true;
        return this;

    }
     createSingleton(name, factory) {
        if (this.beans[name]) {
            console.warn(`Bean ${name} exist deja`);
            return this.beans[name];
        }

        const instance = factory();
        return instance;
    }

     getBean(name) {
        if (!this.initialized) {
            throw new Error('Application Context non initialisé');
        }
        if (!this.beans[name]) {
            throw new Error(`Bean ${name} introuvable` );
        }
        return this.beans[name];
    }

    //fermeture context
    async destroy () {
        if(this.beans.db) {
            await new Promise((resolve) => {
                this.beans.db.close(()=> {
                    resolve();
                });
            });
        }
        this.beans = {};
        this.initialized = false;
    }
}

export default ApplicationContext;