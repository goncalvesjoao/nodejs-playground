import {
  type ServerModRequestType,
  type ServerModResponseType,
  ChainLinkServerMod,
} from '@/server-mod';

export class CorsMiddleware extends ChainLinkServerMod {
  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (req.method !== 'OPTIONS') {
      return await this.next.run(req);
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
