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

export abstract class ServerMod implements ServerModInterface {
  abstract run(req: ServerModRequestType): Promise<ServerModResponseType>;
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

export class TerminalServerMod implements ServerModInterface {
  constructor(protected serverMod: ServerModResponseType | ServerModFuncType) {}

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (typeof this.serverMod === 'object') {
      return Promise.resolve(this.serverMod);
    }

    return this.serverMod(req);
  }
}
