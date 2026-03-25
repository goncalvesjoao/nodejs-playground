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

  async deadEndFallback(): Promise<ResponseType> {
    return {
      status: 404,
      body: await readPublicFile('not_found.html', 'utf-8'),
    };
  }
}
