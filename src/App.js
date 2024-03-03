import React, { useState } from 'react';
import './App.css';
import './index.css';  

function App() {
  const [pincode, setPincode] = useState('');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPincodeData = async (pincode) => {
    setIsLoading(true);
    setError(null);

    // Fetch data from API and handle errors
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const jsonData = await response.json();

      if (jsonData[0].Status === 'Error') {
        setError(jsonData[0].Message);
      } else {
        setData(jsonData[0].PostOffice);
      }
    } catch (error) {
      setError('Error fetching data');
    }

    setIsLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchPincodeData(pincode);
  };

  const handleFilter = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = data.filter(postOffice =>
      postOffice.Name.toLowerCase().includes(searchTerm)
    );
    setData(filtered);

    if (filtered.length === 0) {
      setError("Couldn't find the postal data you’re looking for…");
    } else {
      setError(null);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pincode Lookup App</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter 6-digit Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="pincode-input"
          />
          <button type="submit" className="lookup-button">Lookup</button>
        </form>
        <br />
        <input
          type="text"
          placeholder="Filter by post office name"
          onChange={handleFilter}
        />
        {isLoading && <div className="loader">Loading...</div>}
        {error && <div className="error">{error}</div>}
        {data && (
          <div className="postal-data-container">
            {data.map(postOffice => (
              <div key={postOffice.Name} className="postal-data">
                <p>Post office name: {postOffice.Name}</p>
                <p>Branch Type: {postOffice.BranchType}</p>
                <p>District: {postOffice.District}</p>
                <p>State: {postOffice.State}</p>
              </div>
            ))}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;

