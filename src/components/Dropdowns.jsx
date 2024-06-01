import React from 'react';

const LanguageDropdown = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className="p-2 border outline-none border-gray-700 rounded text-white text-sm bg-gray-800"
    >
      <option value="abap">ABAP</option>
      <option value="apex">Apex</option>
      <option value="azcli">Azure CLI</option>
      <option value="bat">Batch</option>
      <option value="c">C</option>
      <option value="clojure">Clojure</option>
      <option value="coffeescript">CoffeeScript</option>
      <option value="cpp">C++</option>
      <option value="csharp">C#</option>
      <option value="css">CSS</option>
      <option value="dart">Dart</option>
      <option value="dockerfile">Dockerfile</option>
      <option value="elixir">Elixir</option>
      <option value="fsharp">F#</option>
      <option value="go">Go</option>
      <option value="graphql">GraphQL</option>
      <option value="groovy">Groovy</option>
      <option value="html">HTML</option>
      <option value="java">Java</option>
      <option value="javascript">JavaScript</option>
      <option value="json">JSON</option>
      <option value="kotlin">Kotlin</option>
      <option value="less">Less</option>
      <option value="lua">Lua</option>
      <option value="markdown">Markdown</option>
      <option value="matlab">MATLAB</option>
      <option value="nginx">Nginx</option>
      <option value="objective-c">Objective-C</option>
      <option value="pascal">Pascal</option>
      <option value="perl">Perl</option>
      <option value="php">PHP</option>
      <option value="plaintext">Plain Text</option>
      <option value="powershell">PowerShell</option>
      <option value="python">Python</option>
      <option value="r">R</option>
      <option value="razor">Razor</option>
      <option value="ruby">Ruby</option>
      <option value="rust">Rust</option>
      <option value="scss">SCSS</option>
      <option value="shell">Shell</option>
      <option value="solidity">Solidity</option>
      <option value="sql">SQL</option>
      <option value="swift">Swift</option>
      <option value="typescript">TypeScript</option>
      <option value="vbnet">VB.NET</option>
      <option value="xml">XML</option>
      <option value="yaml">YAML</option>
    </select>
  );
};

const ExpireTimeDropdown = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className="p-2 border outline-none border-gray-700 rounded text-white text-sm bg-gray-800"
    >
      <option value="5">5 min</option>
      <option value="10">10 min</option>
      <option value="30">30 min</option>
      <option value="60">1 hour</option>
      <option value="never">Never</option>
    </select>
  );
};

export { LanguageDropdown, ExpireTimeDropdown };
