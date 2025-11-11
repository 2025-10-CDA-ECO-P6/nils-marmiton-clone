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
        const sql = `SELECT * FROM recettes WHERE ID=${id}`
        return await  this.db.get(sql);
    }

    async createOne(data) {
        const recette = new Recette(data);
        recette.validate();
        const { titre, temps, difficulte, budget, description } = recette;
        const result = await this.db.run("INSERT INTO recettes (titre, temps, difficulte, budget, description ) VALUES (?, ?, ?, ?, ?)" ,
            [titre, temps, difficulte, budget, description]
        );

        const insertedId = result.lastID;
        return insertedId;
    }

    async deleteById(id) {
        const sql = `DELETE FROM recettes WHERE id=${id}`;
        return await this.db.run(sql)
    }

    async updateOne(data) {
        const recetteId = data.id;
        const recetteToUpdate = await this.findById(recetteId);
        if (!recetteToUpdate) {
            throw new Error('Recette à mettre a jours non trouvé');
        }
        const { titre, temps, difficulte, budget, description } = data;
        const result = await this.db.run(
            "UPDATE recettes SET titre = ?, temps = ?, difficulte = ?, budget = ?, description = ? WHERE id = ?",
            [titre, temps, difficulte, budget, description, recetteId]
        );

        return result;

    }
}

export default RecetteRepository;