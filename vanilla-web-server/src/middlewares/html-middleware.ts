import type {
  ServerModRequestType,
  ServerModInterface,
  ServerModResponseType,
} from '@/types';

export class HtmlMiddleware implements ServerModInterface {
  constructor(protected nextServerMod: ServerModInterface) {}

  async run(req: ServerModRequestType): Promise<ServerModResponseType> {
    //     const bodyPromise = new Promise<string>((resolve, reject) => {
    //   let bodyText = '';

    //   req.on('data', (chunk: Buffer) => {
    //     bodyText += chunk.toString();
    //   });

    //   req.on('end', () => resolve(bodyText));
    //   req.on('error', reject);
    // });

    const response = await this.nextServerMod.run({
      ...req,
      // body(): Promise<string> {
      //   return bodyPromise;
      // },
    });

    const headers = { ...response.headers };
    headers['Content-Type'] ||= 'text/html';

    const body = response.body ? String(response.body) : '';

    return { ...response, headers, body };
  }
}
