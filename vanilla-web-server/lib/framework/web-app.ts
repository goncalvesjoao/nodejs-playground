import {
  RequestHandler,
  RequestType,
  ResponseType,
  ChainLinkRequestHandler,
} from '@lib/framework/request-handler';

export class WebApp extends RequestHandler {
  middlewares: Array<typeof ChainLinkRequestHandler> = [];
  controllers: Array<typeof ChainLinkRequestHandler> = [];

  protected _requestHandler?: RequestHandler;

  async deadEndFallback(_req: RequestType): Promise<ResponseType> {
    return Promise.resolve({ status: 404 });
  }

  handle(req: RequestType): Promise<ResponseType> {
    this._requestHandler ||= [
      ...this.middlewares,
      ...this.controllers,
    ].reduceRight<RequestHandler>(
      (accumulator, ChainLink) => new ChainLink(accumulator),
      { handle: this.deadEndFallback.bind(this) },
    );

    return this._requestHandler.handle(req);
  }
}
