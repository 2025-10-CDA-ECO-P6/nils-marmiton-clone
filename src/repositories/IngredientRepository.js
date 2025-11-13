import Ingredient from "../models/Ingredient.js";

class IngredientRepository {
    constructor(dbConnection) {
        this.db = dbConnection;
    }

    async getOrSave(nom) {
        const existing = await this.db.get(
            `SELECT id FROM ingredients WHERE nom = ?`, [nom]
        );

        if (existing) {
            return existing.id
        }else {
            const result = await this.db.run(
                `INSERT INTO ingredients (nom) VALUES (?)`, [nom]
            );
            return result.lastID;
        }
    }

}

export default IngredientRepository;