import type {
  ServerModRequestType,
  ServerModInterface,
  ServerModResponseType,
} from '@/types';
import { readPublicFile, renderView } from '@/utils';

export class RootAdminController implements ServerModInterface {
  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (req.method === 'GET' && (req.pathname === '/' || req.pathname === '')) {
      const data = { title: 'Admin Home Page' };

      return {
        status: 200,
        body: await renderView('admin/index.html', data),
      };
    }

    return {
      status: 404,
      body: await readPublicFile('not_found.html'),
    };
  }
}
