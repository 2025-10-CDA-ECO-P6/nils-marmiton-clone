class User {
    constructor(data) {
        this.id = data.id;
        this.username = data.username
        this.mail = data.mail;
        this.password = data.password;
    }

    async hashPassword(hasherService) {
        const salt = 10;
        this.password = await hasherService.hash(this.password, salt);
    }

    async comparePassword(password, hasherService) {
        return hasherService.compare(password, this.password);
    }

    toJson(token) {
        return {
            "data" : {
                id : this.id,
             username: this.username,
                mail: this.mail,
                token: token || null
            }
        }


    }

}

export default User;