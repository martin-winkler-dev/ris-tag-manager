import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { build } from "esbuild";

const rootDir = process.cwd();
const srcDir = resolve(rootDir, "src");
const buildDir = resolve(rootDir, "build");
const htmlPath = resolve(srcDir, "index.html");
const jsEntryPath = resolve(srcDir, "index.js");
const outputPath = resolve(buildDir, "index.html");
const packageJsonPath = resolve(rootDir, "package.json");

await mkdir(buildDir, { recursive: true });

const [htmlTemplate, packageJsonText] = await Promise.all([
    readFile(htmlPath, "utf8"),
    readFile(packageJsonPath, "utf8"),
]);

const packageJson = JSON.parse(packageJsonText);
const version = typeof packageJson.version === "string" ? packageJson.version : "v0.0.0";
const projectName = typeof packageJson.name === "string" ? packageJson.name : "project";
const appName = typeof packageJson.title === "string" ? packageJson.title : "RIS File";
const description = typeof packageJson.description === "string" ? packageJson.description : "";
const author = typeof packageJson.author === "string" ? packageJson.author : "";
const homepage = typeof packageJson.homepage === "string" ? packageJson.homepage : "";
const repositoryUrl = typeof packageJson.repository?.url === "string" ? packageJson.repository.url : "";
const buildDate = new Date().toISOString();

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
    loader: {
        ".css": "text",
    },
    define: {
        __APP_PROJECT_NAME__: JSON.stringify(projectName),
        __APP_NAME__: JSON.stringify(appName),
        __APP_DESCRIPTION__: JSON.stringify(description),
        __APP_AUTHOR__: JSON.stringify(author),
        __APP_HOMEPAGE__: JSON.stringify(homepage),
        __APP_REPOSITORY_URL__: JSON.stringify(repositoryUrl),
        __APP_VERSION__: JSON.stringify(version),
        __BUILD_DATE__: JSON.stringify(buildDate),
    },
});

const jsBundle = jsResult.outputFiles[0]?.text;

if (typeof jsBundle !== "string" || !jsBundle.trim()) {
    throw new Error("JavaScript bundle is empty.");
}

const inlineHtml = htmlTemplate
    .replace(/<link\s+rel="stylesheet"\s+href="\.\/index\.css"\s*>/i, "")
    .replace(/<script\s+type="module"\s+src="\.\/index\.js"\s*>\s*<\/script>/i, `<script>${jsBundle}</script>`)
    .replace(
        "<body>",
        `<body>\n<!-- ${escapeHtml(`Built from ${packageJson.name ?? "project"} ${version} on ${buildDate}`)} -->`
    );

if (inlineHtml === htmlTemplate) {
    throw new Error("Could not inline CSS/JS into the HTML template.");
}

await writeFile(outputPath, inlineHtml, "utf8");

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}