import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { HasMimeType, IsFile, MaxFileSize } from 'nestjs-form-data';

export class CheckFileDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  @IsNotEmpty()
  @IsFile()
  @MaxFileSize(524288000) // 5M
  @HasMimeType([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'application/msword',
    'video/mp4',
    'video/mpeg',
    'video/ogg',
    'video/webm',
  ])
  checkFile: Express.Multer.File;
}
