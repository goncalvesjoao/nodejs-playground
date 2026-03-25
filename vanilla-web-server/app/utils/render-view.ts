import ejs from 'ejs';
import path from 'path';
import { env } from '@config/env';
import * as utils from '@lib/utils';

const viteAssetTags = utils.viteAssetTags({
  productionMode: env.mode === 'PROD',
  devServerOrigin: env.viteDevServerOrigin,
  entryPath: env.viteEntry,
  manifestPath: env.viteManifestFilePath,
});

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
    viteAssetTags,
  };

  const content = await ejs.renderFile(filePath, viewData, options);

  return content;
}
