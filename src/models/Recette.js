import { v4 as uuid } from 'uuid';
class Recette {
    constructor(data) {
        this.id = data.id;
        this.documentId = data.documentId || uuid()
        this.title = data.title;
        this.time = data.time;
        this.difficulty = data.difficulty;
        this.price = data.price;
        this.steps = data.steps;
        this.ingredients = data.ingredients || [];
    }

    toJson() {
        return {
            documentId: this.documentId,
            title: this.title,
            time: this.time,
            difficulty : this.difficulty,
            price: this.price,
            steps : this.steps,
            ingredients : this.ingredients
        }
    }

}

export default Recette;