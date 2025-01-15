import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileResponse } from '../../responses/file/file.response';
import { firstValueFrom } from 'rxjs';
import { InternalServerErrorException } from '@nestjs/common';
import { CheckFileDto } from '@app/shared/dtos/file/check-file.dto';
@Controller('file')
@ApiTags('File')
@ApiBearerAuth()
export class FileController {
  @Client({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URL],
      queue: process.env.MESSAGING_SERVICE_HOST,
      queueOptions: {
        durable: false,
      },
    },
  })
  private messagingServiceClient: ClientProxy;

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CheckFileDto,
  })
  @ApiOkResponse(FileResponse.getApiDoc())
  @Post('upload')
  @UseInterceptors(FileInterceptor('checkFile'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileResponse> {
    try {
      const fileData = {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        buffer: file.buffer.toString('base64'),
      };
      console.log(file);
      const result = await firstValueFrom(
        this.messagingServiceClient.send('file.upload', fileData),
      );
      return new FileResponse(result);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
