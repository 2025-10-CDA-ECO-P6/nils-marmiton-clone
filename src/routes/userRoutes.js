import UserController from "../controllers/UserController.js";


const userRoutes = (userService) => {
    const controller = new UserController(userService);
    return controller.getRouter();
}

export default userRoutes;

