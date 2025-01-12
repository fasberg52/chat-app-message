import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';

export class CreateFileDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  file: Express.Multer.File;
}
