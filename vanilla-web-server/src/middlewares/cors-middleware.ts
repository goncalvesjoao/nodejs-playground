import { ChainLinkRequestHandler, RequestType, ResponseType } from '@/modules';

export class CorsMiddleware extends ChainLinkRequestHandler {
  async handle(req: RequestType): Promise<ResponseType> {
    if (req.method !== 'OPTIONS') {
      return await this.next.handle(req);
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
