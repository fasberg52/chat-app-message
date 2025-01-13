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
import { Column, DeleteDateColumn, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'files', schema: 'message' })
export class FileEntity extends BaseEntity {
  @ApiProperty()
  @IsString()
  @MaxLength(200)
  @IsOptional()
  @Column({ type: 'varchar', length: 200, nullable: true })
  key: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  @IsOptional()
  @Column({ type: 'varchar', length: 100, nullable: true })
  mimeType: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Column({ type: 'int', nullable: true })
  size: number;

  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 200, nullable: true })
  link: string;

  @ApiProperty()
  @IsEnum(FileTypeEnum)
  @IsNotEmpty()
  @Column({ type: 'enum', enum: FileTypeEnum, nullable: true })
  type: FileTypeEnum;

  @ApiProperty()
  @DeleteDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  deletedAt: Date;
}
