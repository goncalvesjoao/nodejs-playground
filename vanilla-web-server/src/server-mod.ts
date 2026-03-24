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

export type ServerModFuncType = (
  req: ServerModRequestType,
) => Promise<ServerModResponseType>;

export interface ServerModInterface {
  run: ServerModFuncType;
}

export class ServerMod implements ServerModInterface {
  run(_req: ServerModRequestType): Promise<ServerModResponseType> {
    throw new Error('Method not implemented in child class');
  }
}

export class ChainEndServerMod extends ServerMod {
  constructor(protected serverModFunc: ServerModFuncType) {
    super();
  }

  run(req: ServerModRequestType): Promise<ServerModResponseType> {
    return this.serverModFunc(req);
  }
}

export class ChainLinkServerMod extends ServerMod {
  constructor(protected nextServerMod: ServerMod) {
    super();
  }

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    return this.next(req);
  }

  async next(req: ServerModRequestType): Promise<ServerModResponseType> {
    return this.nextServerMod.run(req);
  }
}
