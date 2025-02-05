import bcrypt from "bcrypt";

class EncryptionService {
    private saltRounds = 10;

    async encryptPassword(plainPassword: string): Promise<string> {
        return await bcrypt.hash(plainPassword, this.saltRounds);
    }

    async verifyPassword(
        plainPassword: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

export default EncryptionService;
