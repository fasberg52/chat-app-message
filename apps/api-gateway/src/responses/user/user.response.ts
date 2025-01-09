import { BaseResponse } from '@app/common/responses/base.response';
import { UserEntity } from '@app/database';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@ApiExtraModels()
export class UserResponse extends BaseResponse {
  @ApiProperty()
  result: UserEntity;

  constructor(user: UserEntity) {
    super();
    this.result = user;
  }
}
