import jwt from 'jsonwebtoken';
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.JWT_SECRET = process.env.JWT_SECRET;
        this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
    }

    async doRegister(userData) {
        const userPayload = userData;
        if (!userPayload.nom || !userPayload.prenom || !userPayload.email || !userPayload.password) {
            throw new Error('Email, nom d\'utilisateur, prénom  et mot de passe sont obligatoires');
        }
        const user = await this.userRepository.createUser(userPayload);
        return user.toJson();
    }

    async doLogin(userPayload) {
        const {email, password} = userPayload;
        if (!userPayload.email || !userPayload.password) {
            throw new Error('Email et mot de passe sont obligatoires');
        }

        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Email ou mot de pass incorrect');
        }

        const isPassWordValid = await user.comparePassword(password);
        if (!isPassWordValid) {
            throw new Error('Email ou mot de pass incorrect');
        }

        const token = this.generateToken(user);
        return user.toJson(token);
    }

    generateToken(user) {
        return jwt.sign(
            {
                id: user.id,
                email: user.email,
                username: user.username
            },
            this.JWT_SECRET,
            { expiresIn: this.JWT_EXPIRES_IN }
        );
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, this.JWT_SECRET);
        } catch (error) {
            throw new Error('Token invalide ou expiré');
        }
    }
}

export default UserService;