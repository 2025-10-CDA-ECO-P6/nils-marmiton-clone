class UserRepository {
    constructor(dbConnection) {
        this.db = dbConnection;
    }


    async findById(userId) {
        const sql = `SELECT * FROM users WHERE id = ?`;
        const userData =  await this.db.get(sql, [userId]);
        if (!userData) {
            return null;
        }
        return userData;
    }

    async findBymail(mail) {
        const sql = `SELECT * FROM users WHERE mail = ?`;
        const userData =  await this.db.get(sql, [mail]);
        return userData;
    }

    async createUser(data) {
        const {username, mail, password} = data;
        const sql = `
            INSERT INTO users (username,  mail, password)
            VALUES (?, ?, ?)
        `;
        const result = await this.db.run(sql, [username, mail, password]);

        return {
            lastID: result.lastID
        };
    }


}
export default UserRepository;