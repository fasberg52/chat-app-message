import { Controller } from '@nestjs/common';
import { FileUploadService } from '../services/file.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class FileController {
  constructor(private readonly fileService: FileUploadService) {}

  @MessagePattern('file.upload')
  async uploadFile(@Payload() file: Express.Multer.File) {

    return this.fileService.uploadFile(file);
  }
}
