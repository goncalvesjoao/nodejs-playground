import type {
  ServerAppRequestType,
  ServerAppInterface,
  ServerAppResponseType,
} from '@/types';

const BASE_PATH = /\/api\/?(.*)/;

export class Api implements ServerAppInterface {
  constructor(protected nextServerApp: ServerAppInterface) {}

  async run(req: ServerAppRequestType): Promise<ServerAppResponseType> {
    const match = req.pathname.match(BASE_PATH);

    if (!match) {
      return this.nextServerApp.run(req);
    }

    if (match[1] === '') {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Hello from the API!' }),
      };
    }

    return {
      statusCode: 501,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Not Implemented' }),
    };
  }
}
