import path from 'node:path';
import { Environment } from '@lib/config';
import {
  DEFAULT_SERVER_PORT,
  DEFAULT_VITE_DEV_SERVER_ORIGIN,
  PUBLIC_DIR_NAME,
  SRC_DIR_NAME,
  VIEWS_DIR_NAME,
  VITE_ENTRY,
  VITE_MANIFEST_FILE_NAME,
} from '@config/constants';

class Env extends Environment {
  publicDirPath: string;
  viewsDirPath: string;
  viteEntry: string = VITE_ENTRY;
  viteManifestFilePath: string;

  constructor() {
    super();

    this.publicDirPath = path.join(this.rootDirPath, PUBLIC_DIR_NAME);
    this.viewsDirPath = path.join(
      this.rootDirPath,
      SRC_DIR_NAME,
      VIEWS_DIR_NAME,
    );
    this.viteManifestFilePath = path.join(
      this.publicDirPath,
      VITE_MANIFEST_FILE_NAME,
    );
  }

  get serverPort(): number {
    return Number(this.get('SERVER_PORT', DEFAULT_SERVER_PORT));
  }

  get viteDevServerOrigin(): string {
    return this.get('VITE_DEV_SERVER_ORIGIN', DEFAULT_VITE_DEV_SERVER_ORIGIN);
  }
}

export const env = new Env();
