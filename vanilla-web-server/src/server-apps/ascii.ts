import figlet from 'figlet';
import { ServerApp } from '@/server-app';
import type { ServerAppEnvType, ServerAppOutputType } from '@/types';

const BASE_PATH = /\/ascii\/?(.*)/;

export class Ascii extends ServerApp {
  async run(env: ServerAppEnvType): Promise<ServerAppOutputType> {
    const match = env.pathname.match(BASE_PATH);

    if (!match || env.method !== 'GET') {
      return this.nextMod.run(env);
    }

    return Promise.resolve({
      statusCode: 200,
      headers: { 'Content-Type': 'text/plain' },
      body: figlet.textSync(match[1] || 'Hello World!'),
    });
  }
}
