// Builds the static site into _site/ from coding-agent-config-locations.md and models.md.
//   node site/build.mjs            (SITE_URL overrides the absolute URL used in feed.xml)

import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse, validate } from "./lib/parse.mjs";
import { parseModels, validateModels } from "./lib/parse-models.mjs";
import { buildHistory, diffModelDocs } from "./lib/history.mjs";
import { renderAgent, renderChangelog, renderCompare, renderFeed, renderIndex, renderModels, renderStandards } from "./lib/render.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DOC = "coding-agent-config-locations.md";
const MODELS_DOC = "models.md";
const OUT = join(ROOT, "_site");
const SITE_URL = (process.env.SITE_URL || "https://heikopanjas.github.io/agent-capabilities/").replace(/\/?$/, "/");

function write(rel, content) {
  const file = join(OUT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

const model = parse(readFileSync(join(ROOT, DOC), "utf8"));
const models = parseModels(readFileSync(join(ROOT, MODELS_DOC), "utf8"));
try {
  validate(model);
  validateModels(models, model.agents);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
// Both documents' commits, newest first.
const history = [
  ...buildHistory({ file: DOC, cwd: ROOT }),
  ...buildHistory({ file: MODELS_DOC, cwd: ROOT, parse: parseModels, diff: diffModelDocs, doc: "models" }),
].sort((x, y) => Date.parse(y.date) - Date.parse(x.date));

rmSync(OUT, { recursive: true, force: true });
cpSync(join(ROOT, "site", "assets"), join(OUT, "assets"), { recursive: true });

write("index.html", renderIndex(model, history));
model.agents.forEach((a, i) => write(`agents/${a.slug}/index.html`, renderAgent(model, i, models)));
write("models/index.html", renderModels(model, models));
write("compare/index.html", renderCompare(model));
write("changelog/index.html", renderChangelog(model, history));
write("standards/index.html", renderStandards(model));
write("feed.xml", renderFeed(model, history, SITE_URL));
write("data.json", JSON.stringify({ generatedFrom: DOC, lastVerified: model.lastVerified, ...model, models: { generatedFrom: MODELS_DOC, ...models }, history }, null, 1));
write(".nojekyll", "");

const changes = history.reduce((n, e) => n + (e.changeCount || 0), 0);
console.log(
  `Built _site/: ${model.agents.length} agents, ${model.agents.reduce((n, a) => n + a.rows.length, 0)} rows, ` +
    `${models.agents.reduce((n, a) => n + a.rows.length, 0)} models across ${models.agents.length} agents, ` +
    `${history.length} commits / ${changes} changes in history, verified ${model.lastVerified} (models ${models.lastVerified})`,
);
