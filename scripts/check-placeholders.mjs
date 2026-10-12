import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const roots = ["src", "public"];
const patterns = [
  { label: "[DUMMY]", regex: /\[DUMMY\]/ },
  { label: "[PLACEHOLDER]", regex: /\[PLACEHOLDER\]/ },
  { label: "example.com", regex: /example\.com/ },
  { label: "/placeholders/", regex: /\/placeholders\// },
  { label: "pricePaise: 0", regex: /pricePaise:\s*0\b/ },
  { label: "VERIFY-BEFORE-LAUNCH", regex: /VERIFY-BEFORE-LAUNCH/ },
];

const groups = new Map(patterns.map((pattern) => [pattern.label, []]));

function walk(directory) {
  let entries;
  try {
    entries = readdirSync(directory);
  } catch {
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(directory, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      walk(fullPath);
      continue;
    }

    const text = readFileSync(fullPath, "utf8");
    if (text.includes("\0")) {
      continue;
    }

    const lines = text.split(/\r?\n/);
    const relative = fullPath.split(path.sep).join("/");

    lines.forEach((line, index) => {
      for (const pattern of patterns) {
        if (pattern.regex.test(line)) {
          groups.get(pattern.label).push(`${relative}:${index + 1}`);
        }
      }
    });
  }
}

for (const root of roots) {
  walk(root);
}

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".svg"]);
const missingAlt = [];

function walkImages(directory) {
  let entries;
  try {
    entries = readdirSync(directory);
  } catch {
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(directory, entry);
    if (statSync(fullPath).isDirectory()) {
      walkImages(fullPath);
      continue;
    }

    if (!imageExtensions.has(path.extname(entry).toLowerCase())) {
      continue;
    }

    const relative = fullPath.split(path.sep).join("/");
    const sources = [];
    walkSources("src", relative, sources);
    const hasAlt = sources.some((hit) => hit.hasAlt);
    if (!hasAlt) {
      missingAlt.push(sources.length === 0 ? `${relative} (not referenced)` : relative);
    }
  }
}

function walkSources(directory, imagePath, sources) {
  let entries;
  try {
    entries = readdirSync(directory);
  } catch {
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(directory, entry);
    if (statSync(fullPath).isDirectory()) {
      walkSources(fullPath, imagePath, sources);
      continue;
    }

    if (!/\.(tsx?|jsx?|mjs|css)$/.test(entry)) {
      continue;
    }

    const text = readFileSync(fullPath, "utf8");
    if (!text.includes(imagePath) && !text.includes(path.basename(imagePath))) {
      continue;
    }

    const lines = text.split(/\r?\n/);
    lines.forEach((line, index) => {
      if (!line.includes(path.basename(imagePath))) {
        return;
      }
      const windowText = lines.slice(Math.max(0, index - 6), index + 7).join("\n");
      sources.push({
        hasAlt: /alt\s*[:=]|alt_text|altText/.test(windowText),
      });
    });
  }
}

walkImages(path.join("public", "images"));
groups.set("public/images missing alt", missingAlt);

const reportLabels = [...patterns.map((pattern) => pattern.label), "public/images missing alt"];

let total = 0;
for (const label of reportLabels) {
  const hits = groups.get(label) ?? [];
  total += hits.length;
  console.log(`\n${label} (${hits.length})`);
  for (const hit of hits) {
    console.log(`  ${hit}`);
  }
}

console.log(`\n${total} placeholder match${total === 1 ? "" : "es"}.`);
process.exit(total > 0 ? 1 : 0);
