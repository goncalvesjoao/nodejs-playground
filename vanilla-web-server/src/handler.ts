import {
  ApiHandler,
  AssetsHandler,
  AdminHandler,
  RootHandler,
} from '@/handlers';
import { CorsMiddleware } from '@/middlewares';

export const handler = new CorsMiddleware(
  new ApiHandler(new AdminHandler(new AssetsHandler(new RootHandler()))),
);
