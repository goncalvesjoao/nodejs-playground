import path from 'path';
import { renderView } from '@/utils';
import { Controller } from '@/modules';

export type { RequestType, ResponseType } from '@/modules';

export class BaseController extends Controller {
  renderView(filePath: string, data: Record<string, any> = {}) {
    return renderView(path.join(this.basePath, filePath), data);
  }
}
