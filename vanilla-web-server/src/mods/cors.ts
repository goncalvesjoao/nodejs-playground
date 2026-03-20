import type {
  ServerModInterface,
  ServerModEnvType,
  ServerModOutputType,
} from '@/types';

export class Cors implements ServerModInterface {
  constructor(private nextMod: ServerMod) {}

  async run(env: ServerModEnvType): Promise<ServerModOutputType> {
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
