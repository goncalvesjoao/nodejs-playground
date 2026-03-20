import { rootDirPath } from '@/utils/root-dir-path';

export function resourcesDirPath(...paths: string[]): string {
  return rootDirPath('resources', ...paths);
}
