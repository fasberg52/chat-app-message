import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { FileEntity } from '@app/database/entities/file.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileTypeEnum } from '@app/database/enums/file.enum';

@Injectable()
export class FileUploadService {
  private readonly s3: AWS.S3;
  private readonly bucketName: string;

  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly configService: ConfigService,
  ) {
    this.s3 = new AWS.S3({
      endpoint: this.configService.get<string>('LIARA_STORAGE_ENDPOINT'),
      accessKeyId: this.configService.get<string>('LIARA_ACCESS_KEY'),
      secretAccessKey: this.configService.get<string>('LIARA_SECRET_KEY'),
      s3ForcePathStyle: true,
    });

    this.bucketName = this.configService.get<string>('LIARA_BUCKET_NAME');
  }

  async uploadFile(file: Express.Multer.File): Promise<FileEntity> {
    const fileName = `${uuidv4()}`;
    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await this.s3.putObject(params).promise();
    const fileUrl = `https://${this.bucketName}.storage.liara.ir/${fileName}`;
    console.log(file.size);

    const fileEntity = this.fileRepository.create({
      key: fileName,
      mimeType: file.mimetype,
      size: file.size,
      link: fileUrl,
      type: this.getFileType(file.mimetype),
    });

    await this.fileRepository.save(fileEntity);

    return fileEntity;
  }

  private getFileType(mimeType: string): FileTypeEnum {
    if (mimeType.startsWith('image/')) {
      return FileTypeEnum.IMAGE;
    } else if (mimeType.startsWith('video/')) {
      return FileTypeEnum.VIDEO;
    } else if (mimeType === 'application/pdf') {
      return FileTypeEnum.PDF;
    }
  }
}
