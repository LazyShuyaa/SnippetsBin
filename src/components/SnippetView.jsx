import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FiCopy, FiShare2, FiPlus } from 'react-icons/fi';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SnippetView = () => {
  const { uniqueCode } = useParams();
  const [snippet, setSnippet] = useState(null);

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const response = await axios.get(`/api/snippets/${uniqueCode}`);
        setSnippet(response.data);
        document.title = uniqueCode;
      } catch (error) {
        console.error('Failed to fetch the snippet!', error);
      }
    };

    fetchSnippet();
  }, [uniqueCode]);

  const copyToClipboard = () => {
    if (snippet) {
      navigator.clipboard.writeText(snippet.code).catch(err => console.error('Failed to copy code!', err));
    }
  };

  const shareUrl = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Code Snippet',
        url: window.location.href
      }).catch(err => console.error('Failed to share URL!', err));
    } else {
      console.error('Web Share API not supported in this browser.');
    }
  };

  const renderCodeWithLineNumbers = () => {
    if (!snippet) return null;

    return (
      <SyntaxHighlighter
        language={snippet.language}
        style={atomDark}
        showLineNumbers
        customStyle={{ backgroundColor: '#000000' }}
      >
        {snippet.code}
      </SyntaxHighlighter>
    );
  };

  if (!snippet) {
    return (
      <div className="p-4 animate-pulse bg-black text-white min-h-screen">
        <div className="h-6 bg-gray-700 rounded mb-4"></div>
        <div className="h-36 bg-gray-700 rounded mb-4"></div>
        <div className="h-4 bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-700 rounded mb-2"></div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-black text-white min-h-screen">
      <div className="border border-gray-700 rounded">
        <div className="bg-gray-700 p-2 rounded-t flex justify-between items-center text-white">
          <span>Language: {snippet.language}</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={copyToClipboard}
              className="p-1 rounded"
              aria-label="Copy code to clipboard"
            >
              <FiCopy />
            </button>
            <button
              onClick={shareUrl}
              className="p-1 rounded"
              aria-label="Share URL"
            >
              <FiShare2 />
            </button>
            <Link to="/" className="p-1 rounded" aria-label="Create new snippet">
              <FiPlus />
            </Link>
          </div>
        </div>
        <div className="p-4 bg-black text-white rounded-b">
          {renderCodeWithLineNumbers()}
        </div>
      </div>
    </div>
  );
};

export default SnippetView;
