import { HttpStatus } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

export class UnauthorizedWsException extends WsException {
  constructor(message: string) {
    super({ message, statusCode: HttpStatus.UNAUTHORIZED });
  }
}

export class ForbiddenWsException extends WsException {
  constructor(message: string) {
    super({ message, statusCode: HttpStatus.FORBIDDEN });
  }
}
export class NotFoundWsException extends WsException {
  constructor(message: string) {
    super({ message, statusCode: HttpStatus.NOT_FOUND });
  }
}
export class BadRequestWsException extends WsException {
  constructor(message: string) {
    super({ message, statusCode: HttpStatus.BAD_REQUEST });
  }
}
