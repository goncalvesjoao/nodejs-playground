import type {
  ServerModRequestType,
  ServerModInterface,
  ServerModResponseType,
} from '@/types';

export class RootApiController implements ServerModInterface {
  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
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
