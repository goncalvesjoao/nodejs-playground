import figlet from 'figlet';
import type {
  ServerAppEnvType,
  ServerAppInterface,
  ServerAppOutputType,
} from '@/types';

const BASE_PATH = /\/ascii\/?(.*)/;

export class Ascii implements ServerAppInterface {
  constructor(protected nextServerApp: ServerAppInterface) {}

  async run(env: ServerAppEnvType): Promise<ServerAppOutputType> {
    const match = env.pathname.match(BASE_PATH);

    if (!match || env.method !== 'GET') {
      return this.nextServerApp.run(env);
    }

    return Promise.resolve({
      statusCode: 200,
      headers: { 'Content-Type': 'text/plain' },
      body: figlet.textSync(match[1] || 'Hello World!'),
    });
  }
}
