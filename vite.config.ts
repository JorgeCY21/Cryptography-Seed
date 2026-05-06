import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';

const seedCoreVirtualId = 'virtual:seed-core';
const resolvedSeedCoreVirtualId = '\0virtual:seed-core';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'seed-core-browser-wrapper',
      resolveId(id) {
        if (id === seedCoreVirtualId) {
          return resolvedSeedCoreVirtualId;
        }

        return null;
      },
      async load(id) {
        if (id !== resolvedSeedCoreVirtualId) {
          return null;
        }

        const sourcePath = resolve(__dirname, 'archivo.ts');
        const originalSource = readFileSync(sourcePath, 'utf8');
        const withoutReadlineImport = originalSource.replace(/^import readline from "readline";\s*/m, '');
        const cliStart = withoutReadlineImport.indexOf('const rl = readline.createInterface(');
        const browserSafeSource =
          cliStart >= 0 ? withoutReadlineImport.slice(0, cliStart).trimEnd() : withoutReadlineImport;

        const transformed = await transformWithEsbuild(`${browserSafeSource}\n`, 'archivo.ts', {
          loader: 'ts',
          format: 'esm',
          target: 'es2020',
        });

        return transformed.code;
      },
    },
  ],
});
