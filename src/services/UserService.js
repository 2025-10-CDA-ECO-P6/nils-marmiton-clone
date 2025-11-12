class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async register(userData) {
        const userPayload = userData.data || userData;
        if (!userPayload.mail || !userPayload.nom || !userPayload.password || !userPayload.prenom) {
            throw new Error('Email, nom d\'utilisateur, prénom  et mot de passe sont obligatoires');
        }

        const user = await this.userRepository.createUser(userPayload);



        return user.toJson();
    }

    async doLogin() {

    }
}