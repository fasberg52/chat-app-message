import { BaseResponse } from '@app/common/responses/base.response';
import { FileEntity } from '@app/database/entities/file.entity';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@ApiExtraModels()
export class FileResponse extends BaseResponse {
  @ApiProperty({ type: FileEntity })
  result: FileEntity;

  constructor(result: FileEntity) {
    super();
    this.result = result;
  }
}
