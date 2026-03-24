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

export class ChainLinkServerMod extends ServerMod {
  constructor(protected next: ServerMod) {
    super();
  }

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    return this.next.run(req);
  }
}

export class ChainEndServerMod extends ServerMod {
  constructor(protected serverMod: ServerModFuncType) {
    super();
  }

  run(req: ServerModRequestType): Promise<ServerModResponseType> {
    return this.serverMod(req);
  }
}

export class ChainServerMod {
  chainLinks: Array<typeof ChainLinkServerMod> = [];

  deadEnd(_req: ServerModRequestType): Promise<ServerModResponseType> {
    throw new Error('#deadEnd method not implemented');
  }

  run(req: ServerModRequestType): Promise<ServerModResponseType> {
    const serverMod = this.chainLinks.reduceRight<ServerMod>(
      (accumulator, ChainLink) => new ChainLink(accumulator),
      new ChainEndServerMod(this.deadEnd.bind(this)),
    );

    return serverMod.run(req);
  }
}
