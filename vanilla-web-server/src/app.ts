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
import { composeServerModChain } from '@/server-mod';

export const app = composeServerModChain(
  [
    CorsMiddleware,
    BodyParserMiddleware,
    ContentTypeMiddleware,
    CountriesApiController,
    RootApiController,
    RootAdminController,
    AssetsController,
    AuthController,
    RootController,
  ],
  async () => ({
    status: 404,
    body: await readPublicFile('not_found.html', 'utf-8'),
  }),
);

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
