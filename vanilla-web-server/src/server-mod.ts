import {
  ServerModEnvType,
  ServerModInterface,
  ServerModOutputType,
} from '@/types';

export class ServerMod implements ServerModInterface {
  constructor(protected nextMod: ServerModInterface) {}

  run(_env: ServerModEnvType): Promise<ServerModOutputType> {
    throw new Error('Method not implemented.');
  }
}
