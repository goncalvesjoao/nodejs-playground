import type { IncomingHttpHeaders, OutgoingHttpHeaders } from 'http';

export type ServerModRequestType = {
  body: () => Promise<Buffer>;
  headers: IncomingHttpHeaders;
  method: string;
  pathname: string;
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
  static new(
    serverMod: ServerModFuncType | ServerModResponseType,
  ): ServerModInterface {
    if (typeof serverMod === 'object') {
      return new this({ run: async () => Promise.resolve(serverMod) });
    }

    return new this({ run: serverMod });
  }

  constructor(protected nextServerMod: ServerModInterface) {}

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    return this.next(req);
  }

  async next(req: ServerModRequestType): Promise<ServerModResponseType> {
    return this.nextServerMod.run(req);
  }
}
