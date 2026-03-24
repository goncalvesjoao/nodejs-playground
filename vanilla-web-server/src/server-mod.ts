import type { IncomingHttpHeaders, OutgoingHttpHeaders } from 'http';

export type ServerModRequestType = {
  body: () => Promise<Buffer>;
  headers: IncomingHttpHeaders;
  method: string;
  path: string;
  params: Record<string, string>;
};

export type ServerModResponseType = {
  status: number;
  headers?: OutgoingHttpHeaders;
  body?: any;
};

export abstract class ServerMod {
  abstract run(req: ServerModRequestType): Promise<ServerModResponseType>;
}

export class ChainLinkServerMod extends ServerMod {
  constructor(protected next: ServerMod) {
    super();
  }

  run(req: ServerModRequestType): Promise<ServerModResponseType> {
    return this.next.run(req);
  }
}
