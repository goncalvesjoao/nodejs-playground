import { RequestType } from '@lib/web-framework';

export function RequestBuilder(input: Partial<RequestType>): RequestType {
  return {
    body: () => Promise.resolve(Buffer.from('')),
    headers: {},
    method: 'GET',
    path: '',
    pathParams: {},
    queryParams: {},
    ...input,
  };
}
