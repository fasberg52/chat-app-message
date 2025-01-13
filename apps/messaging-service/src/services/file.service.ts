import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { FileEntity } from '@app/database/entities/file.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileTypeEnum } from '@app/database/enums/file.enum';
import { S3Service } from './s3.service';

@Injectable()
export class FileUploadService {
  private readonly s3: AWS.S3;
  private readonly bucketName: string;

  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly configService: ConfigService,
    private readonly s3Service: S3Service,
  ) {}

  async uploadFile(file: Express.Multer.File): Promise<FileEntity> {
    const key = uuidv4();
    const s3Response = await this.s3Service.uploadFile(file, {
      Key: key,
      ContentType: file.mimetype,
    });
    const data = {
      key,
      size: Number(file.size) || 0,
      link: s3Response.url,
      type: this.getFileType(file.mimetype),
      mimeType: file.mimetype,
    };

    const fileEntity = this.fileRepository.create({
      ...data,
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
