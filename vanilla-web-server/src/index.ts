import { WebServer } from '@/web-server';

async function main() {
  const webServer = new WebServer(
    process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : undefined,
  );

  webServer.logger = console;

  await webServer.listen();
}

void main();
