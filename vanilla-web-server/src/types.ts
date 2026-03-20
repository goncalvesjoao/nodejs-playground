import type { IncomingHttpHeaders, OutgoingHttpHeaders } from 'http';
import { URLSearchParams } from 'url';

export type ServerModEnvType = {
  body: () => Promise<string>;
  headers: IncomingHttpHeaders;
  method: string;
  pathname: string;
  searchParams: URLSearchParams;
};

export type ServerModOutputType = {
  statusCode: number;
  headers?: OutgoingHttpHeaders;
  body?: any;
};

export interface ServerMod {
  run(env: ServerModEnvType): Promise<ServerModOutputType>;
}
