import { Api, Assets, Cors, Ascii, Root } from '@/server-apps';
import { ServerAppInterface } from '@/types';

export const serverApp: ServerAppInterface = new Cors(
  new Api(new Ascii(new Assets(new Root()))),
);
