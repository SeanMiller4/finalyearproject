import React, { useState, useEffect } from 'react';

const SavedRetailers = () => {
  const [retailers, setRetailers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRetailers = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/savedRetailers');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRetailers(data);
      } catch (error) {
        console.error("Error fetching saved retailers:", error);
        setError("Error fetching saved retailers.");
      }
      setLoading(false);
    };

    fetchRetailers();
  }, []);

  if (loading) return <div>Loading saved retailers...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Saved Retailers</h2>
      {retailers.length === 0 ? (
        <p>No retailers saved yet.</p>
      ) : (
        <ul>
          {retailers.map((retailer) => (
            <li key={retailer.id} style={{ marginBottom: '1rem' }}>
              <strong>{retailer.name}</strong>
              <br />
              {retailer.address}
              <br />
              Rating: {retailer.rating} | Popularity: {retailer.popularity}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SavedRetailers;
