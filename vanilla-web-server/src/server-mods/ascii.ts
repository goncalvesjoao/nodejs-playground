import figlet from 'figlet';
import { ServerMod } from '@/server-mod';
import type { ServerModEnvType, ServerModOutputType } from '@/types';

const BASE_PATH = /\/ascii\/?(.*)/;

export class Ascii extends ServerMod {
  async run(env: ServerModEnvType): Promise<ServerModOutputType> {
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
