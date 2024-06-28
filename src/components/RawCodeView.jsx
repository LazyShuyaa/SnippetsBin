import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const RawCodeView = () => {
  const { uniqueCode } = useParams();
  const [rawCode, setRawCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRawCode = async () => {
      try {
        const response = await axios.get(`/api/snippets/${uniqueCode}`);
        setRawCode(response.data.code);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch raw code!', error);
        setError('Failed to fetch raw code.');
        setLoading(false);
      }
    };

    fetchRawCode();
  }, [uniqueCode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div role="status" className="flex items-center justify-center">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="p-4">
        <div className="p-4">
          <pre className="whitespace-pre-wrap">{rawCode}</pre>
        </div>
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default RawCodeView;
