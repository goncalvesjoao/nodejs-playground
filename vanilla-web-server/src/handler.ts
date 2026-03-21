import {
  ApiHandler,
  AssetsHandler,
  AsciiHandler,
  RootHandler,
} from '@/handlers';
import { CorsMiddleware } from '@/middlewares';

export const handler = new CorsMiddleware(
  new ApiHandler(new AsciiHandler(new AssetsHandler(new RootHandler()))),
);
