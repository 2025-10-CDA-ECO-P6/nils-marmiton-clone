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
        const dataSql = `
            SELECT
                r.*,
                GROUP_CONCAT(
                        json_object(
                                'id', i.id,
                                'name', i.name,
                                'quantity', ri.Quantite
                        )
                ) AS ingredients
            FROM recettes r
                     LEFT JOIN Recettes_Ingredients ri ON r.id = ri.RecetteID
                     LEFT JOIN ingredients i ON ri.IngredientID = i.id
            GROUP BY r.id
            ORDER BY r.id DESC
                LIMIT ? OFFSET ?;
        `;

        const recettes = await this.db.all(dataSql, [limit, offset])

        console.log('Recettes brutes:', JSON.stringify(recettes[0], null, 2));
        const recettesWithIngredients = recettes.map(recette => ({
            ...recette,
            ingredients: JSON.parse(`[${recette.ingredients}]`)


        }));
        const totalPages = Math.ceil(totalItems / limit);

        return {
            data : recettesWithIngredients,
            meta : {
                totalItems : totalItems,
                itemsPerPage : limit,
                totalPages : totalPages,
                currentPage : page
            },
        };
    }

    async findByDocumentId(id) {
        const sql = `SELECT * FROM recettes WHERE documentId=?`
        return await  this.db.get(sql, [id]);
    }

    async saveOne(data) {
        const { documentId, title, time, difficulty, price, steps } = data;
        const result = await this.db.run("INSERT INTO recettes (documentId, title, time, difficulty, price, steps ) VALUES (?, ?, ?, ?, ?, ?)" ,
            [documentId, title, time, difficulty, price, steps]
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
        const sql = `DELETE FROM recettes WHERE documentId=?`;
        return await this.db.run(sql, [id])
    }

    async updateOne(id, data) {
        const recetteToUpdate = await this.findByDocumentId(id);
        if (!recetteToUpdate) {
            throw new Error('Recette à mettre a jours non trouvé');
        }
        const internalDbId = recetteToUpdate.id;
        const fieldsToUpdate = {};
        const allowFields = ['title', 'time', 'difficulty', 'price', 'steps'];

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

        const values = [...Object.values(fieldsToUpdate), internalDbId];


        const result = await this.db.run(
            `UPDATE recettes SET ${setExpression} WHERE id = ?`,
            values
        );

        if (result.changes === 0) {
            throw new Error(`Aucune recette mise à jour avec l'ID ${id}`);
        }

        return await this.findByDocumentId(id);
    }
}

export default RecetteRepository;