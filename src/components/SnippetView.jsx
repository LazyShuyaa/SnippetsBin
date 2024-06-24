import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FiCopy, FiShare2, FiPlus } from 'react-icons/fi';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SnippetView = () => {
  const { uniqueCode } = useParams();
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const response = await axios.get(`/api/snippets/${uniqueCode}`);
        setSnippet(response.data);
        document.title = uniqueCode;
        setLoading(false);
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

  return (
    <div className="p-4 bg-black text-white min-h-screen">
      <div className="border border-gray-700 rounded">
        <div className="bg-gray-700 p-2 rounded-t flex justify-between items-center text-white">
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded bg-gray-600 h-6 w-6"></div>
            <div className="p-1 rounded bg-gray-600 h-6 w-6"></div>
            <div className="p-1 rounded bg-gray-600 h-6 w-6"></div>
          </div>
        </div>
        <div className="p-4 bg-black text-white rounded-b">
          {loading ? (
            <div className="animate-pulse bg-gray-700 h-96 rounded"></div>
          ) : (
            renderCodeWithLineNumbers()
          )}
        </div>
        <div className="bg-gray-700 p-2 rounded-b flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded bg-gray-600 h-6 w-6"></div>
            <div className="p-1 rounded bg-gray-600 h-6 w-6"></div>
            <Link to="/" className="p-1 rounded bg-gray-600 h-6 w-6" aria-label="Create new snippet">
              <FiPlus />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnippetView;
