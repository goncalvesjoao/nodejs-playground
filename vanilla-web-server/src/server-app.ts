import { Api, Assets, Ascii, Root } from '@/server-apps';
import { Cors } from '@/middleware';

export const serverApp = new Cors(new Api(new Ascii(new Assets(new Root()))));
