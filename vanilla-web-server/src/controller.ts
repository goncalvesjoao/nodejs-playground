import path from 'path';
import { ChainLinkServerMod, ServerMod } from '@/server-mod';
import { renderView } from '@/utils';

export class ChainLinkController extends ChainLinkServerMod {
  static basePath = '';

  readonly basePath: string;

  constructor(
    protected next: ServerMod,
    pathPrefix: string = '',
  ) {
    super(next);

    this.basePath = `${pathPrefix}${(this.constructor as typeof ChainLinkController).basePath}`;

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
