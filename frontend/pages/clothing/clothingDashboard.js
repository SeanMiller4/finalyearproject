import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const ClothingDashboard = () => {
	
	const router = useRouter();

  const handleLogout = () => {
    alert('Logged out!'); 
    router.push('/login');
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Welcome to the Clothing Dashboard!</h1>
      <p>Manage your clothing business with the following options:</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          onClick={() => handleNavigation('/clothing/clothingRecommendation')}
          style={buttonStyle}
        >
           Google trends and retailer recommendations
        </button>

        <button
          onClick={() => handleNavigation('/clothing/clothingTrends')}
          style={buttonStyle}
        >
          View Clothing Trends from Vogue
        </button>

        <button
          onClick={() => handleNavigation('/clothing/clothingReports')}
          style={buttonStyle}
        >
          Sell to Retailer
        </button>

        <button
          onClick={() => handleNavigation('/clothing/forecastClothingTrends')}
          style={buttonStyle}
        >
          Forecast Future Clothing Trends based on Historical Data
        </button>

        <button
          onClick={handleLogout}
          style={{ ...buttonStyle, backgroundColor: 'red' }}
        >
          Logout
        </button>
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

export default ClothingDashboard;
