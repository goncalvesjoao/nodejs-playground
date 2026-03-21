import {
  ServerAppEnvType,
  ServerAppInterface,
  ServerAppOutputType,
} from '@/types';

export class ServerApp implements ServerAppInterface {
  constructor(protected nextMod: ServerAppInterface) {}

  run(_env: ServerAppEnvType): Promise<ServerAppOutputType> {
    throw new Error('Method not implemented.');
  }
}
