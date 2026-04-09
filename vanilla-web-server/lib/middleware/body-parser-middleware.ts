import { Middleware, RequestType, ResponseType } from '@lib/web-framework';

export class BodyParserMiddleware extends Middleware {
  async handle(req: RequestType): Promise<ResponseType> {
    const response = await this.nextHandler.handle(req);

    const body = response.body ? parseBody(response.body) : null;

    return { ...response, body };
  }
}

function parseBody(body: unknown): string | Buffer {
  if (Buffer.isBuffer(body)) {
    return body;
  }

  if (typeof body === 'object' && body !== null) {
    return JSON.stringify(body);
  }

  return String(body);
}
