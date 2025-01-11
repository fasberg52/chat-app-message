import { IsNotEmpty, IsString } from 'class-validator';
import { SendMessageDto } from './send-message.dto';

export class CreateMessageDto extends SendMessageDto {
  @IsString()
  @IsNotEmpty()
  senderId: number;
}
