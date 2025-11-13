class IngredientService {
    constructor(ingredientRepository) {
        this.ingredientRepository = ingredientRepository;
    }

    async save(ingredient)  {
        if (!ingredient.nom) {
            throw new Error('Nom obligatoire pour un ingrédient');
        }
        return await this.ingredientRepository.saveOne(ingredient);
    }
}