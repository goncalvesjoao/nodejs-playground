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
import { ServerMod } from './server-mod';

export const app = new CorsMiddleware(
  new BodyParserMiddleware(
    new ContentTypeMiddleware(
      new ApiController(
        new AdminController(
          new AssetsController(
            new AuthController(
              new RootController(
                ServerMod.new(async () =>
                  Promise.resolve({
                    status: 404,
                    body: await readPublicFile('not_found.html', 'utf-8'),
                  }),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  ),
);
