/// <reference types='bun-types' />
import { existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path/posix';

import { transpileDeclaration } from 'typescript';
import tsconfig from '../tsconfig.json';

// Constants
const ROOTDIR = resolve(import.meta.dir, '..');
const SOURCEDIR = `${ROOTDIR}/src`;
const OUTDIR = `${ROOTDIR}/lib`;

// Remove old content
if (existsSync(OUTDIR)) rmSync(OUTDIR, { recursive: true });

// Transpile files concurrently
const transpiler = new Bun.Transpiler({
  loader: 'tsx',
  target: 'node',

  // Lighter output
  minifyWhitespace: true,
  treeShaking: true
});

for (const path of new Bun.Glob('**/*.ts').scanSync(SOURCEDIR)) {
  const srcPath = `${SOURCEDIR}/${path}`;

  const pathExtStart = path.lastIndexOf('.');
  const outPathNoExt = `${OUTDIR}/${path.substring(0, pathExtStart >>> 0)}`;

  Bun.file(srcPath)
    .text()
    .then((buf) => {
      transpiler.transform(buf)
        .then((res) => {
          if (res.length !== 0)
            Bun.write(`${outPathNoExt}.js`, res.replace(/const /g, 'let '));
        });

      Bun.write(`${outPathNoExt}.d.ts`, transpileDeclaration(buf, tsconfig as any).outputText);
    });
}