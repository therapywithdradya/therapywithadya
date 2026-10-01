import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const roots = ["src", "public"];
const patterns = [
  { label: "[DUMMY]", regex: /\[DUMMY\]/ },
  { label: "[PLACEHOLDER]", regex: /\[PLACEHOLDER\]/ },
  { label: "example.com", regex: /example\.com/ },
  { label: "/placeholders/", regex: /\/placeholders\// },
  { label: "pricePaise: 0", regex: /pricePaise:\s*0\b/ },
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

let total = 0;
for (const pattern of patterns) {
  const hits = groups.get(pattern.label) ?? [];
  total += hits.length;
  console.log(`\n${pattern.label} (${hits.length})`);
  for (const hit of hits) {
    console.log(`  ${hit}`);
  }
}

console.log(`\n${total} placeholder match${total === 1 ? "" : "es"}.`);
process.exit(total > 0 ? 1 : 0);
