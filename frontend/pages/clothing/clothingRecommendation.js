import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const RetailersMap = ({ retailers }) => {
  const center =
    retailers.length > 0
      ? { lat: retailers[0].lat, lng: retailers[0].lng }
      : { lat: 53.3498, lng: -6.2603 };

  return (
    <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={13}>
      {retailers.map((retailer, idx) => (
        <Marker
          key={idx}
          position={{ lat: retailer.lat, lng: retailer.lng }}
          title={retailer.name}
        />
      ))}
    </GoogleMap>
  );
};

const TrendingPage = () => {
  const [loadingTrending, setLoadingTrending] = useState(false);
  const [trendingData, setTrendingData] = useState({
    "Items_You_Sell_Only": null,
    "Zara_Only_Items": null,
    "Items_You_Sell_That_Zara_Sells": null
  });
  const [errorTrending, setErrorTrending] = useState('');

  const [selectedProduct, setSelectedProduct] = useState('');
  const [city, setCity] = useState('');

  const [retailers, setRetailers] = useState([]);
  const [loadingRetailers, setLoadingRetailers] = useState(false);
  const [errorRetailers, setErrorRetailers] = useState('');

  const fetchTrendingProducts = async () => {
    setLoadingTrending(true);
    setErrorTrending('');
    try {
      const res = await fetch('http://localhost:8080/api/getTrendingProducts');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setTrendingData(data);
    } catch (err) {
      console.error(err);
      setErrorTrending('Failed to fetch trending products.');
    }
    setLoadingTrending(false);
  };

  useEffect(() => {
    fetchTrendingProducts();
  }, []);

  const fetchRetailers = async () => {
    if (!selectedProduct || !city) return;
    setLoadingRetailers(true);
    setErrorRetailers('');
    try {
      const res = await fetch(
        `http://localhost:8080/api/getRetailers?product=${encodeURIComponent(
          selectedProduct
        )}&city=${encodeURIComponent(city)}`
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setRetailers(data.recommended_stores);
    } catch (err) {
      console.error(err);
      setErrorRetailers('Failed to fetch retailer recommendations.');
    }
    setLoadingRetailers(false);
  };


  const handleSaveRetailer = async (store) => {
    const retailerData = { ...store, product: selectedProduct };

    try {
      const res = await fetch('http://localhost:8080/api/saveRetailer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(retailerData)
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const result = await res.json();
      alert(result.message || 'Retailer saved successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to save retailer.');
    }
  };


  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAuWC2auTkyqnJp6RXCyrpfdh5LlTCqHyo'
  });

  if (loadError) return <div>Error loading maps.</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Trending Products</h1>
      {loadingTrending && <p>Loading trending products...</p>}
      {errorTrending && <p style={{ color: 'red' }}>{errorTrending}</p>}

      {!loadingTrending &&
        trendingData["Items_You_Sell_Only"] &&
        trendingData["Zara_Only_Items"] &&
        trendingData["Items_You_Sell_That_Zara_Sells"] && (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 30%', margin: '1rem' }}>
              <h2>Items for Sale Trending on Google</h2>
              <ul>
                {Object.keys(trendingData["Items_You_Sell_Only"])
                  .sort(
                    (a, b) =>
                      trendingData["Items_You_Sell_Only"][b] -
                      trendingData["Items_You_Sell_Only"][a]
                  )
                  .map((category, idx) => (
                    <li
                      key={idx}
                      style={{
                        margin: '0.5rem 0',
                        cursor: 'pointer',
                        color: 'blue'
                      }}
                      onClick={() => {
                        setSelectedProduct(category);
                        setRetailers([]);
                        setCity('');
                      }}
                    >
                      <strong>{category}</strong>:{" "}
                      {Number(trendingData["Items_You_Sell_Only"][category]).toFixed(
                        2
                      )}
                    </li>
                  ))}
              </ul>
            </div>
            <div style={{ flex: '1 1 30%', margin: '1rem' }}>
              <h2>Zara Items Trending on Google</h2>
              <ul>
                {Object.keys(trendingData["Zara_Only_Items"])
                  .sort(
                    (a, b) =>
                      trendingData["Zara_Only_Items"][b] -
                      trendingData["Zara_Only_Items"][a]
                  )
                  .map((category, idx) => (
                    <li
                      key={idx}
                      style={{
                        margin: '0.5rem 0',
                        cursor: 'pointer',
                        color: 'blue'
                      }}
                      onClick={() => {
                        setSelectedProduct(category);
                        setRetailers([]);
                        setCity('');
                      }}
                    >
                      <strong>{category}</strong>:{" "}
                      {Number(trendingData["Zara_Only_Items"][category]).toFixed(
                        2
                      )}
                    </li>
                  ))}
              </ul>
            </div>
            <div style={{ flex: '1 1 30%', margin: '1rem' }}>
              <h2>Common Items Trending on Google</h2>
              <ul>
                {Object.keys(trendingData["Items_You_Sell_That_Zara_Sells"])
                  .sort(
                    (a, b) =>
                      trendingData["Items_You_Sell_That_Zara_Sells"][b] -
                      trendingData["Items_You_Sell_That_Zara_Sells"][a]
                  )
                  .map((category, idx) => (
                    <li
                      key={idx}
                      style={{
                        margin: '0.5rem 0',
                        cursor: 'pointer',
                        color: 'blue'
                      }}
                      onClick={() => {
                        setSelectedProduct(category);
                        setRetailers([]);
                        setCity('');
                      }}
                    >
                      <strong>{category}</strong>:{" "}
                      {Number(
                        trendingData["Items_You_Sell_That_Zara_Sells"][category]
                      ).toFixed(2)}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}

      {selectedProduct && retailers.length === 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Selected Product: {selectedProduct}</h2>
          <label>
            Enter City:
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{ marginLeft: '0.5rem', padding: '0.2rem' }}
            />
          </label>
          <button
            onClick={fetchRetailers}
            style={{ marginLeft: '1rem', padding: '0.3rem 0.6rem' }}
          >
            Get Retailers
          </button>
        </div>
      )}

      {loadingRetailers && <p>Loading retailer recommendations...</p>}
      {errorRetailers && <p style={{ color: 'red' }}>{errorRetailers}</p>}
      {retailers.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>
            Recommended Retailers for {selectedProduct} in {city}
          </h2>
          <ul>
            {retailers.map((store, idx) => (
              <li key={idx} style={{ marginBottom: '1rem' }}>
                <strong>{store.name}</strong> <br />
                {store.address} <br />
                Rating: {store.rating} (Popularity: {store.popularity}) <br />
                <button
                  onClick={() => handleSaveRetailer(store)}
                  style={{ marginTop: '0.5rem' }}
                >
                  Save To Potentially Sell To
                </button>
              </li>
            ))}
          </ul>
          <RetailersMap retailers={retailers} />
        </div>
      )}
    </div>
  );
};

export default TrendingPage;
