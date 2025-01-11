import { MessageTypeEnum } from '@app/database/enums/message.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SendMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  receiverId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsEnum(MessageTypeEnum)
  type: MessageTypeEnum;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  senderId: number;
}
