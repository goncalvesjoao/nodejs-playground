import type {
  ServerModRequestType,
  ServerModInterface,
  ServerModResponseType,
  ServerModType,
} from '@/types';

export class ContentTypeMiddleware implements ServerModInterface {
  constructor(protected nextServerMod: ServerModType) {}

  run = async (req: ServerModRequestType): Promise<ServerModResponseType> => {
    const response = await this.nextServerMod(req);

    const headers = { ...response.headers };

    headers['Content-Type'] ||= contentTypeFromBody(response.body);

    return { ...response, headers };
  };
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
