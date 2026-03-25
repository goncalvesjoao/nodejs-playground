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
