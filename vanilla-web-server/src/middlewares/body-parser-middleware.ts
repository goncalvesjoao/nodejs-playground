import {
  type ServerModRequestType,
  type ServerModResponseType,
  ServerMod,
} from '@/server-mod';

export class BodyParserMiddleware extends ServerMod {
  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    const response = await this.next(req);

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
