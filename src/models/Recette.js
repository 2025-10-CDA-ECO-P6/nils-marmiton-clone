class Recette {
    constructor(data) {
        this.id = data.id;
        this.titre = data.titre;
        this.temps = data.temps;
        this.difficulte = data.difficulte;
        this.budget = data.budget;
        this.description = data.description;
    }

    validate() {
        if (!this.titre || this.titre.trim() === " ") {
            throw new Error('Le titre est obligatoire');
        }

        if (this.temps <= 0) {
            throw new Error('Le temps doit etre superieur à 0');
        }
    }

    isFast() {
        return this.temps <= 30;
    }

    toJson() {
        return {
            id: this.id,
            titre: this.titre,
            temps: this.temps,
            difficulte : this.difficulte,
            budget: this.budget,
            description : this.description
        }
    }

}

export default Recette;