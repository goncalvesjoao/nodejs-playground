import path from 'path';
import { ServerMod, ServerModInterface } from '@/server-mod';
import { renderView } from '@/utils';

export class Controller extends ServerMod {
  static path = '';

  readonly path: string;

  constructor(
    protected nextServerMod: ServerModInterface,
    pathPrefix: string = '',
  ) {
    super(nextServerMod);

    this.path = `${pathPrefix}${(this.constructor as typeof Controller).path}`;
  }

  renderView(filePath: string, data: Record<string, any> = {}) {
    return renderView(path.join(this.path, filePath), data);
  }
}
