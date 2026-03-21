import type {
  ServerAppRequestType,
  ServerAppInterface,
  ServerAppResponseType,
} from '@/types';

export class RootApiHandler implements ServerAppInterface {
  async run(req: ServerAppRequestType): Promise<ServerAppResponseType> {
    if (req.method === 'GET' && (req.pathname === '/' || req.pathname === '')) {
      return Promise.resolve({
        status: 200,
        body: { message: 'Welcome to the API!' },
      });
    }

    return Promise.resolve({
      status: 501,
      body: { message: 'Not Implemented' },
    });
  }
}
