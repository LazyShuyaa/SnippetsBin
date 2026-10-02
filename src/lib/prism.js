/**
 * Syntax highlighting, loaded on demand.
 *
 * The default 'react-syntax-highlighter' entry point ships every Prism
 * grammar (~600 kB). Here each grammar is a dynamic import, so only the
 * language actually being viewed is fetched — the editor renders instantly
 * and the colours fade in a moment later.
 */
import PrismLight from 'react-syntax-highlighter/dist/esm/prism-light';

/** grammar name -> dynamic import */
const GRAMMAR_LOADERS = {
  "abap": () => import('react-syntax-highlighter/dist/esm/languages/prism/abap'),
  "apex": () => import('react-syntax-highlighter/dist/esm/languages/prism/apex'),
  "bash": () => import('react-syntax-highlighter/dist/esm/languages/prism/bash'),
  "batch": () => import('react-syntax-highlighter/dist/esm/languages/prism/batch'),
  "c": () => import('react-syntax-highlighter/dist/esm/languages/prism/c'),
  "clojure": () => import('react-syntax-highlighter/dist/esm/languages/prism/clojure'),
  "cmake": () => import('react-syntax-highlighter/dist/esm/languages/prism/cmake'),
  "coffeescript": () => import('react-syntax-highlighter/dist/esm/languages/prism/coffeescript'),
  "cpp": () => import('react-syntax-highlighter/dist/esm/languages/prism/cpp'),
  "csharp": () => import('react-syntax-highlighter/dist/esm/languages/prism/csharp'),
  "css": () => import('react-syntax-highlighter/dist/esm/languages/prism/css'),
  "dart": () => import('react-syntax-highlighter/dist/esm/languages/prism/dart'),
  "diff": () => import('react-syntax-highlighter/dist/esm/languages/prism/diff'),
  "docker": () => import('react-syntax-highlighter/dist/esm/languages/prism/docker'),
  "elixir": () => import('react-syntax-highlighter/dist/esm/languages/prism/elixir'),
  "erlang": () => import('react-syntax-highlighter/dist/esm/languages/prism/erlang'),
  "fsharp": () => import('react-syntax-highlighter/dist/esm/languages/prism/fsharp'),
  "go": () => import('react-syntax-highlighter/dist/esm/languages/prism/go'),
  "graphql": () => import('react-syntax-highlighter/dist/esm/languages/prism/graphql'),
  "groovy": () => import('react-syntax-highlighter/dist/esm/languages/prism/groovy'),
  "haskell": () => import('react-syntax-highlighter/dist/esm/languages/prism/haskell'),
  "http": () => import('react-syntax-highlighter/dist/esm/languages/prism/http'),
  "java": () => import('react-syntax-highlighter/dist/esm/languages/prism/java'),
  "javascript": () => import('react-syntax-highlighter/dist/esm/languages/prism/javascript'),
  "jsx": () => import('react-syntax-highlighter/dist/esm/languages/prism/jsx'),
  "json": () => import('react-syntax-highlighter/dist/esm/languages/prism/json'),
  "kotlin": () => import('react-syntax-highlighter/dist/esm/languages/prism/kotlin'),
  "less": () => import('react-syntax-highlighter/dist/esm/languages/prism/less'),
  "lua": () => import('react-syntax-highlighter/dist/esm/languages/prism/lua'),
  "makefile": () => import('react-syntax-highlighter/dist/esm/languages/prism/makefile'),
  "markdown": () => import('react-syntax-highlighter/dist/esm/languages/prism/markdown'),
  "markup": () => import('react-syntax-highlighter/dist/esm/languages/prism/markup'),
  "matlab": () => import('react-syntax-highlighter/dist/esm/languages/prism/matlab'),
  "nginx": () => import('react-syntax-highlighter/dist/esm/languages/prism/nginx'),
  "objectivec": () => import('react-syntax-highlighter/dist/esm/languages/prism/objectivec'),
  "pascal": () => import('react-syntax-highlighter/dist/esm/languages/prism/pascal'),
  "perl": () => import('react-syntax-highlighter/dist/esm/languages/prism/perl'),
  "php": () => import('react-syntax-highlighter/dist/esm/languages/prism/php'),
  "powershell": () => import('react-syntax-highlighter/dist/esm/languages/prism/powershell'),
  "python": () => import('react-syntax-highlighter/dist/esm/languages/prism/python'),
  "r": () => import('react-syntax-highlighter/dist/esm/languages/prism/r'),
  "ruby": () => import('react-syntax-highlighter/dist/esm/languages/prism/ruby'),
  "rust": () => import('react-syntax-highlighter/dist/esm/languages/prism/rust'),
  "scala": () => import('react-syntax-highlighter/dist/esm/languages/prism/scala'),
  "scss": () => import('react-syntax-highlighter/dist/esm/languages/prism/scss'),
  "solidity": () => import('react-syntax-highlighter/dist/esm/languages/prism/solidity'),
  "sql": () => import('react-syntax-highlighter/dist/esm/languages/prism/sql'),
  "swift": () => import('react-syntax-highlighter/dist/esm/languages/prism/swift'),
  "toml": () => import('react-syntax-highlighter/dist/esm/languages/prism/toml'),
  "tsx": () => import('react-syntax-highlighter/dist/esm/languages/prism/tsx'),
  "typescript": () => import('react-syntax-highlighter/dist/esm/languages/prism/typescript'),
  "uorazor": () => import('react-syntax-highlighter/dist/esm/languages/prism/uorazor'),
  "vbnet": () => import('react-syntax-highlighter/dist/esm/languages/prism/vbnet'),
  "yaml": () => import('react-syntax-highlighter/dist/esm/languages/prism/yaml'),
};

const loadedGrammars = new Set();
const inFlight = new Map();

/** Is a grammar available for this key at all? (i.e. known to our map) */
export function isGrammarAvailable(name) {
  if (!name || name === 'text') return false;
  return Object.prototype.hasOwnProperty.call(GRAMMAR_LOADERS, name);
}

/** Resolves once the grammar is registered with Prism. */
export function ensureGrammar(name) {
  if (!name || name === 'text') return Promise.resolve(false);
  if (loadedGrammars.has(name)) return Promise.resolve(true);
  if (inFlight.has(name)) return inFlight.get(name);

  const loader = GRAMMAR_LOADERS[name];
  if (!loader) return Promise.resolve(false);

  const promise = loader()
    .then((module) => {
      PrismLight.registerLanguage(name, module.default || module);
      loadedGrammars.add(name);
      return true;
    })
    .catch((error) => {
      // A missing grammar must never break rendering — fall back to plain text.
      console.warn(`Could not load syntax grammar "${name}"`, error);
      return false;
    })
    .finally(() => inFlight.delete(name));

  inFlight.set(name, promise);
  return promise;
}

export { PrismLight };
export default PrismLight;
