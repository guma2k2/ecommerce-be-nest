import * as bcrypt from "bcrypt";
export class BcryptService {
  async hash(data: string): Promise<string> {
    const salt = await bcrypt.getSalt();
    return await bcrypt.hash(data, salt);
  }

  async compare(data: string, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(data, encrypted);
  }
}
