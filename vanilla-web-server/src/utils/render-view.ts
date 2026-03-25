import ejs from 'ejs';
import path from 'path';
import { VIEWS_DIR_NAME } from '@/constants';
import { rootDirPath } from '@/utils/root-dir-path';
import { renderViteAssetTags } from '@/utils/vite-assets';

export async function renderView(
  viewPath: string,
  data: Record<string, any> = {},
) {
  const viewAbsolutePath = path.join(rootDirPath, VIEWS_DIR_NAME, viewPath);
  const options = {
    views: [path.join(rootDirPath, VIEWS_DIR_NAME)],
  };
  const viewData = {
    ...data,
    viteAssetTags: await renderViteAssetTags(),
  };

  const content = await ejs.renderFile(viewAbsolutePath, viewData, options);

  return content;
}
