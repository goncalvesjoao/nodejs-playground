import {
  ApiController,
  AssetsController,
  AdminController,
  RootController,
} from '@/controllers';
import { CorsMiddleware } from '@/middlewares';

export const app = new CorsMiddleware(
  new ApiController(
    new AdminController(new AssetsController(new RootController())),
  ),
);
