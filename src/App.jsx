import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SnippetForm from './components/SnippetForm';
import SnippetView from './components/SnippetView';
import RawCodeView from './components/RawCodeView';

function App() {
  return (
    <Router>
      <div className="bg-black text-white font-khand">
        <div>
          <Routes>
            <Route path="/" element={<SnippetForm />} />
            <Route path="/:uniqueCode" element={<SnippetView />} />
            <Route path="/raw/:uniqueCode" element={<RawCodeView />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
