import { Middleware, RequestType, ResponseType } from '@lib/web-framework';

export class ContentTypeMiddleware extends Middleware {
  async handle(req: RequestType): Promise<ResponseType> {
    const response = await this.nextHandler.handle(req);

    const headers = { ...response.headers };

    headers['Content-Type'] ||= contentTypeFromBody(response.body);

    return { ...response, headers };
  }
}

function contentTypeFromBody(body: unknown): string {
  if (Buffer.isBuffer(body)) {
    return 'application/octet-stream';
  }

  if (typeof body === 'object' && body !== null) {
    return 'application/json';
  }

  return 'text/html';
}
