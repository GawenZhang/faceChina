import { mkdir, readFile, writeFile } from "node:fs/promises";
import { posix, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const check = process.argv.includes("--check");
const read = (path) => readFile(join(root, path), "utf8");
const fileFor = (route) => route.slice(1) + "index.html";
const escape = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;").replaceAll('"', "&quot;");

// Use the same English copy as the interactive language menu.
const language = (await read("js/copy.js")).trim();
const english = JSON.parse(language.replace(/^window\.MACY_COPY = /, "").replace(/;$/, "")).en;

const englishPages = new Map([
  ["/", ["MACY-PAN HE5000 Hyperbaric Chambers | Models and Dimensions", english["home-lead"]]],
  ["/products/", ["HE5000 Hyperbaric Chamber Catalogue | MACY-PAN", english["prod-lead"]]],
  ["/products/he5000-mono/", ["HE5000 Mono Hyperbaric Chamber Dimensions | MACY-PAN", english["mono-p"]]],
  ["/products/he5000-standard/", ["HE5000 Standard Hyperbaric Chamber Dimensions | MACY-PAN", english["std-p"]]],
  ["/products/he5000-plus/", ["HE5000 PLUS Hyperbaric Chamber Dimensions | MACY-PAN", english["plus-p"]]],
  ["/products/he5000-fort/", ["HE5000 Fort Hyperbaric Chamber Dimensions | MACY-PAN", english["fort-p"]]],
  ["/products/he5000-diamond/", ["HE5000 Diamond Hyperbaric Chamber Dimensions | MACY-PAN", english["dia-p"]]],
  ["/about/", ["About and Contact Shanghai Baobang | MACY-PAN", english["about-lead"]]],
  ["/app/", ["O2Magic Companion App for Android | MACY-PAN", "See how O2Magic connects to a home chamber and download the Android package."]],
  ["/articles/", ["HE5000 Selection and Installation Resources | MACY-PAN", english["blog-lead"]]],
  ["/articles/he5000-models/", ["Compare Five HE5000 Hyperbaric Chambers | MACY-PAN", "Compare chamber length, width and height for the HE5000 Mono, Standard, PLUS, Fort and Diamond."]],
  ["/articles/drawing-dimensions/", ["HE5000 Pre-installation Checklist | MACY-PAN", "Check HE5000 exterior dimensions, the delivery route and on-site installation requirements."]],
  ["/articles/o2magic/", ["What O2Magic Does | MACY-PAN", english["a3-ex"]]],
  ["/articles/contact/", ["How to Contact Shanghai Baobang | MACY-PAN", english["a4-ex"]]],
]);
const otherPages = [
  "/privacy/",
  "/terms/",
  "/articles/what-to-wear/",
  "/articles/how-many-sessions/",
  "/articles/which-families/",
];
const chineseHome = await read("index.html");
const sourceOrigin = new URL(chineseHome.match(/<link rel="canonical" href="([^"]+)"/)[1]).origin;
const origin = process.env.GEO_SITE_ORIGIN?.trim() || sourceOrigin;
const configured = new URL(origin);
if (configured.origin !== origin || configured.host !== new URL(sourceOrigin).host ||
    !["http:", "https:"].includes(configured.protocol)) {
  throw new Error("GEO_SITE_ORIGIN must be an HTTP(S) origin for " + new URL(sourceOrigin).host);
}
const updateOrigin = (content) => content.replaceAll(sourceOrigin + "/", origin + "/");

function relative(from, to) {
  const path = posix.relative(from, to) || ".";
  return to.endsWith("/") ? path + "/" : path;
}

function translatedCopy(html, route) {
  const usedKeys = new Set();
  const copy = (key) => {
    if (!english[key]) throw new Error("Missing English copy for " + route + " (" + key + ")");
    usedKeys.add(key);
    return escape(english[key]);
  };
  html = html.replace(/(<([a-z][\w-]*)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>)[^<]*(<\/\2>)/gi,
    (_, opening, _tag, key, closing) => opening + copy(key) + closing);
  html = html.replace(/<(?:input|textarea|img)\b[^>]*>/gi, (tag) => {
    const attribute = tag.match(/\bdata-i18n-(alt|placeholder)="([^"]+)"/);
    if (!attribute) return tag;
    const [, name, key] = attribute;
    const replacement = copy(key);
    tag = tag.replace(new RegExp("\\b" + name + '="[^"]*"'), name + '="' + replacement + '"');
    return name === "placeholder" ? tag.replace(/\baria-label="[^"]*"/, 'aria-label="' + replacement + '"') : tag;
  });
  for (const [, key] of html.matchAll(/\bdata-i18n="([^"]+)"/g)) {
    if (!usedKeys.has(key)) throw new Error("Translation must be on a text-only element: " + route + " (" + key + ")");
  }
  return html;
}

function englishStructuredData(html, englishRoute) {
  return html.replace(/(<script type="application\/ld\+json">)(.+?)(<\/script>)/g, (_, open, raw, close) => {
    const data = JSON.parse(raw);
    if (data["@type"] === "BreadcrumbList") {
      data.itemListElement.forEach((item, index) => {
        item.name = ["Home", "Products"][index] || item.name;
        item.item = origin + "/en" + new URL(item.item).pathname;
      });
    }
    if (data["@type"] === "Organization") data.name = "Shanghai Baobang Medical Equipment Co., Ltd.";
    if (data["@type"] === "Article") {
      data.inLanguage = "en";
      data.headline = html.match(/<h1[^>]*>([^<]+)<\/h1>/)[1].replaceAll("&amp;", "&");
      data.mainEntityOfPage = origin + englishRoute;
      data.author.name = data.publisher.name = "Shanghai Baobang Medical Equipment Co., Ltd.";
    }
    return open + JSON.stringify(data) + close;
  });
}

function renderEnglish(html, route, [title, description]) {
  const englishRoute = "/en" + route;
  const chineseLink = relative(englishRoute, route);
  html = translatedCopy(html, route)
    .replace('<html lang="zh-CN" data-lang="zh">', '<html lang="en" data-lang="en" data-fixed-language>')
    .replace(/<title>[^<]+<\/title>/, "<title>" + escape(title) + "</title>")
    .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="' + escape(description) + '">')
    .replace(/(<link rel="canonical" href=")[^"]+/, "$1" + origin + englishRoute)
    .replaceAll('aria-label="主导航"', 'aria-label="Main navigation"')
    .replaceAll('aria-label="产品中心"', 'aria-label="Products"')
    .replaceAll('aria-label="支持"', 'aria-label="Support"')
    .replaceAll('aria-label="法律"', 'aria-label="Legal"')
    .replace(/<(?:a|img|script|link)\b[^>]*>/gi, (tag) =>
      tag.replace(/\b(href|src)="([^"]*)"/, (attribute, name, value) => {
        if (/^(?:[a-z][a-z+.-]*:|\/\/|#)/i.test(value)) return attribute;
        const destination = new URL(value, origin + route);
        const path = name === "href" && englishPages.has(destination.pathname)
          ? "/en" + destination.pathname
          : destination.pathname;
        return name + '="' + relative(englishRoute, path) + destination.search + destination.hash + '"';
      }))
    .replace('<span class="lang-label">简体中文</span>', '<span class="lang-label">English</span>')
    .replace(/<a\b[^>]*\bdata-lang="en"[^>]*>English<\/a>/, '<button type="button" data-lang="en" role="option" aria-selected="true">English</button>')
    .replace(/<button type="button" data-lang="(?!en\b)([a-z]+)" role="option" aria-selected="[^"]+">([^<]+)<\/button>/g,
      (_, code, label) => {
        const locale = code === "zh" ? "zh-CN" : code;
        const href = chineseLink + (code === "zh" ? "" : "?lang=" + code);
        return '<a href="' + href + '" data-lang="' + code + '" role="option" aria-selected="false" lang="' + locale + '">' + label + '</a>';
      });
  return "<!-- Generated from the Chinese page and js/copy.js by scripts/build-geo.mjs. -->\n" +
    englishStructuredData(html, englishRoute);
}

async function output(path, content) {
  const fullPath = join(root, path);
  if (check) {
    const existing = await read(path).catch(() => "");
    if (existing.replaceAll("\r\n", "\n") !== content) throw new Error(path + " is stale. Run node scripts/build-geo.mjs.");
  } else {
    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, content, "utf8");
  }
}

const indexed = [];
for (const route of [...englishPages.keys(), ...otherPages]) {
  const file = fileFor(route);
  const html = updateOrigin((await read(file)).replaceAll("\r\n", "\n"));
  if (origin !== sourceOrigin) await output(file, html);
  if (!html.includes('<link rel="canonical" href="' + origin + route + '">')) {
    throw new Error("Canonical URL does not match " + route);
  }
  const indexable = !/<meta name="robots" content="[^"]*\bnoindex\b/.test(html);
  if (indexable) indexed.push(route);
  const metadata = englishPages.get(route);
  if (!metadata) continue;
  if (!html.includes('hreflang="en" href="' + origin + "/en" + route + '"')) {
    throw new Error("Missing English alternate for " + route);
  }
  if (indexable) indexed.push("/en" + route);
  await output(fileFor("/en" + route), renderEnglish(html, route, metadata));
}

if (origin !== sourceOrigin) {
  for (const path of ["robots.txt", "llms.txt"]) {
    await output(path, updateOrigin((await read(path)).replaceAll("\r\n", "\n")));
  }
}

await output("sitemap.xml", [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...indexed.map((route) => "  <url><loc>" + origin + route + "</loc></url>"),
  "</urlset>",
  "",
].join("\n"));
console.log((check ? "Verified " : "Generated ") + englishPages.size + " English HTML pages and " + indexed.length + " sitemap URLs.");
