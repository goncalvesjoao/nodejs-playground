import {
  type ServerModRequestType,
  type ServerModResponseType,
  ServerMod,
} from '@/server-mod';

export class CorsMiddleware extends ServerMod {
  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (req.method !== 'OPTIONS') {
      return await this.next(req);
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
