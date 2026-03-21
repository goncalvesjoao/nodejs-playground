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
        headers: { 'Content-Type': 'text/html' },
        body: await readPublicFile('index.html'),
      };
    }

    return {
      status: 404,
      headers: { 'Content-Type': 'text/html' },
      body: await readPublicFile('not_found.html'),
    };
  }
}
