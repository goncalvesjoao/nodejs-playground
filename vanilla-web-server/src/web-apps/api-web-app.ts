import type { WebApp, WebAppEnvType, WebAppOutputType } from '@/types';

const BASE_PATH = '/api';

export class ApiWebApp implements WebApp {
  protected nextApp: WebApp;

  constructor(nextApp: WebApp) {
    this.nextApp = nextApp;
  }

  async run(env: WebAppEnvType): Promise<WebAppOutputType> {
    if (!env.pathname.startsWith(BASE_PATH)) {
      return this.nextApp.run(env);
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
