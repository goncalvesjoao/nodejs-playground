import { WebServer } from '@/web-server';
import { handler } from '@/handler';

async function main() {
  const webServer = new WebServer(
    handler,
    process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : undefined,
    console,
  );

  await webServer.listen();
}

void main();
