import { ServerApp } from '@/server-app';
import type { ServerAppEnvType, ServerAppOutputType } from '@/types';

export class Cors extends ServerApp {
  async run(env: ServerAppEnvType): Promise<ServerAppOutputType> {
    if (env.method !== 'OPTIONS') {
      return await this.nextMod.run(env);
    }

    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: null,
    };
  }
}
