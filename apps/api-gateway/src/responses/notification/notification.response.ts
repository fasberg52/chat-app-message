import { BaseResponse, Pagination } from '@app/common/responses/base.response';
import { NotificationEntity } from '@app/database';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@ApiExtraModels()
export class NotificationResponse extends BaseResponse {
  @ApiProperty()
  result: NotificationEntity;
  constructor(result: NotificationEntity) {
    super();
    this.result = result;
  }
}

@ApiExtraModels()
export class NotificationsListResponse extends BaseResponse {
  @ApiProperty()
  result: NotificationEntity[];
  @ApiProperty()
  pagination: Pagination;
  constructor(result: NotificationEntity[], total: number) {
    super();
    this.result = result;
    this.pagination = Pagination.set({ total });
  }
}
