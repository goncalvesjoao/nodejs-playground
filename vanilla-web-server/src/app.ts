import {
  ApiController,
  AssetsController,
  AdminController,
  RootController,
} from '@/controllers';
import { ContentMiddleware, CorsMiddleware } from '@/middlewares';

export const app = new ContentMiddleware(
  new CorsMiddleware(
    new ApiController(
      new AdminController(new AssetsController(new RootController())),
    ),
  ),
);
