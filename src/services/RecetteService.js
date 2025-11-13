class RecetteService {
    constructor(recetteRepository) {
        this.recetteRepository = recetteRepository;
    }

    async getAllRecettes() {
        return await this.recetteRepository.findAll()
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
        return await this.recetteRepository.saveOne(recetteData);
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