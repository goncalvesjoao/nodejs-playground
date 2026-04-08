import {
  RequestHandler,
  RequestType,
  ResponseType,
  ChainLinkRequestHandler,
} from '@lib/framework/request-handler';
import { Controller } from '@lib/framework/controller';

export class WebApp extends RequestHandler {
  middleware: Array<typeof ChainLinkRequestHandler> = [];
  controllers: Array<Controller> = [];

  protected _requestHandler?: RequestHandler;

  handle(req: RequestType): Promise<ResponseType> {
    this._requestHandler ||= [
      ...this.middleware,
      ...this.controllers.map((controller) =>
        buildControllerMiddleware(controller),
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

function buildControllerMiddleware(controller: Controller) {
  return class extends ChainLinkRequestHandler {
    async handle(req: RequestType): Promise<ResponseType> {
      const result = await controller.handle(req);

      return result === false ? this.nextHandler.handle(req) : result;
    }
  };
}
