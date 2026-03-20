import { ServerMod } from '@/server-mod';
import type { ServerModEnvType, ServerModOutputType } from '@/types';

const BASE_PATH = '/preview';

export class Preview extends ServerMod {
  async run(env: ServerModEnvType): Promise<ServerModOutputType> {
    if (!env.pathname.startsWith(BASE_PATH) || env.method !== 'GET') {
      return this.nextMod.run(env);
    }

    return Promise.resolve({
      statusCode: 200,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Hello from the Preview!',
    });
  }
}
