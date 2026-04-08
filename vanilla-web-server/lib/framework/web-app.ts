import {
  RequestHandler,
  RequestType,
  ResponseType,
  ChainLinkRequestHandler,
} from '@lib/framework/request-handler';
import { Controller } from '@lib/framework/controller';

export class WebApp extends RequestHandler {
  middlewares: Array<typeof ChainLinkRequestHandler> = [];
  controllers: Array<Controller> = [];

  protected _requestHandler?: RequestHandler;

  handle(req: RequestType): Promise<ResponseType> {
    this._requestHandler ||= [
      ...this.middlewares,
      ...this.controllers.map((controller) =>
        controllerToChainLinkRequestHandler(controller),
      ),
    ].reduceRight<RequestHandler>(
      (accumulator, ChainLink) => new ChainLink(accumulator),
      { handle: this.fallback.bind(this) },
    );

    return this._requestHandler.handle(req);
  }

  async fallback(_req: RequestType): Promise<ResponseType> {
    return Promise.resolve({ status: 501 });
  }
}

function controllerToChainLinkRequestHandler(controller: Controller) {
  return class extends ChainLinkRequestHandler {
    handle(req: RequestType): Promise<ResponseType> {
      const handler = controller.handler(req);

      return handler ? handler(req) : this.next.handle(req);
    }
  };
}
