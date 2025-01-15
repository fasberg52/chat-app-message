import { BaseResponse, Pagination } from '@app/common/responses/base.response';
import { MessageEntity } from '@app/database';
import { ApiProperty } from '@nestjs/swagger';

export class MessageResponse extends BaseResponse {
  @ApiProperty()
  result: MessageEntity;
  constructor(result: MessageEntity) {
    super();
    this.result = result;
  }
}

export class MessagesListResponse extends BaseResponse {
  @ApiProperty()
  result: MessageEntity[];
  @ApiProperty()
  pagination: Pagination;
  constructor(result: MessageEntity[], pagination: Pagination) {
    super();
    this.result = result;
    this.pagination = pagination;
  }
}
