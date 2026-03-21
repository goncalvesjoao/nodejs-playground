import type { IncomingHttpHeaders, OutgoingHttpHeaders } from 'http';
import { URLSearchParams } from 'url';

export type ServerAppRequestType = {
  body: () => Promise<string>;
  headers: IncomingHttpHeaders;
  method: string;
  pathname: string;
  searchParams: URLSearchParams;
};

export type ServerAppResponseType = {
  statusCode: number;
  headers: OutgoingHttpHeaders;
  body: any;
};

export interface ServerAppInterface {
  run(req: ServerAppRequestType): Promise<ServerAppResponseType>;
}
