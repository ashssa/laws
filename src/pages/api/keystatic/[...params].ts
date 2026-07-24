import { makeHandler } from '@keystatic/astro/api';
import keystaticConfig from '../../../../keystatic.config';

const keystaticHandler = makeHandler({
  config: keystaticConfig,
});

export const ALL = async (context: any) => {
  const { request } = context;
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");

  if (forwardedHost && forwardedProto) {
    const url = new URL(request.url);
    url.hostname = forwardedHost;
    url.protocol = forwardedProto;
    url.port = "";

    const init: RequestInit = {
      method: request.method,
      headers: request.headers,
    };
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      init.body = request.body;
      // @ts-ignore
      init.duplex = 'half';
    }

    const newRequest = new Request(url.toString(), init);
    return keystaticHandler({ ...context, request: newRequest });
  }

  return keystaticHandler(context);
};
