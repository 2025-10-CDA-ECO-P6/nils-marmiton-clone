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
        const sql = `SELECT * FROM users WHERE id=${userId}`;
        return await this.db.run(sql);
    }

    async findByEmail(email) {
        const sql = `SELECT * FROM users WHERE mail=${email}`;
        return await this.db.run(sql);
    }


    async createUser(data) {
        const user = new User(data);
        const {nom, prenom, mail, password} = user;

        const existingMail = await this.findByEmail(user.mail);
        if (existingMail) {
            throw new Error('Cet email est déja utilisé')
        }

        await user.hashPassword();

        const sql = `
            INSERT INTO users (nom, prenom, email, hashedPassword)
            VALUES (?,?,?,?)
        `;

        const result = await this.db.run(sql, [nom, prenom, mail, password]);

        user.id = result.lastID;
        return user;
    }


}