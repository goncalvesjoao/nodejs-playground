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

  run = async (req: ServerModRequestType): Promise<ServerModResponseType> => {
    if (
      req.method === 'GET' &&
      (req.pathname === this.basePath || req.pathname === `${this.basePath}/`)
    ) {
      return Promise.resolve({
        status: 200,
        body: { message: 'Welcome to the API!' },
      });
    }

    return this.nextServerMod.run(req);
  };
}
