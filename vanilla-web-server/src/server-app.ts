import fs from 'fs/promises';
import path from 'path';
import { Api, Assets, Cors, Ascii, Root } from '@/server-apps';
import { rootDirPath } from '@/utils';
import { RESOURCES_DIR_NAME } from '@/constants';
import { ServerAppInterface } from '@/types';

export const serverApp: ServerAppInterface = new Cors(
  new Api(
    new Ascii(
      new Assets(
        new Root({
          async run() {
            return {
              statusCode: 404,
              headers: { 'Content-Type': 'text/plain' },
              body: await fs.readFile(
                path.join(rootDirPath, RESOURCES_DIR_NAME, 'not_found.html'),
              ),
            };
          },
        }),
      ),
    ),
  ),
);
