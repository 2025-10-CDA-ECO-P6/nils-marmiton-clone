class IngredientRepository {
    constructor(dbConnection) {
        this.db = dbConnection;
    }

    async getOrSave(nom) {
        const existing = await this.db.get(
            `SELECT id FROM ingredients WHERE name = ?`, [nom]
        );

        if (existing) {
            return existing.id
        }else {
            const result = await this.db.run(
                `INSERT INTO ingredients (name) VALUES (?)`, [nom]
            );
            return result.lastID;
        }
    }

}

export default IngredientRepository;