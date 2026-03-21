import * as http from 'http';
import { DEFAULT_SERVER_PORT } from '@/constants';
import { ServerAppInterface } from '@/types';

export class WebServer {
  protected server: http.Server;

  get url() {
    return `http://localhost:${this.serverPort}`;
  }

  constructor(
    protected app: ServerAppInterface,
    readonly serverPort: number = DEFAULT_SERVER_PORT,
  ) {
    this.server = http.createServer(
      (req: http.IncomingMessage, res: http.ServerResponse) => {
        const url = new URL(req.url ?? '', this.url);
        let bodyText: string | undefined = undefined;

        this.app
          .run({
            body(): Promise<string> {
              if (bodyText !== undefined) {
                return Promise.resolve(bodyText);
              }

              bodyText = '';

              req.on('data', (chunk: Buffer) => {
                bodyText += chunk.toString();
              });

              return new Promise((resolve) => {
                req.on('end', () => resolve(bodyText ?? ''));
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
