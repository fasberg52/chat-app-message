import { BaseResponse } from '@app/common/responses/base.response';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@ApiExtraModels()
export class TokenResponse extends BaseResponse {
  @ApiProperty()
  accessToken: string;

  constructor(token: string) {
    super();
    this.accessToken = token;
  }
}
