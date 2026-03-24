import path from 'path';
import { ChainLinkServerMod, ServerMod } from '@/server-mod';
import { renderView } from '@/utils';

export class Controller extends ChainLinkServerMod {
  static path = '';

  readonly path: string;

  constructor(
    protected nextServerMod: ServerMod,
    pathPrefix: string = '',
  ) {
    super(nextServerMod);

    this.path = `${pathPrefix}${(this.constructor as typeof Controller).path}`;
  }

  renderView(filePath: string, data: Record<string, any> = {}) {
    return renderView(path.join(this.path, filePath), data);
  }
}
