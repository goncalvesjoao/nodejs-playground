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

export const app = new CorsMiddleware(
  new BodyParserMiddleware(
    new ContentTypeMiddleware(
      new CountriesApiController(
        new RootApiController(
          new RootAdminController(
            new AssetsController(
              new AuthController(
                new RootController({
                  async run() {
                    return Promise.resolve({
                      status: 404,
                      body: await readPublicFile('not_found.html', 'utf-8'),
                    });
                  },
                }),
              ),
            ),
          ),
        ),
      ),
    ),
  ),
);
