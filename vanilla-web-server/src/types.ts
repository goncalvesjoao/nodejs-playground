import type { IncomingHttpHeaders, OutgoingHttpHeaders } from 'http';
import { URLSearchParams } from 'url';

export type ServerAppEnvType = {
  body: () => Promise<string>;
  headers: IncomingHttpHeaders;
  method: string;
  pathname: string;
  searchParams: URLSearchParams;
};

export type ServerAppOutputType = {
  statusCode: number;
  headers?: OutgoingHttpHeaders;
  body?: any;
};

export interface ServerAppInterface {
  run(env: ServerAppEnvType): Promise<ServerAppOutputType>;
}
