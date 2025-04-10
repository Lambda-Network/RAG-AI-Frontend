import React, { useState } from 'react';
import './App.css';
import { FaFilePdf, FaFileWord, FaFileExcel, FaFileAlt } from 'react-icons/fa';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const searchPolicies = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      const apiUrl = `${process.env.REACT_APP_API_URL}/search`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResults(data.files || []);
      setAnswer(data.answer || '');
    } catch (error) {
      console.error('Error searching policies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FaFilePdf className="file-icon" />;
      case 'doc':
      case 'docx':
        return <FaFileWord className="file-icon" />;
      case 'xls':
      case 'xlsx':
        return <FaFileExcel className="file-icon" />;
      default:
        return <FaFileAlt className="file-icon" />;
    }
  };

  const getFileLabel = (fileName) => {
    const extension = fileName.split('.').pop().toUpperCase();
    return extension;
  };

  return (
      <div className="App">
        <header className="App-header">
          <h1>Tyr Search Engine</h1>
        </header>
        <main>
          <div className="search-container">
            <input
                type="text"
                placeholder="Search Tyr..."
                value={query}
                onChange={handleSearchChange}
            />
            <button onClick={searchPolicies} disabled={!query.trim()}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          {loading ? (
              <div className="spinner"></div>
          ) : (
              <>
            <textarea
                value={answer}
                readOnly
                rows="10"
                cols="50"
                placeholder="The answer will appear here..."
            />
                {results.length > 0 ? (
                    <div className="results-container">
                      <h3>Related Files:</h3>
                      <ul>
                        {results.map((file, index) => (
                            <li key={index}>
                              <a
                                  href={`${process.env.REACT_APP_API_URL}/download/${file}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                              >
                                {getFileIcon(file)}
                                {getFileLabel(file, index)}
                              </a>
                            </li>
                        ))}
                      </ul>
                    </div>
                ) : (
                    <p>No results found.</p>
                )}
              </>
          )}
        </main>
      </div>
  );
}

export default App;