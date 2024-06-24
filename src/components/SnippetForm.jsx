import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { RiLoader4Line } from 'react-icons/ri';
import { LanguageDropdown, ExpireTimeDropdown } from './Dropdowns';

const SnippetForm = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [expireTime, setExpireTime] = useState('never');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLanguageChange = (e) => setLanguage(e.target.value);

  const handleExpireTimeChange = (e) => setExpireTime(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code.trim()) {
      setError('Code cannot be empty');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/snippets', {
        code,
        language,
        expireTime: expireTime === 'never' ? 0 : expireTime,
      });
      navigate(`/${response.data.uniqueCode}`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'There was an error creating the snippet!';
      setError(errorMessage);
      console.error('Error creating snippet:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white">
      <div className="w-full max-w-6xl mx-auto p-8 bg-black shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Paste And Share Your Snippets</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <LanguageDropdown value={language} onChange={handleLanguageChange} />
              <ExpireTimeDropdown value={expireTime} onChange={handleExpireTimeChange} />
            </div>
            <button
              type="submit"
              className={`flex items-center justify-center px-4 py-2 rounded bg-gray-700 text-white ${
                !code.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'
              }`}
              disabled={!code.trim()}
            >
              {loading && <RiLoader4Line className="animate-spin mr-2" />}
              {loading ? 'Wait' : 'Public'}
            </button>
          </div>
          <textarea
            className="w-full p-4 border border-slate-400 rounded-lg bg-gray-950 text-white text-sm focus:outline-none"
            style={{ minHeight: '600px', height: '600px', width: '100%' }}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            aria-label="Code Input"
          ></textarea>
          {error && (
            <div 
              className="p-4 bg-red-200 border border-red-500 text-red-800 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
              <button
                type="button"
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                onClick={() => setError(null)}
              >
                <svg className="fill-current h-6 w-6 text-red-900" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <title>Close</title>
                  <path d="M14.348 5.652a.5.5 0 00-.707 0L10 9.293 6.36 5.652a.5.5 0 10-.707.707L9.293 10l-3.64 3.64a.5.5 0 00.707.707L10 10.707l3.64 3.64a.5.5 0 00.707-.707L10.707 10l3.64-3.64a.5.5 0 000-.707z" />
                </svg>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SnippetForm;