import { Middleware, RequestType, ResponseType } from '@lib/web-framework';

export class CorsMiddleware extends Middleware {
  async handle(req: RequestType): Promise<ResponseType> {
    if (req.method !== 'OPTIONS') {
      return await this.nextHandler.handle(req);
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
