import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { RiLoader4Line } from 'react-icons/ri';
import { BsArrowRight } from 'react-icons/bs';
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
      console.error('There was an error creating the snippet!', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen pt-5 flex flex-col justify-center items-center">
      <form onSubmit={handleSubmit} className="w-full mx-auto flex flex-col flex-grow">
        <div className="p-4 bg-black mb-4 flex items-center justify-between">
          <div className="flex-grow flex space-x-2">
            <LanguageDropdown value={language} onChange={handleLanguageChange} />
            <ExpireTimeDropdown value={expireTime} onChange={handleExpireTimeChange} />
          </div>
          <button
            type="submit"
            className="p-2 bg-red-500 text-white rounded text-sm flex items-center"
            disabled={loading}
          >
            {loading ? <RiLoader4Line className="animate-spin mr-2" /> : <BsArrowRight className="mr-2" />}
            {loading ? 'Wait...' : 'Share'}
          </button>
        </div>
        <textarea
          className="w-full font-mono flex-grow p-2 border border-gray-700 rounded bg-black text-white text-sm outline-none"
          style={{ minHeight: 'calc(100vh - 220px)' }}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here..."
          aria-label="Code Input"
        ></textarea>
        {error && (
          <div 
            data-dismissible="alert"
            role="alert"
            className="font-regular relative flex w-full rounded-lg bg-gradient-to-tr from-red-700 to-red-500 px-4 py-4 text-base text-white mt-4"
          >
            <div className="shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path fillRule="evenodd"
                  d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clipRule="evenodd"></path>
              </svg>
            </div>
            <div className="ml-3 mr-12">
              {error}
            </div>
            <button
              data-dismissible-target="alert"
              className="!absolute top-3 right-3 select-none rounded-lg py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white transition-all hover:bg-white/10 active:bg-white/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              onClick={() => setError(null)}
            >
              Close
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default SnippetForm;
