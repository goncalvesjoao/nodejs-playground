import {
  ApiController,
  AssetsController,
  AdminController,
  RootController,
  AuthController,
} from '@/controllers';
import {
  BodyParserMiddleware,
  ContentTypeMiddleware,
  CorsMiddleware,
} from '@/middlewares';
import { readPublicFile } from '@/utils';
import {
  ChainServerMod,
  ServerModRequestType,
  ServerModResponseType,
} from '@/server-mod';

export class App extends ChainServerMod {
  chainLinks = [
    CorsMiddleware,
    BodyParserMiddleware,
    ContentTypeMiddleware,
    ApiController,
    AssetsController,
    AuthController,
    AdminController,
    RootController,
  ];

  async deadEnd(_req: ServerModRequestType): Promise<ServerModResponseType> {
    return {
      status: 404,
      body: await readPublicFile('not_found.html', 'utf-8'),
    };
  }
}

// export const app = new CorsMiddleware(
//   new BodyParserMiddleware(
//     new ContentTypeMiddleware(
//       new ApiController(
//         new AssetsController(
//           new AuthController(
//             new AdminController(
//               new RootController(
//                 new ChainEndServerMod(async () =>
//                   Promise.resolve({
//                     status: 404,
//                     body: await readPublicFile('not_found.html', 'utf-8'),
//                   }),
//                 ),
//               ),
//             ),
//           ),
//         ),
//       ),
//     ),
//   ),
// );
