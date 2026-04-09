import path from 'node:path';
import { renderView } from '@app/utils';
import { Controller } from '@lib/web-framework';

export { Get, type RequestType, type ResponseType } from '@lib/web-framework';

export class BaseController extends Controller {
  renderView(filePath: string, data: Record<string, any> = {}) {
    return renderView(path.join(this.path, filePath), data);
  }
}
