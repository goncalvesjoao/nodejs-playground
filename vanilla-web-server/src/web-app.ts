import type { WebAppEnvType, WebAppOutputType } from '@/types';

export abstract class WebApp {
  abstract run(env: WebAppEnvType): Promise<WebAppOutputType>;
}
