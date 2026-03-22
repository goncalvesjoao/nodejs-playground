import path from 'path';
import { ServerMod, ServerModInterface } from '@/server-mod';
import { renderView } from '@/utils';

export class Controller extends ServerMod {
  static basePath = '';

  constructor(
    protected nextServerMod: ServerModInterface,
    protected basePathPrefix: string = '',
  ) {
    super(nextServerMod);
  }

  get basePath() {
    return `${this.basePathPrefix}${(this.constructor as typeof Controller).basePath}`;
  }

  renderView(filePath: string, data: Record<string, any> = {}) {
    return renderView(path.join(this.basePath, filePath), data);
  }
}
