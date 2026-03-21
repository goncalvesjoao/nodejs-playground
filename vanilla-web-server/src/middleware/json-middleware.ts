import type {
  ServerAppRequestType,
  ServerAppInterface,
  ServerAppResponseType,
} from '@/types';

export class JsonMiddleware implements ServerAppInterface {
  constructor(protected nextServerApp: ServerAppInterface) {}

  async run(req: ServerAppRequestType): Promise<ServerAppResponseType> {
    //     const bodyPromise = new Promise<string>((resolve, reject) => {
    //   let bodyText = '';

    //   req.on('data', (chunk: Buffer) => {
    //     bodyText += chunk.toString();
    //   });

    //   req.on('end', () => resolve(bodyText));
    //   req.on('error', reject);
    // });

    const response = await this.nextServerApp.run({
      ...req,
      // body(): Promise<string> {
      //   return bodyPromise;
      // },
    });

    const headers = { ...response.headers };
    headers['Content-Type'] ||= 'application/json';

    const body = JSON.stringify(response.body);

    return { ...response, headers, body };
  }
}
