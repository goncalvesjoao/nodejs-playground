import {
  ApiHandler,
  AssetsHandler,
  AsciiHandler,
  RootHandler,
} from '@/handlers';
import { CorsMiddleware } from '@/middleware';

export const handler = new CorsMiddleware(
  new ApiHandler(new AsciiHandler(new AssetsHandler(new RootHandler()))),
);
