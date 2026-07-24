import { makeHandler } from '@keystatic/astro/api';
import keystaticConfig from '../../../../keystatic.config';

// 手動將 Vercel 的執行期環境變數 (process.env) 強制注入給 Keystatic，
// 以繞過 Astro 5 在編譯期遺失環境變數的 Bug。
console.log("=== KEYSTATIC API INIT ===");
console.log("hasSecret:", !!process.env.KEYSTATIC_SECRET);
console.log("hasClientId:", !!process.env.KEYSTATIC_GITHUB_CLIENT_ID);
console.log("hasClientSecret:", !!process.env.KEYSTATIC_GITHUB_CLIENT_SECRET);
console.log("secret length:", process.env.KEYSTATIC_SECRET?.length);
console.log("==========================");

if (!process.env.KEYSTATIC_SECRET) {
  throw new Error("CRITICAL ERROR: process.env.KEYSTATIC_SECRET is MISSING in Vercel Environment Variables! Please go to Vercel -> Settings -> Environment Variables and ensure KEYSTATIC_SECRET is set for the Production environment.");
}

export const ALL = makeHandler({
  config: keystaticConfig,
  secret: process.env.KEYSTATIC_SECRET,
  clientId: process.env.KEYSTATIC_GITHUB_CLIENT_ID,
  clientSecret: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
});
