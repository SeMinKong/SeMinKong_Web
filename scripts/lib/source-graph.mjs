import { readFile, readdir } from 'node:fs/promises';
import { dirname, extname, resolve } from 'node:path';
import { parseAst } from 'vite';

// Use the build tool's parser so comments and string examples cannot keep dead
// code reachable. Source order matters for the route's stylesheet cascade.
const readImports = (source) => {
  const imports = [];
  const walk = (node) => {
    if (!node || typeof node !== 'object') return;
    if (['ImportDeclaration', 'ExportNamedDeclaration', 'ExportAllDeclaration', 'ImportExpression'].includes(node.type)) {
      if (node.source) {
        if (typeof node.source.value !== 'string') {
          throw new Error('Source verification requires literal module specifiers.');
        }
        imports.push({ specifier: node.source.value, start: node.start });
      }
    }
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach(walk);
      else if (value && typeof value === 'object') walk(value);
    }
  };
  walk(parseAst(source));
  return imports.sort((a, b) => a.start - b.start).map(({ specifier }) => specifier);
};

export const listSourceFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? listSourceFiles(path) : [path];
  }))).flat();
};

export const readSourceGraph = async (entryPaths) => {
  const modules = new Map();
  const styles = new Set();

  const visit = async (path) => {
    if (modules.has(path)) return;
    const source = await readFile(path, 'utf8');
    const imports = readImports(source)
      .filter((specifier) => specifier.startsWith('.'))
      .map((specifier) => resolve(dirname(path), specifier.split(/[?#]/)[0]));
    modules.set(path, { source, imports });
    for (const dependency of imports) {
      if (extname(dependency) === '.js') await visit(dependency);
      if (extname(dependency) === '.css') styles.add(dependency);
    }
  };

  for (const entry of entryPaths) await visit(resolve(entry));
  return { modules, styles };
};
