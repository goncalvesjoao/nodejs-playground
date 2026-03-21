import type {
  ServerModRequestType,
  ServerModInterface,
  ServerModResponseType,
} from '@/types';
import { RootAdminHandler } from '@/handlers/admin-handlers';
import { HtmlMiddleware } from '@/middlewares';

const BASE_PATH = '/admin';

const handler = new RootAdminHandler();

export class AdminHandler implements ServerModInterface {
  handler: ServerModInterface = handler;

  constructor(protected nextServerMod: ServerModInterface) {}

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (!req.pathname.startsWith(BASE_PATH)) {
      return this.nextServerMod.run(req);
    }

    const app = new HtmlMiddleware(this.handler);

    return app.run({
      ...req,
      pathname: req.pathname.replace(BASE_PATH, ''),
    });
  }
}
