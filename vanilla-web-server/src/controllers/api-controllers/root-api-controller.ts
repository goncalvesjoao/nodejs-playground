import type {
  ServerModRequestType,
  ServerModInterface,
  ServerModResponseType,
} from '@/types';

const BASE_PATH = '';

export class RootApiController implements ServerModInterface {
  constructor(
    protected nextServerMod: ServerModInterface,
    protected basePathPrefix: string = '',
  ) {}

  get basePath() {
    return `${this.basePathPrefix}${BASE_PATH}`;
  }

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    if (
      req.method === 'GET' &&
      (req.path === this.basePath || req.path === `${this.basePath}/`)
    ) {
      return Promise.resolve({
        status: 200,
        body: { message: 'Welcome to the API!' },
      });
    }

    return this.nextServerMod.run(req);
  }
}
