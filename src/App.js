import React, { useState, useEffect } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim()) {
      searchPolicies(query);
    }
  }, [query]);

  const searchPolicies = async (query) => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/search';
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
      setResults(data.results);
      setLoading(false);
    } catch (error) {
      console.error('Error searching policies:', error);
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  return (
      <div className="App">
        <header className="App-header">
          <h1>College Policy Search Engine</h1>
        </header>
        <main>
          <div className="search-container">
            <input
                type="text"
                placeholder="Search college policies..."
                value={query}
                onChange={handleSearchChange}
            />
          </div>
          {loading ? (
              <p>Loading...</p>
          ) : (
              results.map((result, index) => (
                  <div key={index} className="policy-result">
                    <h3>{result.title}</h3>
                    <p>{result.description}</p>
                    <a href={result.url} target="_blank" rel="noopener noreferrer">Read More</a>
                  </div>
              ))
          )}
        </main>
      </div>
  );
}

export default App;
