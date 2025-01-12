import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit: number;
}
