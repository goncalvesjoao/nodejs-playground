import { WebServer } from '@/web-server';
import { serverApp } from '@/server-app';

function main() {
  const webServer = new WebServer(serverApp);

  webServer.listen();
}

main();
