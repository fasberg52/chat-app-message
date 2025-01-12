import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { FileTypeEnum } from '../enums/file.enum';
import { DeleteDateColumn, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'files', schema: 'message' })
export class FileEntity extends BaseEntity {
  @ApiProperty()
  @IsString()
  @MaxLength(200)
  @IsOptional()
  key: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  @IsOptional()
  mimeType: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  size: number;

  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  link: string;

  @ApiProperty()
  @IsEnum(FileTypeEnum)
  @IsNotEmpty()
  type: FileTypeEnum;

  @ApiProperty()
  @DeleteDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  deletedAt: Date;
}
