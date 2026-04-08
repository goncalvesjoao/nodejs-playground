import {
  RequestType,
  ResponseType,
  RequestHandleFunc,
} from '@lib/framework/request-handler';
import { match } from 'path-to-regexp';

type ControllerHandler = (req: RequestType) => false | RequestHandleFunc;

export class Controller {
  static basePath: string = '';

  readonly basePath = (this.constructor as typeof Controller).basePath;

  handlers: ControllerHandler[] = getControllerHandlers(this);

  async handle(req: RequestType): Promise<false | ResponseType> {
    for (const controllerHandler of this.handlers) {
      const requestHandleFunc = controllerHandler(req);

      if (requestHandleFunc) {
        return requestHandleFunc.call(this, req);
      }
    }

    return false;
  }
}

export function Get(path: string) {
  return Handle(path, ['GET']);
}

export function Post(path: string) {
  return Handle(path, ['POST']);
}

export function Put(path: string) {
  return Handle(path, ['PUT']);
}

export function Patch(path: string) {
  return Handle(path, ['PATCH']);
}

export function Delete(path: string) {
  return Handle(path, ['DELETE']);
}

export function Options(path: string) {
  return Handle(path, ['OPTIONS']);
}

export function Handle(path: string, methods: string[] = []) {
  return function (
    target: Controller,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<RequestHandleFunc>,
  ) {
    const basePath = (target.constructor as typeof Controller).basePath;

    getControllerHandlers(target).push(function (
      req: RequestType,
    ): false | RequestHandleFunc {
      if (!methods.includes(req.method)) return false;

      if (!match(`${basePath}${path}`)(req.path)) return false;

      return descriptor.value || false;
    });
  };
}

function getControllerHandlers(controller: Controller): ControllerHandler[] {
  return (controller.handlers ||= []);
}
