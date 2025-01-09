import { RpcException } from '@nestjs/microservices';

export class UnauthorizedRpcException extends RpcException {
  constructor(message: string) {
    super({ message, statusCode: 401 });
  }
}

export class ForbiddenRpcException extends RpcException {
  constructor(message: string) {
    super({ message, statusCode: 403 });
  }
}

export class BadRequestRpcException extends RpcException {
  constructor(message: string) {
    super({ message, statusCode: 400 });
  }
}

export class NotFoundRpcException extends RpcException {
  constructor(message: string) {
    super({ message, statusCode: 404 });
  }
}
