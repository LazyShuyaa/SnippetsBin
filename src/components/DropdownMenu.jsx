
import React from 'react';
import { Link } from 'react-router-dom';
import { FiCopy, FiShare2, FiPlus, FiMoreVertical, FiCode } from 'react-icons/fi';

const DropdownMenu = ({ uniqueCode, copyToClipboard, shareUrl, closeDropdown }) => (
  <div className="absolute right-0 mt-30 w-48 bg-gray-800 rounded-md shadow-lg">
    <div className="py-1">
      <Link
        to={`/raw/${uniqueCode}`}
        className="block px-4 py-2 text-sm text-white hover:bg-gray-900"
        onClick={closeDropdown}
      >
        <FiCode className="inline-block mr-2" /> Raw Code
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
);

export default DropdownMenu;
