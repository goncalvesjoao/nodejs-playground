import path from 'node:path';
import { match } from 'path-to-regexp';
import type { IncomingHttpHeaders, OutgoingHttpHeaders } from 'http';

export type RequestType = {
  body: () => Promise<Buffer>;
  headers: IncomingHttpHeaders;
  method: string;
  path: string;
  pathParams: Partial<Record<string, string | string[]>>;
  queryParams: Record<string, string>;
};

export type ResponseType = {
  status: number;
  headers?: OutgoingHttpHeaders;
  body?: any;
};

export type RequestHandleFunc = (req: RequestType) => Promise<ResponseType>;

export abstract class RequestHandler {
  abstract handle(req: RequestType): Promise<ResponseType>;
}

export class Middleware extends RequestHandler {
  constructor(protected nextHandler: RequestHandler) {
    super();
  }

  static compose(
    middlewares: Array<typeof Middleware>,
    fallbackHandle: (req: RequestType) => Promise<ResponseType>,
  ): RequestHandler {
    return middlewares.reduceRight<RequestHandler>(
      (accumulator, middlewareClass) => new middlewareClass(accumulator),
      { handle: fallbackHandle },
    );
  }

  handle(req: RequestType): Promise<ResponseType> {
    return this.nextHandler.handle(req);
  }
}

type ControllerActionType = {
  handler: RequestHandleFunc;
  methods: string[];
  path: string;
};

export class Controller {
  static basePath: string = '';
  static actions: ControllerActionType[] = [];

  static getAncestorBasePath(klass: typeof Controller): string {
    if (typeof klass.basePath !== 'string') return '';

    const parentBasePath = Controller.getAncestorBasePath(
      Object.getPrototypeOf(klass) as typeof Controller,
    );

    return path.join(
      '/',
      parentBasePath,
      klass.basePath.endsWith('/')
        ? klass.basePath.slice(0, -1)
        : klass.basePath,
    );
  }

  static buildMiddleware(controller: Controller) {
    return class extends Middleware {
      async handle(req: RequestType): Promise<ResponseType> {
        const result = await controller.handle(req);

        return result === false ? this.nextHandler.handle(req) : result;
      }
    };
  }

  protected klass = this.constructor as typeof Controller;

  readonly path = Controller.getAncestorBasePath(this.klass);

  async handle(req: RequestType): Promise<false | ResponseType> {
    for (const action of this.klass.actions) {
      if (!action.methods.includes(req.method)) continue;

      const reqPath = req.path.startsWith('/') ? req.path : `/${req.path}`;

      const matchResult = match(`${this.path}${action.path}`)(reqPath);

      if (matchResult === false) continue;

      return action.handler.call(this, {
        ...req,
        path: reqPath,
        pathParams: matchResult.params,
      });
    }

    return false;
  }
}

export const Get = Action.bind(null, ['GET']);
export const Post = Action.bind(null, ['POST']);
export const Put = Action.bind(null, ['PUT']);
export const Patch = Action.bind(null, ['PATCH']);
export const Delete = Action.bind(null, ['DELETE']);
export const Options = Action.bind(null, ['OPTIONS']);
export function Action(methods: string[], path: string) {
  return function (
    target: Controller,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<RequestHandleFunc>,
  ) {
    const klass = target.constructor as typeof Controller;
    const handler = descriptor.value;

    if (!handler) return descriptor;

    klass.actions.push({ methods, path, handler });

    return descriptor;
  };
}

export class WebApp extends RequestHandler {
  middlewares: Array<typeof Middleware> = [];
  controllers: Array<Controller> = [];

  protected _handler?: RequestHandler;

  get handler() {
    return (this._handler ||= Middleware.compose(
      [
        ...this.middlewares,
        ...this.controllers.map((controller) =>
          Controller.buildMiddleware(controller),
        ),
      ],
      this.fallback.bind(this),
    ));
  }

  handle(req: RequestType): Promise<ResponseType> {
    return this.handler.handle(req);
  }

  async fallback(_req: RequestType): Promise<ResponseType> {
    return Promise.resolve({ status: 501 });
  }
}
