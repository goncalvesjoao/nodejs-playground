import {
  CountriesApiController,
  RootApiController,
  AssetsController,
  RootAdminController,
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
  composeServerModChain,
  ServerMod,
  ServerModRequestType,
  ServerModResponseType,
} from '@/server-mod';

export class App extends ServerMod {
  middlewares = [CorsMiddleware, BodyParserMiddleware, ContentTypeMiddleware];

  controllers = [
    CountriesApiController,
    RootApiController,
    RootAdminController,
    AssetsController,
    AuthController,
    RootController,
  ];

  deadEndFallback(): Promise<ServerModResponseType> {
    return readPublicFile('not_found.html', 'utf-8').then((body) => ({
      status: 404,
      body,
    }));
  }

  protected _serverModChain?: ServerMod;

  get serverModChain() {
    return (this._serverModChain ||= composeServerModChain(
      [...this.middlewares, ...this.controllers],
      this.deadEndFallback.bind(this),
    ));
  }

  run(req: ServerModRequestType): Promise<ServerModResponseType> {
    return this.serverModChain.run(req);
  }
}

// export const app = composeServerModChain(
//   [
//     CorsMiddleware,
//     BodyParserMiddleware,
//     ContentTypeMiddleware,
//     CountriesApiController,
//     RootApiController,
//     RootAdminController,
//     AssetsController,
//     AuthController,
//     RootController,
//   ],
//   async () => ({
//     status: 404,
//     body: await readPublicFile('not_found.html', 'utf-8'),
//   }),
// );

// export const app = new CorsMiddleware(
//   new BodyParserMiddleware(
//     new ContentTypeMiddleware(
//       new CountriesApiController(
//         new RootApiController(
//           new RootAdminController(
//             new AssetsController(
//               new AuthController(
//                 new RootController({
//                   run: async () => ({
//                     status: 404,
//                     body: await readPublicFile('not_found.html', 'utf-8'),
//                   }),
//                 }),
//               ),
//             ),
//           ),
//         ),
//       ),
//     ),
//   ),
// );
