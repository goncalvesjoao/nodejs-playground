import type {
  ServerAppRequestType,
  ServerAppInterface,
  ServerAppResponseType,
} from '@/types';

const BASE_PATH = '/api';

export class Api implements ServerAppInterface {
  constructor(protected nextServerApp: ServerAppInterface) {}

  async run(req: ServerAppRequestType): Promise<ServerAppResponseType> {
    if (!req.pathname.startsWith(BASE_PATH)) {
      return this.nextServerApp.run(req);
    }

    if (req.pathname === BASE_PATH || req.pathname === `${BASE_PATH}/`) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Hello from the API!' }),
      };
    }

    return {
      statusCode: 404,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Not Found' }),
    };
  }
}
