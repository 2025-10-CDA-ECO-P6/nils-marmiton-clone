class RecetteRepository {
    constructor(dbConnection) {
        this.db = dbConnection;
    }
    static DEFAULT_LIMIT = 5;
    static DEFAULT_PAGE = 1;

    async FindAllPaginated(page = RecetteRepository.DEFAULT_PAGE, limit = RecetteRepository.DEFAULT_LIMIT) {
        const offset = (page -1) * limit;
        const countSql = `SELECT COUNT(*) AS totalItems FROM recettes`;
        const totalResult = await this.db.get(countSql);
        const totalItems = totalResult.totalItems;
        const dataSql = `SELECT * FROM recettes LIMIT ? OFFSET ?`;
        const recettes = await this.db.all(dataSql, [limit, offset])
        const totalPages = Math.ceil(totalItems / limit);

        return {
            data : recettes,
            meta : {
                totalItems : totalItems,
                itemsPerPage : limit,
                totalPages : totalPages,
                currentPage : page
            },
        };
    }

    async findById(id) {
        const sql = `SELECT * FROM recettes WHERE ID=?`
        return await  this.db.get(sql, [id]);
    }

    async saveOne(data) {
        const { documentId, titre, temps, difficulte, budget, description } = data;
        const result = await this.db.run("INSERT INTO recettes (documentId, titre, temps, difficulte, budget, description ) VALUES (?, ?, ?, ?, ?, ?)" ,
            [documentId, titre, temps, difficulte, budget, description]
        );

        if (result && result.lastID) {
            data.id = result.lastID;
        } else {
            throw new Error("Échec de l'insertion");
        }
        return data;
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