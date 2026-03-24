import path from 'path';
import { ChainLinkServerMod, ServerMod } from '@/server-mod';
import { renderView } from '@/utils';

export class Controller extends ChainLinkServerMod {
  static path = '';

  readonly path: string;

  constructor(
    protected next: ServerMod,
    pathPrefix: string = '',
  ) {
    super(next);

    this.path = `${pathPrefix}${(this.constructor as typeof Controller).path}`;

    const originalRun = this.run.bind(this);

    this.run = async (req) => {
      if (!req.path.startsWith(this.path)) {
        return this.next.run(req);
      }

      return originalRun(req);
    };
  }

  renderView(filePath: string, data: Record<string, any> = {}) {
    return renderView(path.join(this.path, filePath), data);
  }
}
