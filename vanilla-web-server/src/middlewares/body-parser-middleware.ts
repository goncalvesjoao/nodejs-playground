import type {
  ServerModRequestType,
  ServerModInterface,
  ServerModResponseType,
  ServerModType,
} from '@/types';

export class BodyParserMiddleware implements ServerModInterface {
  constructor(protected nextServerMod: ServerModType) {}

  run = async (req: ServerModRequestType): Promise<ServerModResponseType> => {
    const response = await this.nextServerMod(req);

    const body = response.body ? parseBody(response.body) : null;

    return { ...response, body };
  };
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
