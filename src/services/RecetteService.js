
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

    async getRecetteById(recetteId) {
        return await this.recetteRepository.findById(recetteId);
    }

    async deleteRecette(recetteId) {
        return await this.recetteRepository.deleteById(recetteId);
    }

    async createNewRecette(recettePayload) {

        const recetteData = recettePayload.data || recettePayload;
        if (!recetteData.titre || recetteData.temps === undefined || recetteData.difficulte === undefined || recetteData.budget === undefined) {
            throw new Error("Le titre, le temps, la difficulté et le budget sont obligatoires pour créer une recette.");
        }

        const recette = new this.Recette(recetteData)
        const data = {
            id: recette.id,
            documentId: recette.documentId,
            titre: recette.titre,
            temps: recette.temps,
            difficulte : recette.difficulte,
            budget: recette.budget,
            description: recette.description
        }
        return await this.recetteRepository.saveOne(data);
    };

    async updateRecette(recetteId, recettePayload) {
        const recetteData = recettePayload.data || recettePayload;
        const existingRecette = await this.getRecetteById(recetteId);
        if (!existingRecette) {
            throw new Error(`La recette avec l'ID ${recetteId} n'a pas été trouvée.`);
        }


            return await  this.recetteRepository.updateOne(recetteId, recetteData);

    }
}

export default RecetteService;