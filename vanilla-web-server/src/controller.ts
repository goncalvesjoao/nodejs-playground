import path from 'path';
import { renderView } from '@/utils';
import {
  ServerModInterface,
  ServerModRequestType,
  ServerModResponseType,
} from '@/types';

export abstract class Controller implements ServerModInterface {
  static basePath = '';

  basePath = (this.constructor as typeof Controller).basePath;

  constructor(protected next: ServerModInterface) {
    const originalRun = this.run.bind(this);

    this.run = async (req) => {
      if (!req.path.startsWith(this.basePath)) {
        return this.next.run(req);
      }

      return originalRun(req);
    };
  }

  abstract run(req: ServerModRequestType): Promise<ServerModResponseType>;

  renderView(filePath: string, data: Record<string, any> = {}) {
    return renderView(path.join(this.basePath, filePath), data);
  }
}
