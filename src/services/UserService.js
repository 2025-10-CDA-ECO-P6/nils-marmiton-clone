class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async register(userData) {
        const userPayload = userData;
        if (!userPayload.nom || !userPayload.prenom || !userPayload.email || !userPayload.password) {
            throw new Error('Email, nom d\'utilisateur, prénom  et mot de passe sont obligatoires');
        }
        const user = await this.userRepository.createUser(userPayload);
        return user.toJson();
    }

    async doLogin() {

    }
}

export default UserService;