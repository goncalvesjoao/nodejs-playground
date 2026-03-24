import type { IncomingHttpHeaders, OutgoingHttpHeaders } from 'http';

export type RequestType = {
  body: () => Promise<Buffer>;
  headers: IncomingHttpHeaders;
  method: string;
  path: string;
  params: Record<string, string>;
};

export type ResponseType = {
  status: number;
  headers?: OutgoingHttpHeaders;
  body?: any;
};

export abstract class RequestHandler {
  abstract handle(req: RequestType): Promise<ResponseType>;
}

export class ChainLinkRequestHandler extends RequestHandler {
  constructor(protected next: RequestHandler) {
    super();
  }

  handle(req: RequestType): Promise<ResponseType> {
    return this.next.handle(req);
  }
}

export function composeRequestHandlerChain(
  chainLinks: Array<typeof ChainLinkRequestHandler>,
  endOfChain: (req: RequestType) => Promise<ResponseType>,
): RequestHandler {
  return chainLinks.reduceRight<RequestHandler>(
    (accumulator, ChainLink) => new ChainLink(accumulator),
    { handle: endOfChain },
  );
}
