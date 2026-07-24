import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const forwardedHost = context.request.headers.get("x-forwarded-host");
  const forwardedProto = context.request.headers.get("x-forwarded-proto");

  if (forwardedHost && forwardedProto) {
    const url = new URL(context.request.url);
    url.hostname = forwardedHost;
    url.protocol = forwardedProto;
    url.port = "";

    const newHeaders = new Headers(context.request.headers);
    newHeaders.set("host", forwardedHost);

    const init: RequestInit = {
      method: context.request.method,
      headers: newHeaders,
    };

    if (context.request.method !== "GET" && context.request.method !== "HEAD") {
      init.body = context.request.body;
      // @ts-ignore
      init.duplex = "half";
    }

    context.request = new Request(url.toString(), init);
  }

  return next();
});
