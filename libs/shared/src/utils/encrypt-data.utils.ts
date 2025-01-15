import * as crypto from 'crypto';

export class EncryptionService {
  private readonly algorithm = 'aes-256-ctr';
  private readonly secretKey: Buffer;

  constructor() {
    const key = process.env.ENCRYPTION_KEY || 'aksdkhqwgekqwdmasndk';
    this.secretKey = crypto.createHash('sha256').update(key).digest();
  }

  encryptMessage(message: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(message), cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  decryptMessage(encryptedMessage: string): string {
    const [ivHex, contentHex] = encryptedMessage.split(':');

    if (!ivHex || !contentHex) {
      throw new Error('Invalid encrypted message format.');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const content = Buffer.from(contentHex, 'hex');

    if (iv.length !== 16) {
      throw new Error('Invalid IV length.');
    }

    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.secretKey,
      iv,
    );
    const decrypted = Buffer.concat([
      decipher.update(content),
      decipher.final(),
    ]);
    return decrypted.toString('utf8');
  }
}
