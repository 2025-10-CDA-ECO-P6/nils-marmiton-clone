class RecetteService {
    constructor(recetteRepository) {
        this.recetteRepository = recetteRepository;
    }

    async getAllRecettes() {
        return await this.recetteRepository.findAll()
    };

    async getRecetteBydId(recetteId) {
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
        return await this.recetteRepository.createOne(recetteData);
    };

    async updateRecette(recettePayload) {
        return await  this.recetteRepository.updateOne(recettePayload);
    }
}

export default RecetteService;