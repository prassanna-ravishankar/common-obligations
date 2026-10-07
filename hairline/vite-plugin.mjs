// Bundles the vendored Hairline kernel and each figure as ES modules, so they ship
// as /_astro/*.js (CSP script-src 'self') and the figure files stay byte-identical
// to what the kit's validate.mjs passed.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const KERNEL = "virtual:hairline/kernel";
const FIGURE = "virtual:hairline/figure/";
const root = (p) => fileURLToPath(new URL(p, import.meta.url));

export function hairline() {
  return {
    name: "hairline",
    resolveId(id) {
      if (id === KERNEL || id.startsWith(FIGURE)) return "\0" + id;
    },
    load(id) {
      if (id === "\0" + KERNEL) {
        const file = root("./kit/kernel.js");
        this.addWatchFile(file);
        return `${readFileSync(file, "utf8")}\nexport default HL;\n`;
      }
      if (id.startsWith("\0" + FIGURE)) {
        const name = id.slice(FIGURE.length + 1);
        if (!/^[a-z][a-z0-9-]*$/.test(name))
          throw new Error(`hairline: bad figure ${name}`);
        const file = root(`./figures/${name}.js`);
        this.addWatchFile(file);
        // A figure ends with hairline({ ... }); capture that declaration as the default export.
        return [
          `import HL from "${KERNEL}";`,
          "let declared;",
          "const hairline = (figure) => { declared = figure; };",
          readFileSync(file, "utf8"),
          "export default declared;",
        ].join("\n");
      }
    },
  };
}
