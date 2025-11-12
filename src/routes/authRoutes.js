import AuthController from "../controllers/AuthController.js";

const authRoutes = (userService) => {
    const controller = new AuthController(userService);
    return controller.getRouter();
}

export default authRoutes;