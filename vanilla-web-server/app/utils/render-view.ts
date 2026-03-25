import ejs from 'ejs';
import path from 'path';
import { renderViteAssetTags } from '@app/utils/vite-assets';
import { env } from '@app/config';

export async function renderView(
  viewPath: string,
  data: Record<string, any> = {},
) {
  const filePath = path.join(env.viewsDirPath, viewPath);
  const options = {
    views: [env.viewsDirPath],
  };
  const viewData = {
    ...data,
    viteAssetTags: await renderViteAssetTags(),
  };

  const content = await ejs.renderFile(filePath, viewData, options);

  return content;
}
