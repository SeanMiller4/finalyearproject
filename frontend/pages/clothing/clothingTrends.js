import { useEffect, useState } from 'react';

export default function Trends() {
  const [trends, setTrends] = useState([]);
  const [season, setSeason] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/recommendations/trends')
      .then((response) => response.json())
      .then((data) => {
        setTrends(data.trends || []); 
        setSeason(data.season || ''); 
      })
      .catch((error) => {
        console.error('Error fetching trends:', error);
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Current Fashion Trends ({season || 'Season Unknown'})</h1>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {trends && trends.length > 0 ? (
          trends.map((trend, index) => (
            <li
              key={index}
              style={{
                margin: '10px 0',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
              }}
            >
              <a
                href={trend.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', color: '#0070f3' }}
              >
                {trend.text}
              </a>
            </li>
          ))
        ) : (
          <li>No trends available at the moment.</li>
        )}
      </ul>
    </div>
  );
}
