import {
  composeRequestHandlerChain,
  RequestHandler,
  RequestType,
  ResponseType,
  ChainLinkRequestHandler,
} from '@/modules/request-handler';

export class ServerApp extends RequestHandler {
  middlewares: Array<typeof ChainLinkRequestHandler> = [];
  controllers: Array<typeof ChainLinkRequestHandler> = [];

  async deadEndFallback(_req: RequestType): Promise<ResponseType> {
    return Promise.resolve({ status: 404 });
  }

  protected _requestHandlerChain?: RequestHandler;

  get requestHandlerChain() {
    return (this._requestHandlerChain ||= composeRequestHandlerChain(
      [...this.middlewares, ...this.controllers],
      this.deadEndFallback.bind(this),
    ));
  }

  handle(req: RequestType): Promise<ResponseType> {
    return this.requestHandlerChain.handle(req);
  }
}
