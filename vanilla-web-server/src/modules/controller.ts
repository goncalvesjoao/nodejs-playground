import path from 'path';
import { renderView } from '@/utils';
import {
  ChainLinkRequestHandler,
  RequestHandler,
} from '@/modules/request-handler';

export class Controller extends ChainLinkRequestHandler {
  static basePath = '';

  basePath = (this.constructor as typeof Controller).basePath;

  constructor(protected next: RequestHandler) {
    super(next);

    const originalHandle = this.handle.bind(this);

    this.handle = async (req) => {
      if (!req.path.startsWith(this.basePath)) {
        return this.next.handle(req);
      }

      return originalHandle(req);
    };
  }

  renderView(filePath: string, data: Record<string, any> = {}) {
    return renderView(path.join(this.basePath, filePath), data);
  }
}
