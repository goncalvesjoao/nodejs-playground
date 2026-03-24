import path from 'path';
import { renderView } from '@/utils';
import { ChainLinkServerMod, ServerMod } from '@/server-mod';

export class Controller extends ChainLinkServerMod {
  static basePath = '';

  basePath = (this.constructor as typeof Controller).basePath;

  constructor(protected next: ServerMod) {
    super(next);

    const originalRun = this.run.bind(this);

    this.run = async (req) => {
      if (!req.path.startsWith(this.basePath)) {
        return this.next.run(req);
      }

      return originalRun(req);
    };
  }

  renderView(filePath: string, data: Record<string, any> = {}) {
    return renderView(path.join(this.basePath, filePath), data);
  }
}
