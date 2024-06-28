import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FiCopy, FiShare2, FiPlus, FiMoreVertical } from 'react-icons/fi';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SnippetView = () => {
  const { uniqueCode } = useParams();
  const [snippet, setSnippet] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
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
          <span>Language: {snippet?.language}</span>
          <div className="relative">
            <button
              className="p-1 rounded"
              onClick={toggleDropdown}
              aria-label="Dropdown"
            >
              <FiMoreVertical />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg">
                <div className="py-1">
                  <Link
                    to={`/raw/${uniqueCode}`}
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-900"
                    onClick={closeDropdown}
                  >
                    <FiPlus className="inline-block mr-2" /> Raw Code
                  </Link>
                  <button
                    onClick={() => { copyToClipboard(); closeDropdown(); }}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-900"
                  >
                    <FiCopy className="inline-block mr-2" /> Copy Code
                  </button>
                  <button
                    onClick={() => { shareUrl(); closeDropdown(); }}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-900"
                  >
                    <FiShare2 className="inline-block mr-2" /> Share URL
                  </button>
                  <Link
                    to="/"
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-900"
                    onClick={closeDropdown}
                  >
                    <FiPlus className="inline-block mr-2" /> Create New
                  </Link>
                </div>
              </div>
            )}
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
