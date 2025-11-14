import bcrypt from 'bcrypt';
const SALT_ROUND = 10;
class PassWordHasher {


    async hash(password) {
        return await bcrypt.hash(password, SALT_ROUND);
    }

    async compare(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }
}

export default PassWordHasher;