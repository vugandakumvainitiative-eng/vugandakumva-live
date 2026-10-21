import { resolve } from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { EMERGENCY_NUMBERS } from "./src/lib/emergency-contacts";
import { en } from "./src/locales/en";
const escape = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll('"', "&quot;");
export default defineConfig({
  envDir: false,
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "page-static-preview",
      configurePreviewServer(server) {
        // Serve the route's own snapshot, rather than Vite's SPA fallback.
        server.middlewares.use((request, _response, next) => {
          const route = request.url?.split("?")[0];
          if (
            route === "/contact" ||
            route === "/about" ||
            route === "/awareness" ||
            route === "/resources" ||
            route === "/find-support"
          ) {
            request.url = request.url?.replace(route, route + "/index.html");
          }
          next();
        });
      },
    },
    {
      name: "static-safety",
      transformIndexHtml: (html) =>
        html.replace(
          "<!-- STATIC_SAFETY -->",
          `<aside class="static-safety" aria-label="${escape(en.emergency)}"><strong>${escape(en.emergency)}</strong> ${EMERGENCY_NUMBERS.map((number) => `<a href="tel:${number}" aria-label="${escape(en.call.replace("{{number}}", number))}">${number}</a>`).join(" ")} <a href="https://www.google.com/" rel="noreferrer">${escape(en.exit)}</a><p>${escape(en.fallback)}</p><p>${escape(en.preview)}</p></aside>`,
        ),
    },
  ],
  server: { host: "127.0.0.1", port: 5190, strictPort: true },
  build: {
    sourcemap: false,
    rollupOptions: {
      input: {
        contactStyles: resolve("src/contact.css"),
        supportStyles: resolve("src/find-support.css"),
        main: resolve("index.html"),
        aboutStyles: resolve("src/about.css"),
        awarenessStyles: resolve("src/awareness.css"),
        resourcesStyles: resolve("src/resources.css"),
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test-setup.ts",
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
