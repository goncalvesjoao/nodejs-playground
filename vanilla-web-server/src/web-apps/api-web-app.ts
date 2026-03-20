import type { WebAppEnvType, WebAppOutputType } from '@/types';
import { WebApp } from '@/web-app';

const BASE_PATH = '/api';

export class ApiWebApp extends WebApp {
  protected nextApp: WebApp;

  constructor(nextApp: WebApp) {
    super();

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
