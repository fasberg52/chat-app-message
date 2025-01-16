import { BaseResponse } from '@app/common/responses/base.response';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@ApiExtraModels()
export class TokenResult {
  @ApiProperty()
  accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}

@ApiExtraModels()
export class TokenResponse extends BaseResponse {
  @ApiProperty({ type: TokenResult })
  result: TokenResult;

  constructor(accessToken: string) {
    super();
    this.result = new TokenResult(accessToken);
  }
}
