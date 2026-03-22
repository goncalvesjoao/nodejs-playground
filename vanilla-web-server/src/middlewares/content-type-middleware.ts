import {
  type ServerModRequestType,
  type ServerModResponseType,
  ServerMod,
} from '@/server-mod';

export class ContentTypeMiddleware extends ServerMod {
  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    const response = await this.next(req);

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
