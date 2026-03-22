import type {
  ServerModRequestType,
  ServerModInterface,
  ServerModResponseType,
} from '@/server-mod';

export class CorsMiddleware implements ServerModInterface {
  constructor(protected nextServerMod: ServerModInterface) {}

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (req.method !== 'OPTIONS') {
      return await this.nextServerMod.run(req);
    }

    return {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: null,
    };
  }
}
