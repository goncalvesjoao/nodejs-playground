import * as http from 'http';
import type { ServerModInterface } from '@/types';
import { Api, Assets, Cors, Preview, Root } from '@/server-mods';
import { DEFAULT_SERVER_PORT } from '@/constants';
import { ServerMod } from '@/server-mod';

export class WebServer {
  protected server: http.Server;

  get url() {
    return `http://localhost:${this.serverPort}`;
  }

  constructor(readonly serverPort: string = DEFAULT_SERVER_PORT) {
    this.server = http.createServer(
      (req: http.IncomingMessage, res: http.ServerResponse) => {
        const serverModules: (typeof ServerMod)[] = [
          Cors,
          Api,
          Preview,
          Assets,
        ];
        const serverApp: ServerModInterface =
          serverModules.reduceRight<ServerModInterface>(
            (parentServerMod, ServerModule) =>
              new ServerModule(parentServerMod),
            new Root(),
          );

        const url = new URL(req.url ?? '', this.url);

        serverApp
          .run({
            body(): Promise<string> {
              let body = '';

              req.on('data', (chunk: Buffer) => {
                body += chunk.toString();
              });

              return new Promise((resolve) => {
                req.on('end', () => resolve(body));
              });
            },
            headers: req.headers,
            method: req.method ?? 'GET',
            pathname: url.pathname,
            searchParams: url.searchParams,
          })
          .then(({ statusCode, headers, body }) => {
            res.writeHead(statusCode, headers);
            res.end(body);
          })
          .catch((error) => {
            console.error('Error handling request', error);

            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal Server Error' }));
          });
      },
    );
  }

  listen() {
    this.server.listen(this.serverPort, () => {
      console.log(`\nListening at ${this.url}`);
      console.log(`\nPress Ctrl+C to stop.`);
    });
  }

  close() {
    this.server.close(() => {
      console.log('Server stopped.');
    });
  }
}
