import type {
  ServerAppRequestType,
  ServerAppInterface,
  ServerAppResponseType,
} from '@/types';
import { readPublicFile, renderView } from '@/utils';

export class RootAdminHandler implements ServerAppInterface {
  async run(req: ServerAppRequestType): Promise<ServerAppResponseType> {
    if (req.method === 'GET' && (req.pathname === '/' || req.pathname === '')) {
      const body = await renderView('admin/index.html', {
        title: 'Admin Dashboard',
      });

      return Promise.resolve({ status: 200, body });
    }

    return {
      status: 404,
      body: await readPublicFile('not_found.html'),
    };
  }
}
