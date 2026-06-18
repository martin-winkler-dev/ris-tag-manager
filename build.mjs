import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { build } from "esbuild";

const rootDir = process.cwd();
const srcDir = resolve(rootDir, "src");
const buildDir = resolve(rootDir, "build");
const htmlPath = resolve(srcDir, "index.html");
const cssPath = resolve(srcDir, "index.css");
const jsEntryPath = resolve(srcDir, "index.js");
const outputPath = resolve(buildDir, "index.html");

await mkdir(buildDir, { recursive: true });

const [htmlTemplate, cssContent] = await Promise.all([
  readFile(htmlPath, "utf8"),
  readFile(cssPath, "utf8"),
]);

const jsResult = await build({
  entryPoints: [jsEntryPath],
  bundle: true,
  format: "iife",
  platform: "browser",
  target: ["es2018"],
  write: false,
  minify: true,
  treeShaking: true,
  legalComments: "none",
});

const jsBundle = jsResult.outputFiles[0]?.text;

if (typeof jsBundle !== "string" || !jsBundle.trim()) {
  throw new Error("JavaScript bundle is empty.");
}

const inlineHtml = htmlTemplate
  .replace(/<link\s+rel="stylesheet"\s+href="\.\/index\.css"\s*>/i, `<style>${minifyCss(cssContent)}</style>`)
  .replace(/<script\s+type="module"\s+src="\.\/index\.js"\s*>\s*<\/script>/i, `<script>${jsBundle}</script>`);

if (inlineHtml === htmlTemplate) {
  throw new Error("Could not inline CSS/JS into the HTML template.");
}

await writeFile(outputPath, inlineHtml, "utf8");

function minifyCss(cssText) {
  return cssText
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>+~])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}