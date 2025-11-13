import Recette from "../models/Recette.js";

class RecetteRepository {
    constructor(dbConnection) {
        this.db = dbConnection;
    }

    async findAll() {
        const sql = 'SELECT * FROM recettes'
        return await this.db.all(sql);
    }

    async findById(id) {
        const sql = `SELECT * FROM recettes WHERE ID=?`
        return await  this.db.get(sql, [id]);
    }

    async saveOne(data) {
        const recette = new Recette(data);
        const { titre, temps, difficulte, budget, description } = recette;
        const result = await this.db.run("INSERT INTO recettes (titre, temps, difficulte, budget, description ) VALUES (?, ?, ?, ?, ?)" ,
            [titre, temps, difficulte, budget, description]
        );
        return result.lastID;
    }

    async linkIngredient(recetteId, ingredientId, quantity) {
        await this.db.run(`
            INSERT INTO Recettes_Ingredients (RecetteID, IngredientID, Quantite) VALUES (?, ?, ?)
        `, [recetteId, ingredientId, quantity])
    };

    async deleteById(id) {
        const sql = `DELETE FROM recettes WHERE id=?`;
        return await this.db.run(sql, [id])
    }

    async updateOne(id, data) {
        const recetteToUpdate = await this.findById(id);
        if (!recetteToUpdate) {
            throw new Error('Recette à mettre a jours non trouvé');
        }

        const fieldsToUpdate = {};
        const allowFields = ['titre', 'temps', 'difficulte', 'budget', 'description'];

        for (const field of allowFields) {
            if (data[field] !== undefined) {
                fieldsToUpdate[field] = data[field];
            }
        }

        if (Object.keys(fieldsToUpdate).length === 0) {
            throw new Error('Aucun champ valide à mettre à jour');
        }

        const setExpression = Object.keys(fieldsToUpdate)
            .map(field => `${field} = ?`)
            .join(', ');

        const values = [...Object.values(fieldsToUpdate), id];


        const result = await this.db.run(
            `UPDATE recettes SET ${setExpression} WHERE id = ?`,
            values
        );

        if (result.changes === 0) {
            throw new Error(`Aucune recette mise à jour avec l'ID ${id}`);
        }

        return await this.findById(id);
    }
}

export default RecetteRepository;