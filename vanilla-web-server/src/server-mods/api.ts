import { ServerMod } from '@/server-mod';
import type { ServerModEnvType, ServerModOutputType } from '@/types';

const BASE_PATH = '/api';

export class Api extends ServerMod {
  async run(env: ServerModEnvType): Promise<ServerModOutputType> {
    if (!env.pathname.startsWith(BASE_PATH)) {
      return this.nextMod.run(env);
    }

    if (env.pathname === BASE_PATH || env.pathname === `${BASE_PATH}/`) {
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
