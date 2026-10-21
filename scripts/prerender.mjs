import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "vite";
import react from "@vitejs/plugin-react";

// Compile once at build time; no application server is required at runtime.
await build({
  configFile: false,
  envDir: false,
  plugins: [react()],
  build: {
    ssr: "src/prerender.tsx",
    outDir: "node_modules/.vite-prerender",
    emptyOutDir: true,
    copyPublicDir: false,
    rollupOptions: { output: { entryFileNames: "home.mjs" } },
  },
});
const { renderPage, pageTitles } = await import(
  pathToFileURL(resolve("node_modules/.vite-prerender/home.mjs")).href
);
let html = await readFile("dist/index.html", "utf8");
// Static content can paint while the eager interactive bundle downloads.
// Prioritize local text fonts and the LCP artwork over hydration bytes.
html = html.replace(
  '<script type="module"',
  '<script type="module" fetchpriority="low"',
);
// This static preview avoids a blocking CSS round trip. Built font URLs are root-relative.
const stylesheets = [
  ...html.matchAll(
    /<link[^>]*rel="stylesheet"[^>]*href="(\/assets\/[A-Za-z0-9_-]+\.css)"[^>]*>/g,
  ),
];
for (const stylesheet of stylesheets) {
  const css = await readFile("dist" + stylesheet[1], "utf8");
  html = html.replace(
    stylesheet[0],
    () =>
      "<style data-build-styles>" +
      css.replaceAll("</style", "<\\/style") +
      "</style>",
  );
}
await mkdir("dist/contact", { recursive: true });
const contactStylesFile = (await readdir("dist/assets")).find((n) =>
  /^contactStyles-.*\.css$/.test(n),
);
const contactStyles = await readFile(
  "dist/assets/" + contactStylesFile,
  "utf8",
);
const outlet = '<div id="root"></div>';
if (!html.includes(outlet)) throw new Error("Missing homepage HTML outlet");
await mkdir("dist/find-support", { recursive: true });
const supportStylesFile = (await readdir("dist/assets")).find((name) =>
  /^supportStyles-.*\.css$/.test(name),
);
const supportStyles = await readFile(
  "dist/assets/" + supportStylesFile,
  "utf8",
);
await mkdir("dist/about", { recursive: true });
await mkdir("dist/awareness", { recursive: true });
await mkdir("dist/resources", { recursive: true });
const resourcesStylesFile = (await readdir("dist/assets")).find((name) =>
  /^resourcesStyles-.*\.css$/.test(name),
);
if (!resourcesStylesFile) throw new Error("Missing Resources stylesheet");
const resourcesStyles = await readFile(
  "dist/assets/" + resourcesStylesFile,
  "utf8",
);
const aboutStylesFile = (await readdir("dist/assets")).find((name) =>
  /^aboutStyles-.*\.css$/.test(name),
);
if (!aboutStylesFile) throw new Error("Missing About stylesheet");
const aboutStyles = await readFile("dist/assets/" + aboutStylesFile, "utf8");
const awarenessStylesFile = (await readdir("dist/assets")).find((name) =>
  /^awarenessStyles-.*\.css$/.test(name),
);
if (!awarenessStylesFile) throw new Error("Missing Awareness stylesheet");
const awarenessStyles = await readFile(
  "dist/assets/" + awarenessStylesFile,
  "utf8",
);
const awarenessDisplayFont = (await readdir("dist/assets")).find((name) =>
  /^playfair-display-latin-600-normal-.*\.woff2$/.test(name),
);
if (!awarenessDisplayFont) throw new Error("Missing Awareness display font");
const awarenessUiFonts = (await readdir("dist/assets")).filter((name) =>
  /^dm-sans-latin-(500|600)-normal-.*\.woff2$/.test(name),
);
for (const [path, file, title] of [
  ["/contact", "dist/contact/index.html", pageTitles.contact],
  ["/find-support", "dist/find-support/index.html", pageTitles.support],
  ["/", "dist/index.html", pageTitles.home],
  ["/about", "dist/about/index.html", pageTitles.about],
  ["/awareness", "dist/awareness/index.html", pageTitles.awareness],
  ["/resources", "dist/resources/index.html", pageTitles.resources],
]) {
  let page = html.replace(
    /<title>.*?<\/title>/,
    `<title>${title.replaceAll("&", "&amp;").replaceAll("<", "&lt;")}</title>`,
  );
  if (path === "/contact") {
    page = page.replace(/<link\s[^>]*as="image"[^>]*>/g, "");
    page = page.replace(
      "</head>",
      () =>
        "<style data-contact-styles>" +
        contactStyles +
        `</style><link rel="preload" as="image" href="/assets/contact-hero.webp" fetchpriority="high"><link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/${awarenessDisplayFont}"></head>`,
    );
  }
  if (path === "/find-support") {
    page = page.replace(/<link\s[^>]*as="image"[^>]*>/g, "");
    page = page.replace(
      "</head>",
      () =>
        "<style data-support-styles>" +
        supportStyles +
        `</style>${[awarenessDisplayFont, ...awarenessUiFonts].map((font) => `<link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/${font}">`).join("")}<link rel="preload" as="image" href="/assets/learn-intro.webp" fetchpriority="high"></head>`,
    );
  }
  if (path === "/about") {
    page = page.replace(
      "</head>",
      () =>
        "<style data-about-styles>" +
        aboutStyles.replaceAll("</style", "<\\/style") +
        "</style></head>",
    );
    page = page.replace(/<link\s[^>]*as="image"[^>]*>/g, "");
    page = page.replace(
      "</head>",
      '<link rel="preload" as="image" href="/assets/about-dialogue-small.webp" media="(max-width: 767px)" fetchpriority="high"><link rel="preload" as="image" href="/assets/about-dialogue.webp" media="(min-width: 768px)" fetchpriority="high"></head>',
    );
  }
  if (path === "/awareness") {
    page = page.replace(/<link\s[^>]*as="image"[^>]*>/g, "");
    page = page.replace(
      "</head>",
      () =>
        "<style data-awareness-styles>" +
        awarenessStyles.replaceAll("</style", "<\\/style") +
        `</style>${[awarenessDisplayFont, ...awarenessUiFonts].map((font) => `<link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/${font}">`).join("")}<link rel="preload" as="image" href="/assets/learn-hero.webp" fetchpriority="high"></head>`,
    );
  }
  if (path === "/resources") {
    page = page.replace(/<link\s[^>]*as="image"[^>]*>/g, "");
    page = page.replace(
      "</head>",
      () =>
        "<style data-resources-styles>" +
        resourcesStyles.replaceAll("</style", "<\\/style") +
        `</style>${[awarenessDisplayFont, ...awarenessUiFonts].map((font) => `<link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/${font}">`).join("")}<link rel="preload" as="image" href="/assets/resources-hero.webp" fetchpriority="high"></head>`,
    );
  }
  await writeFile(
    file,
    page.replace(outlet, () => '<div id="root">' + renderPage(path) + "</div>"),
  );
}
console.log(
  "Rendered /, /about, /awareness, /resources /find-support and /contact into static build HTML.",
);
