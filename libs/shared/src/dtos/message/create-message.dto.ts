import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SendMessageDto } from './send-message.dto';
import { MessageTypeEnum } from '@app/database/enums/message.enum';

export class CreateMessageDto extends SendMessageDto {
  @IsNumber()
  @IsNotEmpty()
  senderId: number;

  @IsNumber()
  @IsNotEmpty()
  receiverId: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(MessageTypeEnum)
  type: MessageTypeEnum;
}
