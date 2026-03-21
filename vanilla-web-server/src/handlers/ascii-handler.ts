import figlet from 'figlet';
import type {
  ServerAppRequestType,
  ServerAppInterface,
  ServerAppResponseType,
} from '@/types';

const BASE_PATH = /\/ascii\/?(.*)/;

export class AsciiHandler implements ServerAppInterface {
  constructor(protected nextServerApp: ServerAppInterface) {}

  async run(req: ServerAppRequestType): Promise<ServerAppResponseType> {
    const match = req.pathname.match(BASE_PATH);

    if (!match || req.method !== 'GET') {
      return this.nextServerApp.run(req);
    }

    return Promise.resolve({
      statusCode: 200,
      headers: { 'Content-Type': 'text/plain' },
      body: figlet.textSync(match[1] || 'Hello World!'),
    });
  }
}
