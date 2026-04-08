import { RequestType, RequestHandler } from '@lib/framework/request-handler';
import { match } from 'path-to-regexp';

export type ControllerActionMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'OPTIONS';

type ControllerAction = (
  req: RequestType,
) => undefined | RequestHandler['handle'];

export class Controller {
  static basePath: string = '';

  readonly basePath = (this.constructor as typeof Controller).basePath;

  handler(req: RequestType): undefined | RequestHandler['handle'] {
    for (const action of getActions(this)) {
      const handler = action(req);

      if (handler) return handler.bind(this);
    }

    return undefined;
  }
}

export function Get(path: string) {
  return Action(path, 'GET');
}

export function Post(path: string) {
  return Action(path, 'POST');
}

export function Put(path: string) {
  return Action(path, 'PUT');
}

export function Patch(path: string) {
  return Action(path, 'PATCH');
}

export function Delete(path: string) {
  return Action(path, 'DELETE');
}

export function Options(path: string) {
  return Action(path, 'OPTIONS');
}

export function Action(path: string, method: ControllerActionMethod) {
  return function (
    target: object,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<RequestHandler['handle']>,
  ) {
    if (typeof descriptor.value !== 'function') {
      throw new Error('Action decorator can only be used on methods');
    }

    if (!(target instanceof Controller)) {
      throw new Error(
        'Action decorator can only be used on Controller subclasses',
      );
    }

    const basePath = (target.constructor as typeof Controller).basePath;

    getActions(target).push(function (
      req: RequestType,
    ): undefined | RequestHandler['handle'] {
      if (req.method !== method) return undefined;
      if (!match(`${basePath}${path}`)(req.path)) return undefined;

      return descriptor.value;
    });
  };
}

function getActions(target: any): ControllerAction[] {
  const controllerTarget = target as { _actions: ControllerAction[] };

  return (controllerTarget._actions ||= []);
}
