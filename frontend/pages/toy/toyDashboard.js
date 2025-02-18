import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const ToyDashboard = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Welcome to the Toy Dashboard !</h1>
      <p>Here's your personalized dashboard with relevant features:</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        <button style={buttonStyle}>View Toy Trends</button>
        <button style={buttonStyle}>Request Wholesaler Recommendations</button>
        <button style={buttonStyle}>View Sales Reports</button>
        <button style={buttonStyle}>Forecast Future Toy Trends</button>
        <button style={{ ...buttonStyle, backgroundColor: 'red' }}>Logout</button>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  borderRadius: '5px',
  backgroundColor: '#0070f3',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
};

export default ToyDashboard;
