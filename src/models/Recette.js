class Recette {
    constructor(data) {
        this.id = data.id;
        this.titre = data.titre;
        this.temps = data.temps;
        this.difficulte = data.difficulte;
        this.budget = data.budget;
        this.description = data.description;
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