import { WebServer } from '@/web-server';
import { serverApp } from '@/server-app';

async function main() {
  const webServer = new WebServer(
    serverApp,
    process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : undefined,
    console,
  );

  await webServer.listen();
}

void main();
