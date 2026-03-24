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

export function composeServerModChain(input: {
  chainLinks: Array<typeof ChainLinkServerMod>;
  deadEnd: ServerModFuncType;
}): ServerMod {
  return input.chainLinks.reduceRight<ServerMod>(
    (accumulator, ChainLink) => new ChainLink(accumulator),
    new ChainEndServerMod(input.deadEnd),
  );
}
