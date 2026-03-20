import type { IncomingHttpHeaders, OutgoingHttpHeaders } from 'http';
import { URLSearchParams } from 'url';

export type WebAppEnvType = {
  body: () => Promise<string>;
  headers: IncomingHttpHeaders;
  method: string;
  pathname: string;
  searchParams: URLSearchParams;
};

export type WebAppOutputType = {
  statusCode: number;
  headers?: OutgoingHttpHeaders;
  body: any;
};

export interface WebApp {
  run(env: WebAppEnvType): Promise<WebAppOutputType>;
}
