import type {
  ServerAppRequestType,
  ServerAppInterface,
  ServerAppResponseType,
} from '@/types';

export class RootApiHandler implements ServerAppInterface {
  async run(req: ServerAppRequestType): Promise<ServerAppResponseType> {
    if (req.pathname === '' || req.pathname === '/') {
      return Promise.resolve({
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: { message: 'Welcome to the API!' },
      });
    }

    return Promise.resolve({
      statusCode: 501,
      headers: { 'Content-Type': 'application/json' },
      body: { message: 'Not Implemented' },
    });
  }
}
