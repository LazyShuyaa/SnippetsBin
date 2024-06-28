import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import LoadingSpinner from './LoadingSpinner';
import DropdownMenu from './DropdownMenu';
import { FiMoreVertical, FiCopy } from 'react-icons/fi';

const SnippetView = () => {
  const { uniqueCode } = useParams();
  const [snippet, setSnippet] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const response = await axios.get(`/api/snippets/${uniqueCode}`);
        setSnippet(response.data);
        document.title = uniqueCode;
      } catch (error) {
        console.error('Failed to fetch the snippet!', error);
      } finally {
        setLoading(false);
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
        customStyle={{ margin: '0', padding: '0', backgroundColor: '#000000' }}
      >
        {snippet.code}
      </SyntaxHighlighter>
    );
  };

  return (
    <div className="p-4 bg-black text-white min-h-screen">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="border border-gray-700 rounded">
          <div className="bg-gray-700 p-2 rounded-t flex justify-between items-center text-white">
            <span>Language: {snippet?.language}</span>
            <div className="flex items-center">
              <button
                className="p-2 rounded-md text-lg"
                onClick={copyToClipboard}
                aria-label="Copy Code"
              >
                <FiCopy />
              </button>
              <button
                className="p-2 rounded-md text-lg"
                onClick={toggleDropdown}
                aria-label="Dropdown"
              >
                <FiMoreVertical />
              </button>
              {dropdownOpen && (
                <DropdownMenu
                  uniqueCode={uniqueCode}
                  copyToClipboard={copyToClipboard}
                  shareUrl={shareUrl}
                  closeDropdown={closeDropdown}
                />
              )}
            </div>
          </div>
          <div className="p-4 bg-black text-white rounded-b">
            {renderCodeWithLineNumbers()}
          </div>
        </div>
      )}
    </div>
  );
};

export default SnippetView;
