import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { PaginationDto } from '../paginate/pagination.dto';

export class GetMessageDto extends PaginationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  senderId: number;
}
