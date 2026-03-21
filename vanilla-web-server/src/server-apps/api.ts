import type {
  ServerAppEnvType,
  ServerAppInterface,
  ServerAppOutputType,
} from '@/types';

const BASE_PATH = '/api';

export class Api implements ServerAppInterface {
  constructor(protected nextServerApp: ServerAppInterface) {}

  async run(env: ServerAppEnvType): Promise<ServerAppOutputType> {
    if (!env.pathname.startsWith(BASE_PATH)) {
      return this.nextServerApp.run(env);
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
