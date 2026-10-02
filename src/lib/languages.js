/**
 * Curated language catalogue.
 *
 * `value`  – what we store in the database (backwards compatible with the
 *            original list, so old snippets keep working).
 * `prism`  – the refractor/prism grammar key used for highlighting.
 *            `null` means "render as plain text".
 * `ext`    – used to build a friendly filename in the editor chrome.
 * `accent` – hex colour for the language dot / chips.
 */
export const LANGUAGES = [
  { value: 'plaintext', label: 'Plain text', prism: null, ext: 'txt', accent: '#8b98ae' },
  { value: 'javascript', label: 'JavaScript', prism: 'javascript', ext: 'js', accent: '#f0d24a' },
  { value: 'typescript', label: 'TypeScript', prism: 'typescript', ext: 'ts', accent: '#4f8ff7' },
  { value: 'jsx', label: 'JSX', prism: 'jsx', ext: 'jsx', accent: '#61dafb' },
  { value: 'tsx', label: 'TSX', prism: 'tsx', ext: 'tsx', accent: '#3d8bfd' },
  { value: 'python', label: 'Python', prism: 'python', ext: 'py', accent: '#4b8bbe' },
  { value: 'java', label: 'Java', prism: 'java', ext: 'java', accent: '#e76f00' },
  { value: 'c', label: 'C', prism: 'c', ext: 'c', accent: '#8b98ae' },
  { value: 'cpp', label: 'C++', prism: 'cpp', ext: 'cpp', accent: '#6295cb' },
  { value: 'csharp', label: 'C#', prism: 'csharp', ext: 'cs', accent: '#8b6bff' },
  { value: 'go', label: 'Go', prism: 'go', ext: 'go', accent: '#00add8' },
  { value: 'rust', label: 'Rust', prism: 'rust', ext: 'rs', accent: '#ff7043' },
  { value: 'ruby', label: 'Ruby', prism: 'ruby', ext: 'rb', accent: '#e0504a' },
  { value: 'php', label: 'PHP', prism: 'php', ext: 'php', accent: '#8892bf' },
  { value: 'swift', label: 'Swift', prism: 'swift', ext: 'swift', accent: '#ff6a3d' },
  { value: 'kotlin', label: 'Kotlin', prism: 'kotlin', ext: 'kt', accent: '#a97bff' },
  { value: 'dart', label: 'Dart', prism: 'dart', ext: 'dart', accent: '#38dcd0' },
  { value: 'scala', label: 'Scala', prism: 'scala', ext: 'scala', accent: '#e0504a' },
  { value: 'elixir', label: 'Elixir', prism: 'elixir', ext: 'ex', accent: '#a98bd3' },
  { value: 'erlang', label: 'Erlang', prism: 'erlang', ext: 'erl', accent: '#d0619a' },
  { value: 'haskell', label: 'Haskell', prism: 'haskell', ext: 'hs', accent: '#8b7bc8' },
  { value: 'clojure', label: 'Clojure', prism: 'clojure', ext: 'clj', accent: '#8cd05a' },
  { value: 'fsharp', label: 'F#', prism: 'fsharp', ext: 'fs', accent: '#38b9db' },
  { value: 'lua', label: 'Lua', prism: 'lua', ext: 'lua', accent: '#5b7fe0' },
  { value: 'perl', label: 'Perl', prism: 'perl', ext: 'pl', accent: '#5b86c4' },
  { value: 'r', label: 'R', prism: 'r', ext: 'r', accent: '#4f8ff7' },
  { value: 'matlab', label: 'MATLAB', prism: 'matlab', ext: 'm', accent: '#e16737' },
  { value: 'pascal', label: 'Pascal', prism: 'pascal', ext: 'pas', accent: '#aab6cd' },
  { value: 'objective-c', label: 'Objective-C', prism: 'objectivec', ext: 'm', accent: '#4f9dff' },
  { value: 'groovy', label: 'Groovy', prism: 'groovy', ext: 'groovy', accent: '#5fb0cd' },
  { value: 'coffeescript', label: 'CoffeeScript', prism: 'coffeescript', ext: 'coffee', accent: '#a98f6e' },
  { value: 'abap', label: 'ABAP', prism: 'abap', ext: 'abap', accent: '#6fa8dc' },
  { value: 'apex', label: 'Apex', prism: 'apex', ext: 'cls', accent: '#3ea6d8' },
  { value: 'vbnet', label: 'VB.NET', prism: 'vbnet', ext: 'vb', accent: '#a97bff' },
  { value: 'razor', label: 'Razor', prism: 'uorazor', ext: 'cshtml', accent: '#7fb2ff' },
  { value: 'shell', label: 'Shell', prism: 'bash', ext: 'sh', accent: '#66e0c8' },
  { value: 'powershell', label: 'PowerShell', prism: 'powershell', ext: 'ps1', accent: '#5a8ce0' },
  { value: 'bat', label: 'Batch', prism: 'batch', ext: 'bat', accent: '#b0b8c4' },
  { value: 'sql', label: 'SQL', prism: 'sql', ext: 'sql', accent: '#ffa04d' },
  { value: 'graphql', label: 'GraphQL', prism: 'graphql', ext: 'graphql', accent: '#e535ab' },
  { value: 'html', label: 'HTML', prism: 'markup', ext: 'html', accent: '#ff8a5c' },
  { value: 'xml', label: 'XML', prism: 'markup', ext: 'xml', accent: '#8fb8ff' },
  { value: 'css', label: 'CSS', prism: 'css', ext: 'css', accent: '#4a9eff' },
  { value: 'scss', label: 'SCSS', prism: 'scss', ext: 'scss', accent: '#e578a8' },
  { value: 'less', label: 'Less', prism: 'less', ext: 'less', accent: '#7ba7d7' },
  { value: 'json', label: 'JSON', prism: 'json', ext: 'json', accent: '#d8cd68' },
  { value: 'yaml', label: 'YAML', prism: 'yaml', ext: 'yaml', accent: '#ff7ab8' },
  { value: 'toml', label: 'TOML', prism: 'toml', ext: 'toml', accent: '#ffa04d' },
  { value: 'markdown', label: 'Markdown', prism: 'markdown', ext: 'md', accent: '#9aa6bd' },
  { value: 'diff', label: 'Diff', prism: 'diff', ext: 'diff', accent: '#7ad3a0' },
  { value: 'nginx', label: 'Nginx', prism: 'nginx', ext: 'conf', accent: '#6cc46c' },
  { value: 'dockerfile', label: 'Dockerfile', prism: 'docker', ext: 'Dockerfile', accent: '#4aa8ff' },
  { value: 'makefile', label: 'Makefile', prism: 'makefile', ext: 'Makefile', accent: '#ffa87a' },
  { value: 'cmake', label: 'CMake', prism: 'cmake', ext: 'cmake', accent: '#d4a24c' },
  { value: 'http', label: 'HTTP', prism: 'http', ext: 'http', accent: '#7ef0e6' },
  { value: 'solidity', label: 'Solidity', prism: 'solidity', ext: 'sol', accent: '#9aa6bd' },
];

const BY_VALUE = new Map(LANGUAGES.map((lang) => [lang.value, lang]));
const BY_LABEL = new Map(LANGUAGES.map((lang) => [lang.label.toLowerCase(), lang]));

/** Legacy/prism aliases so older snippets keep highlighting correctly. */
const ALIASES = {
  text: 'plaintext',
  txt: 'plaintext',
  sh: 'shell',
  bash: 'shell',
  zsh: 'shell',
  shell: 'shell',
  docker: 'dockerfile',
  make: 'makefile',
  objectivec: 'objective-c',
  objc: 'objective-c',
  cshtml: 'razor',
  cs: 'csharp',
  rs: 'rust',
  md: 'markdown',
  yml: 'yaml',
  markup: 'html',
  uorazor: 'razor',
  'uorazor': 'razor',
};

/**
 * Resolve any stored language string to a catalogue entry.
 * Unknown values degrade gracefully (label = raw value, no highlighting).
 */
export function getLanguage(value) {
  if (!value) return BY_VALUE.get('plaintext');
  const key = String(value).trim().toLowerCase();
  return (
    BY_VALUE.get(key) ||
    BY_VALUE.get(ALIASES[key]) ||
    BY_LABEL.get(key) || {
      value: key,
      label: value,
      prism: null,
      ext: 'txt',
      accent: '#8b98ae',
      unknown: true,
    }
  );
}

export const DEFAULT_LANGUAGE = 'python';

export function languageLabel(value) {
  return getLanguage(value).label;
}

export function snippetFilename(value, uniqueCode) {
  const lang = getLanguage(value);
  const stem = uniqueCode ? `snippet-${uniqueCode}.${lang.ext}` : `snippet.${lang.ext}`;
  return stem;
}

/**
 * Lightweight heuristics used to guess the language of freshly pasted code.
 * Only fires when we are reasonably confident.
 */
const DETECTORS = [
  [/^\s*<(!doctype|html)\b/i, 'html'],
  [/^\s*<\?xml\b/i, 'xml'],
  [/<\w+[\s>][\s\S]*<\/\w+>/i, 'html'],
  [/^\s*<\?php/i, 'php'],
  [/^\s*(---\n|[\w-]+:\s)/m, 'yaml'],
  [/^\s*[{[]\s*"[^"]+"\s*:/, 'json'],
  [/^\s*(package\s+main|func\s+\w+\s*\(|import\s+\(|:=)/m, 'go'],
  [/^\s*(use\s+std::|fn\s+main\s*\(|println!|let\s+mut\s)/m, 'rust'],
  [/^\s*(def\s+\w+|class\s+\w+.*:|import\s+\w+$|from\s+\w+\s+import)/m, 'python'],
  [/^\s*(public|private|protected)\s+(static\s+)?(class|void|int|String)\b/m, 'java'],
  [/^\s*(const|let|var|function|=>|export\s+(default\s+)?(function|const|class)|import\s+.*\sfrom)/m, 'javascript'],
  [/^\s*(interface|type|enum)\s+\w+[\s\S]*:\s*(string|number|boolean)/m, 'typescript'],
  [/^\s*#!\/.*\b(bash|sh|zsh)\b/m, 'shell'],
  [/^\s*(SELECT|INSERT\s+INTO|UPDATE|DELETE\s+FROM|CREATE\s+TABLE)\b/i, 'sql'],
  [/^\s*(docker\s+)?(FROM|RUN|CMD|ENTRYPOINT)\s+\w+/m, 'dockerfile'],
  [/^\s*\.?\w[\w-]*\s*\{[^}]*[a-z-]+:\s*[^;]+;/im, 'css'],
  [/^\s*@(use|media|mixin|include)\b/m, 'scss'],
  [/^\s*(<\?php)?[\s\S]*\$[a-zA-Z_]\w*\s*=\s*['"]/m, 'php'],
  [/^\s*(#include\s*<|int\s+main\s*\()/m, 'c'],
  [/^\s*using\s+System;/m, 'csharp'],
];

export function detectLanguage(code) {
  if (!code) return null;
  const sample = code.slice(0, 4000);
  for (const [pattern, value] of DETECTORS) {
    if (pattern.test(sample)) return value;
  }
  return null;
}

/** Expiry choices (minutes; 0 = never). Mirrors what the API accepts. */
export const EXPIRY_OPTIONS = [
  { value: '5', label: '5 minutes', short: '5m', minutes: 5 },
  { value: '10', label: '10 minutes', short: '10m', minutes: 10 },
  { value: '30', label: '30 minutes', short: '30m', minutes: 30 },
  { value: '60', label: '1 hour', short: '1h', minutes: 60 },
  { value: '360', label: '6 hours', short: '6h', minutes: 360 },
  { value: '1440', label: '1 day', short: '1d', minutes: 1440 },
  { value: '10080', label: '7 days', short: '7d', minutes: 10080 },
  { value: 'never', label: 'Never expires', short: 'Never', minutes: 0 },
];

export function getExpiry(value) {
  return EXPIRY_OPTIONS.find((option) => option.value === String(value)) || EXPIRY_OPTIONS[EXPIRY_OPTIONS.length - 1];
}
