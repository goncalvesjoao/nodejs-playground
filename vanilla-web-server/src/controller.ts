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
  }

  renderView(filePath: string, data: Record<string, any> = {}) {
    return renderView(path.join(this.path, filePath), data);
  }
}
