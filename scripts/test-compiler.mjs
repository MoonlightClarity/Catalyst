import { createRequire } from "node:module";

const nodeRequire = createRequire(import.meta.url);

export function loadTestTypeScript() {
  return nodeRequire("@typescript/typescript6");
}

export function catalystTestCompilerOptions(ts, outDir) {
  const major = Number.parseInt(String(ts.version ?? "0").split(".")[0], 10);
  const moduleResolution = major >= 6
    ? ts.ModuleResolutionKind.Bundler
    : ts.ModuleResolutionKind.Node10;

  return {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.CommonJS,
    moduleResolution,
    strict: true,
    types: [],
    skipLibCheck: true,
    esModuleInterop: true,
    outDir,
    lib: ["lib.es2022.d.ts", "lib.dom.d.ts"],
  };
}
