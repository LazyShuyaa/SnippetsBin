import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Highlight from 'react-highlight';
import 'highlight.js/styles/monokai-sublime.css'; // Use a dark theme for syntax highlighting
import { FiCopy, FiShare2 } from 'react-icons/fi';

const SnippetView = () => {
  const { uniqueCode } = useParams();
  const [snippet, setSnippet] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const response = await axios.get(`/api/snippets/${uniqueCode}`);
        setSnippet(response.data);
        document.title = uniqueCode; // Update document title
      } catch (error) {
        console.error('There was an error fetching the snippet!', error);
        setError('Failed to load the snippet. Please try again later.');
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

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

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
      <div className="flex justify-between mb-4">
        <button
          onClick={copyToClipboard}
          className="p-2 text-white rounded flex items-center hover:bg-gray-600"
          aria-label="Copy code to clipboard"
        >
          <FiCopy className="mr-2" />
          Copy Code
        </button>
        <button
          onClick={shareUrl}
          className="p-2 text-white rounded flex items-center hover:bg-gray-600"
          aria-label="Share URL"
        >
          <FiShare2 className="mr-2" />
          Share URL
        </button>
      </div>
      <p className="mt-4">Language: {snippet.language}</p>
      <div className="p-4 bg-black text-white">
        <Highlight className={`${snippet.language} bg-black`}>
          {snippet.code}
        </Highlight>
      </div>
    </div>
  );
};

export default SnippetView;
