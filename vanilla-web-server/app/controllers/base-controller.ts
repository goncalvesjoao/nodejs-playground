import path from 'path';
import { renderView } from '@app/utils';
import { Controller } from '@lib/framework';

export type { RequestType, ResponseType } from '@lib/framework';

export class BaseController extends Controller {
  renderView(filePath: string, data: Record<string, any> = {}) {
    return renderView(path.join(this.basePath, filePath), data);
  }
}
