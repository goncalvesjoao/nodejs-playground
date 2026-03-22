import type {
  ServerModRequestType,
  ServerModInterface,
  ServerModResponseType,
  ServerModFuncType,
} from '@/types';
import { renderView } from '@/utils';
import path from 'path';

const BASE_PATH = '';

export class RootAdminController implements ServerModInterface {
  constructor(
    protected nextServerMod: ServerModFuncType,
    protected basePathPrefix: string = '',
  ) {}

  get basePath() {
    return `${this.basePathPrefix}${BASE_PATH}`;
  }

  run = async (req: ServerModRequestType): Promise<ServerModResponseType> => {
    if (
      req.method === 'GET' &&
      (req.pathname === this.basePath || req.pathname === `${this.basePath}/`)
    ) {
      const data = { title: 'Admin Home Page' };

      return {
        status: 200,
        body: await renderView(path.join(this.basePath, 'index.html'), data),
      };
    }

    return this.nextServerMod(req);
  };
}
