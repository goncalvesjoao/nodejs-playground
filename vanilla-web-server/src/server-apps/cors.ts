import type {
  ServerAppEnvType,
  ServerAppInterface,
  ServerAppOutputType,
} from '@/types';

export class Cors implements ServerAppInterface {
  constructor(protected nextServerApp: ServerAppInterface) {}

  async run(env: ServerAppEnvType): Promise<ServerAppOutputType> {
    if (env.method !== 'OPTIONS') {
      return await this.nextServerApp.run(env);
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
