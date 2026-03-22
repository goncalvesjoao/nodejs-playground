import type {
  ServerModRequestType,
  ServerModInterface,
  ServerModResponseType,
} from '@/types';

const BASE_PATH = '';

export class RootApiController implements ServerModInterface {
  get basePath() {
    return `${this.basePathPrefix}${BASE_PATH}`;
  }

  constructor(protected basePathPrefix: string = '') {}

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (
      req.method === 'GET' &&
      (req.pathname === this.basePath || req.pathname === `${this.basePath}/`)
    ) {
      return Promise.resolve({
        status: 200,
        body: { message: 'Welcome to the API!' },
      });
    }

    return Promise.resolve({
      status: 501,
      body: { message: 'Not Implemented' },
    });
  }
}
