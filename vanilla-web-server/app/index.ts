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
import { WebApp } from '@lib/framework';

export class App extends WebApp {
  middlewares = [CorsMiddleware, BodyParserMiddleware, ContentTypeMiddleware];

  controllers = [
    new CountriesApiController(),
    new RootApiController(),
    new RootAdminController(),
    new PublicController(),
    new AuthController(),
    new RootController(),
  ];
}
