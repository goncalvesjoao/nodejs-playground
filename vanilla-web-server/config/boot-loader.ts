import { WebServer } from '@lib/framework';
import { App } from '@app/index';
import { env } from '@config/env';

class BootLoader {
  webServer?: WebServer;

  async start() {
    if (this.webServer) return;

    await env.load();

    this.webServer = new WebServer({
      app: new App(),
      logger: env.mode === 'TEST' ? undefined : console,
      serverPort: env.serverPort,
    });

    await this.webServer.listen();
  }

  async stop() {
    if (!this.webServer) {
      return;
    }

    await this.webServer.close();
  }
}

export const bootLoader = new BootLoader();
