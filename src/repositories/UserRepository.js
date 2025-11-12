import User from "../models/User.js";

class UserRepository {
    constructor(dbConnection) {
        this.db = dbConnection;
    }

    async findAll() {
        const sql = `SELECT * FROM users`;
        return await this.db.all(sql);
    }

    async findById(userId) {
        const sql = `SELECT * FROM users WHERE id = ?`;
        const userData =  await this.db.get(sql, [userId]);
        if (!userData) {
            return null;
        }
        return new User(userData);
    }

    async findByEmail(email) {
        const sql = `SELECT * FROM users WHERE email = ?`;
        const userData =  await this.db.get(sql, [email]);
        return new User(userData);
    }

    async createUser(data) {
        const user = new User(data);
        const existingMail = await this.findByEmail(user.email);
        if (existingMail) {
            throw new Error('Cet email est déja utilisé')
        }

        await user.hashPassword();
        const {nom, prenom, email, password} = user;
        const sql = `
            INSERT INTO users (nom, prenom, email, password)
            VALUES (?, ?, ?, ?)
        `;
        const result = await this.db.run(sql, [user.nom, user.prenom, user.email, user.password]);

        user.id = result.lastID;
        return user;
    }


}
export default UserRepository;