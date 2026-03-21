import type {
  ServerModRequestType,
  ServerModInterface,
  ServerModResponseType,
} from '@/types';

export class ContentMiddleware implements ServerModInterface {
  constructor(protected nextServerMod: ServerModInterface) {}

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    const response = await this.nextServerMod.run(req);

    const headers = { ...response.headers };

    headers['Content-Type'] ||= contentTypeFromBody(response.body);

    const body = response.body ? bodyToString(response.body) : null;

    return { ...response, headers, body };
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

function bodyToString(body: unknown): string {
  if (Buffer.isBuffer(body)) {
    return body.toString();
  }

  if (typeof body === 'object' && body !== null) {
    return JSON.stringify(body);
  }

  return String(body);
}
