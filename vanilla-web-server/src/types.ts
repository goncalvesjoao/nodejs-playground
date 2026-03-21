import type { IncomingHttpHeaders, OutgoingHttpHeaders } from 'http';

export type ServerAppRequestType = {
  body: () => Promise<string>;
  headers: IncomingHttpHeaders;
  method: string;
  pathname: string;
  searchParams: Record<string, string>;
};

export type ServerAppResponseType = {
  status: number;
  headers?: OutgoingHttpHeaders;
  body?: any;
};

export interface ServerAppInterface {
  run(req: ServerAppRequestType): Promise<ServerAppResponseType>;
}
