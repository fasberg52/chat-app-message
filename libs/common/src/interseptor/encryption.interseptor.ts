// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import {
//   encryptMessage,
//   decryptMessage,
// } from '@app/shared/utils/encrypt-data.utils';

// @Injectable()
// export class EncryptionInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const client = context.switchToWs().getClient<WebSocket & { user?: any }>();
//     const data = context.switchToWs().getData();

//     if (data.encryptedData) {
//       const decryptedData = decryptMessage(
//         client.user.privateKey,
//         client.user.passphrase,
//         data.encryptedData,
//       );
//       context.switchToWs().getData().data = JSON.parse(decryptedData);
//     }

//     return next.handle().pipe(
//       map((response) => {
//         if (response && response.data) {
//           return {
//             event: response.event,
//             data: {
//               encryptedData: encryptMessage(
//                 client.user.publicKey,
//                 JSON.stringify(response.data),
//               ),
//             },
//           };
//         }
//         return response;
//       }),
//     );
//   }
// }
