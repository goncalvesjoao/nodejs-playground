import * as http from 'http';
import { DEFAULT_SERVER_PORT } from '@/constants';
import { ServerAppInterface } from '@/types';

export class Logger {
  log(..._args: unknown[]) {}
  error(..._args: unknown[]) {}
}

export class WebServer {
  protected server: http.Server;

  get url() {
    return `http://localhost:${this.serverPort}`;
  }

  constructor(
    protected app: ServerAppInterface,
    readonly serverPort: number = DEFAULT_SERVER_PORT,
    private logger: Logger = new Logger(),
  ) {
    this.server = http.createServer(
      (req: http.IncomingMessage, res: http.ServerResponse) => {
        const url = new URL(req.url ?? '', this.url);

        const bodyPromise = new Promise<string>((resolve, reject) => {
          let bodyText = '';

          req.on('data', (chunk: Buffer) => {
            bodyText += chunk.toString();
          });

          req.on('end', () => resolve(bodyText));
          req.on('error', reject);
        });

        this.app
          .run({
            body(): Promise<string> {
              return bodyPromise;
            },
            headers: req.headers,
            method: req.method ?? 'GET',
            pathname: url.pathname,
            searchParams: Object.fromEntries(url.searchParams),
          })
          .then(({ status, headers, body }) => {
            res.writeHead(status, headers);
            res.end(body);
          })
          .catch((error) => {
            this.logger.error('Error handling request', error);

            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal Server Error' }));
          });
      },
    );
  }

  listen(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.once('error', reject);
      this.server.listen(this.serverPort, () => {
        this.server.off('error', reject);
        this.logger.log(`\nListening at ${this.url}`);
        this.logger.log(`\nPress Ctrl+C to stop.`);
        resolve();
      });
    });
  }

  close(): Promise<void> {
    this.server.closeAllConnections();

    return new Promise((resolve, reject) => {
      this.server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        this.logger.log('Server stopped.');
        resolve();
      });
    });
  }
}
