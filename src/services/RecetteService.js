
class RecetteService {
    constructor(recetteRepository, Recette) {
        this.recetteRepository = recetteRepository;
        this.Recette = Recette;
    }

    async getAllRecettes(page, limit) {
        const { data: recettes, meta } = await this.recetteRepository.FindAllPaginated(page, limit);
        const publicRecettes = recettes.map(recetteData => {
            const recetteInstance = new this.Recette(recetteData);
            return recetteInstance.toJson();
        });

        return {
            data : publicRecettes,
            meta: meta
        }
    };

    async getRecetteByDocumentId(recetteId) {
        return await this.recetteRepository.findByDocumentId(recetteId);
    }

    async deleteRecette(recetteId) {
        return await this.recetteRepository.deleteById(recetteId);
    }

    async createNewRecette(recettePayload) {

        const recetteData = recettePayload.data || recettePayload;
        if (!recetteData.title || recetteData.time === undefined || recetteData.difficulty === undefined || recetteData.price === undefined) {
            throw new Error("Le title, le time, la difficulté et le price sont obligatoires pour créer une recette.");
        }

        const recette = new this.Recette(recetteData)
        const data = {
            id: recette.id,
            documentId: recette.documentId,
            title: recette.title,
            time: recette.time,
            difficulty : recette.difficulty,
            price: recette.price,
            steps: recette.steps
        }
        return await this.recetteRepository.saveOne(data);
    };

    async updateRecette(recetteId, recettePayload) {
        const recetteData = recettePayload.data || recettePayload;
        const existingRecette = await this.getRecetteByDocumentId(recetteId);
        if (!existingRecette) {
            throw new Error(`La recette avec l'ID ${recetteId} n'a pas été trouvée.`);
        }


            return await  this.recetteRepository.updateOne(recetteId, recetteData);

    }
}

export default RecetteService;