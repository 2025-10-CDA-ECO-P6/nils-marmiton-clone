import bcrypt from 'bcrypt';

class User {
    constructor(data) {
        this.id = data.id;
        this.nom = data.nom;
        this.prenom = data.prenom;
        this.email = data.email;
        this.password = data.password;
    }

    async hashPassword() {
        const salt = 10;
        this.password = await bcrypt.hash(this.password, salt);
    }

    async comparePassword(password) {
        return bcrypt.compare(password, this.password);
    }

    toJson(token) {
        return {
            "data" : {
                id : this.id,
                nom: this.nom,
                prenom: this.prenom,
                email: this.email,
                token: token || null
            }
        }


    }

}

export default User;