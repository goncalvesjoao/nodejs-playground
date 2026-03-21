import type {
  ServerModInterface,
  ServerModRequestType,
  ServerModResponseType,
} from '@/types';
import { readPublicFile } from '@/utils';

export class RootController implements ServerModInterface {
  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (req.method === 'GET' && (req.pathname === '/' || req.pathname === '')) {
      return {
        status: 200,
        body: await readPublicFile('index.html', 'utf-8'),
      };
    }

    return {
      status: 404,
      body: await readPublicFile('not_found.html', 'utf-8'),
    };
  }
}
