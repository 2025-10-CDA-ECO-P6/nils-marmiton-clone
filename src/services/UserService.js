import jwt from 'jsonwebtoken';
class UserService {
    constructor(userRepository, jwtSecret, jwtExpiresIn, User, hasherService) {
        this.userRepository = userRepository;
        this.JWT_SECRET = jwtSecret;
        this.JWT_EXPIRES_IN = jwtExpiresIn;
        this.User = User;
        this.hasherService = hasherService;
    }

    async doRegister(userData) {
        const userPayload = userData;
        if (!userPayload.username || !userPayload.mail || !userPayload.password) {
            throw new Error('Email, nom d\'utilisateur, prénom  et mot de passe sont obligatoires');
        }
        const user = new this.User(userData);
        const existingMail = await this.userRepository.findBymail(user.mail);
        if(existingMail) {
            throw new Error('Identifiants invalides');
        }

        await user.hashPassword(this.hasherService);

        const data = {
            username: user.username,
            mail : user.mail,
            password : user.password
        };

        return await this.userRepository.createUser(data);

    }

    async doLogin(userPayload) {
        const {mail, password} = userPayload;
        if (!userPayload.mail || !userPayload.password) {
            throw new Error('Email et mot de passe sont obligatoires');
        }

        const userData = await this.userRepository.findBymail(mail);
        if (!userData) {
            throw new Error('Email ou mot de pass incorrect');
        }

        const user = new this.User(userData);

        const isPassWordValid = await user.comparePassword(password, this.hasherService);
        if (!isPassWordValid) {
            throw new Error('Email ou mot de pass incorrect');
        }

        const token = this.generateToken(user);
        return user.toJson(token);
    }

    async getCurrentUser(userId) {
        if(!userId) {
            throw new Error('ID utilisateur manquant');
        }

        const userData = await this.userRepository.findById(userId);
        if(!userData) {
            throw new Error('Utilisateur non trouvé');
        }

        const user = new this.User(userData)

        return user.toJson();
    }

    generateToken(user) {
        return jwt.sign(
            {
                id: user.id,
                mail: user.mail,
                username: user.username
            },
            this.JWT_SECRET,
            { expiresIn: this.JWT_EXPIRES_IN }
        );
    }


}

export default UserService;