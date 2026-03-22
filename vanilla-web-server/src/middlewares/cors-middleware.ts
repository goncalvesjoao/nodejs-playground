import type {
  ServerModRequestType,
  ServerModInterface,
  ServerModResponseType,
  ServerModFuncType,
} from '@/types';

export class CorsMiddleware implements ServerModInterface {
  constructor(protected nextServerMod: ServerModFuncType) {}

  run = async (req: ServerModRequestType): Promise<ServerModResponseType> => {
    if (req.method !== 'OPTIONS') {
      return await this.nextServerMod(req);
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
  };
}
