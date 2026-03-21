import {
  ApiHandler,
  AssetsHandler,
  AsciiHandler,
  RootHandler,
} from '@/handlers';
import { Cors } from '@/middleware';

export const serverApp = new Cors(
  new ApiHandler(new AsciiHandler(new AssetsHandler(new RootHandler()))),
);
