import { WebServer } from '@/web-server';
import { serverApp } from '@/server-app';

async function main() {
  const webServer = new WebServer(serverApp);

  await webServer.listen();
}

void main();
