import type {
  ServerAppRequestType,
  ServerAppInterface,
  ServerAppResponseType,
} from '@/types';
import { Countries } from '@/server-apps/api/countries';
import { Root } from '@/server-apps/api/root';
import { JsonParser } from '@/middleware/json-parser';

const BASE_PATH = '/api';

export class Api implements ServerAppInterface {
  constructor(protected nextServerApp: ServerAppInterface) {}

  async run(req: ServerAppRequestType): Promise<ServerAppResponseType> {
    if (!req.pathname.startsWith(BASE_PATH)) {
      return this.nextServerApp.run(req);
    }

    const serverApp = new JsonParser(new Countries(new Root()));

    return serverApp.run({
      ...req,
      pathname: req.pathname.replace(BASE_PATH, ''),
    });
  }
}
