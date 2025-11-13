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
        return userData;
    }

    async findByEmail(email) {
        const sql = `SELECT * FROM users WHERE email = ?`;
        const userData =  await this.db.get(sql, [email]);
        return userData;
    }

    async createUser(data) {
        const {nom, prenom, email, password} = data;
        const sql = `
            INSERT INTO users (nom, prenom, email, password)
            VALUES (?, ?, ?, ?)
        `;
        const result = await this.db.run(sql, [nom, prenom, email, password]);

        return {
            lastID: result.lastID
        };
    }


}
export default UserRepository;