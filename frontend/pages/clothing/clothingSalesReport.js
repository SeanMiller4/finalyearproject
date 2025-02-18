import React, { useEffect, useState } from 'react';

const App = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTrendingProducts() {
      try {
        const response = await fetch('http://localhost:8080/recommend');
        const data = await response.json();
        console.log('Fetched trending products:', data); // Debug log

        if (data.trending_products) {
          setTrendingProducts(data.trending_products);
        }
      } catch (error) {
        console.error('Error fetching trending products:', error);
      }
    }
    fetchTrendingProducts();
  }, []);

  return (
    <div>
      <h1>Retail Store Recommendations</h1>

      {/* Product dropdown */}
      <div>
        <label>Select Trending Product:</label>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="">--Select a Product--</option>
          {trendingProducts.length > 0 ? (
            trendingProducts.map((product, index) => (
              <option key={index} value={product}>
                {product}
              </option>
            ))
          ) : (
            <option disabled>No products available</option>
          )}
        </select>
      </div>
    </div>
  );
};

export default App;

