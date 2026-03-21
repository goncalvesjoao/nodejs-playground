import type {
  ServerAppRequestType,
  ServerAppInterface,
  ServerAppResponseType,
} from '@/types';
import { RootAdminHandler } from '@/handlers/admin-handlers';
import { HtmlMiddleware } from '@/middlewares';

const BASE_PATH = '/admin';

export class AdminHandler implements ServerAppInterface {
  constructor(protected nextServerApp: ServerAppInterface) {}

  async run(req: ServerAppRequestType): Promise<ServerAppResponseType> {
    if (!req.pathname.startsWith(BASE_PATH)) {
      return this.nextServerApp.run(req);
    }

    const handler = new HtmlMiddleware(new RootAdminHandler());

    return handler.run({
      ...req,
      pathname: req.pathname.replace(BASE_PATH, ''),
    });
  }
}
