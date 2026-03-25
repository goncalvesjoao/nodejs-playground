import {
  BodyParserMiddleware,
  ContentTypeMiddleware,
  CorsMiddleware,
} from '@lib/middleware';
import {
  CountriesApiController,
  RootApiController,
  PublicController,
  RootAdminController,
  RootController,
  AuthController,
} from '@app/controllers';
import { WebApp, ResponseType } from '@lib/framework';
import { readPublicFile } from '@app/utils';

export class App extends WebApp {
  middlewares = [CorsMiddleware, BodyParserMiddleware, ContentTypeMiddleware];

  controllers = [
    CountriesApiController,
    RootApiController,
    RootAdminController,
    PublicController,
    AuthController,
    RootController,
  ];

  deadEndFallback(): Promise<ResponseType> {
    return readPublicFile('not_found.html', 'utf-8').then((body) => ({
      status: 404,
      body,
    }));
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
//     PublicController,
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
//             new PublicController(
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
