import React from 'react';



const languageOptions = [
  { value: 'abap', label: 'ABAP' },
  { value: 'apex', label: 'Apex' },
  { value: 'azcli', label: 'Azure CLI' },
  { value: 'bat', label: 'Batch' },
  { value: 'c', label: 'C' },
  { value: 'clojure', label: 'Clojure' },
  { value: 'coffeescript', label: 'CoffeeScript' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'css', label: 'CSS' },
  { value: 'dart', label: 'Dart' },
  { value: 'dockerfile', label: 'Dockerfile' },
  { value: 'elixir', label: 'Elixir' },
  { value: 'fsharp', label: 'F#' },
  { value: 'go', label: 'Go' },
  { value: 'graphql', label: 'GraphQL' },
  { value: 'groovy', label: 'Groovy' },
  { value: 'html', label: 'HTML' },
  { value: 'java', label: 'Java' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'json', label: 'JSON' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'less', label: 'Less' },
  { value: 'lua', label: 'Lua' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'matlab', label: 'MATLAB' },
  { value: 'nginx', label: 'Nginx' },
  { value: 'objective-c', label: 'Objective-C' },
  { value: 'pascal', label: 'Pascal' },
  { value: 'perl', label: 'Perl' },
  { value: 'php', label: 'PHP' },
  { value: 'plaintext', label: 'Plain Text' },
  { value: 'powershell', label: 'PowerShell' },
  { value: 'python', label: 'Python' },
  { value: 'r', label: 'R' },
  { value: 'razor', label: 'Razor' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'rust', label: 'Rust' },
  { value: 'scss', label: 'SCSS' },
  { value: 'shell', label: 'Shell' },
  { value: 'solidity', label: 'Solidity' },
  { value: 'sql', label: 'SQL' },
  { value: 'swift', label: 'Swift' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'vbnet', label: 'VB.NET' },
  { value: 'xml', label: 'XML' },
  { value: 'yaml', label: 'YAML' }
];

const LanguageDropdown = ({ value, onChange }) => {
  return (
    <div className="dropdown">
      <select
        value={value}
        onChange={onChange}
        className="dropdown-content block p-2 border outline-none border-gray-700 rounded text-white text-sm bg-gray-800 overflow-y-auto max-h-60"
      >
        {languageOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};




const expireTimeOptions = [
  { value: '5', label: '5 min' },
  { value: '10', label: '10 min' },
  { value: '30', label: '30 min' },
  { value: '60', label: '1 hour' },
  { value: 'never', label: 'Never' }
];

const ExpireTimeDropdown = ({ value, onChange }) => {
  return (
    <div className="dropdown">
      <select
        value={value}
        onChange={onChange}
        className="dropdown-content block p-2 border outline-none border-gray-700 rounded text-white text-sm bg-gray-800 overflow-y-auto max-h-60"
      >
        {expireTimeOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};



export { LanguageDropdown, ExpireTimeDropdown };


