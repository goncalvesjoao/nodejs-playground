import ejs from 'ejs';
import path from 'path';
import { VIEWS_DIR_NAME } from '@/constants';
import { rootDirPath } from '@/utils/root-dir-path';

export async function renderView(
  viewPath: string,
  data: Record<string, any> = {},
) {
  const viewAbsolutePath = path.join(
    rootDirPath,
    VIEWS_DIR_NAME,
    viewPath.endsWith('.ejs') ? viewPath : `${viewPath}.ejs`,
  );

  const content = await ejs.renderFile(viewAbsolutePath, data);

  return content;
}
