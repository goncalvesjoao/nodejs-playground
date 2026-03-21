import { Api, Assets, Cors, Ascii, Root } from '@/server-apps';

export const serverApp = new Cors(new Api(new Ascii(new Assets(new Root()))));
