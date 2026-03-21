import type {
  ServerAppRequestType,
  ServerAppInterface,
  ServerAppResponseType,
} from '@/types';
import { readPublicFile, renderView } from '@/utils';

export class RootAdminHandler implements ServerAppInterface {
  async run(req: ServerAppRequestType): Promise<ServerAppResponseType> {
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
