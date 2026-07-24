import { defineMiddleware } from "astro:middleware";

// 確保 Vercel 環境變數在伺服器端一定能被 Keystatic 讀取到
if (!process.env.KEYSTATIC_SECRET && import.meta.env.KEYSTATIC_SECRET) {
  process.env.KEYSTATIC_SECRET = import.meta.env.KEYSTATIC_SECRET;
}
if (!process.env.KEYSTATIC_GITHUB_CLIENT_ID && import.meta.env.KEYSTATIC_GITHUB_CLIENT_ID) {
  process.env.KEYSTATIC_GITHUB_CLIENT_ID = import.meta.env.KEYSTATIC_GITHUB_CLIENT_ID;
}
if (!process.env.KEYSTATIC_GITHUB_CLIENT_SECRET && import.meta.env.KEYSTATIC_GITHUB_CLIENT_SECRET) {
  process.env.KEYSTATIC_GITHUB_CLIENT_SECRET = import.meta.env.KEYSTATIC_GITHUB_CLIENT_SECRET;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const forwardedHost = context.request.headers.get("x-forwarded-host");
  const forwardedProto = context.request.headers.get("x-forwarded-proto");

  if (forwardedHost && forwardedProto) {
    if (context.request.method === "GET" || context.request.method === "HEAD") {
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

      context.request = new Request(url.toString(), init);
    }
  }

  return next();
});
