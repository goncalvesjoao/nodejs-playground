import {
  ApiController,
  AssetsController,
  AdminController,
  RootController,
} from '@/controllers';
import {
  BodyParserMiddleware,
  ContentTypeMiddleware,
  CorsMiddleware,
} from '@/middlewares';

export const app = new CorsMiddleware(
  new BodyParserMiddleware(
    new ContentTypeMiddleware(
      new ApiController(
        new AdminController(new AssetsController(new RootController())),
      ),
    ),
  ),
);
