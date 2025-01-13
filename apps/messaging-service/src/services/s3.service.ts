import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;
  private endpoint: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      endpoint: this.configService.get<string>('LIARA_STORAGE_ENDPOINT'),
      region: this.configService.get<string>('LIARA_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('LIARA_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('LIARA_SECRET_KEY'),
      },
    });
    this.bucketName = this.configService.get<string>('LIARA_BUCKET_NAME');
    this.endpoint = this.configService.get<string>('LIARA_STORAGE_ENDPOINT');
  }

  async getFileUrl(key: string): Promise<{ url: string }> {
    try {
      const command = new GetObjectCommand({
        Key: key,
        Bucket: this.bucketName,
      });

      const url = `${this.endpoint}/${this.bucketName}/${key}`;
      return { url };
    } catch (error) {
      throw new Error(`Failed to get file url: ${error.message}`);
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    params,
  ): Promise<{ key: string; url: string }> {
    const key = params.Key || uuidv4();

    try {
      const command = new PutObjectCommand({
        ...params,
        Key: key,
        Bucket: this.bucketName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      });

      await this.s3Client.send(command);

      const url = `${this.endpoint}/${this.bucketName}/${key}`;
      return { key, url };
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }
}
