import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Predictions() {
  const [overallPredictions, setOverallPredictions] = useState([]);
  const [clothingPredictions, setClothingPredictions] = useState([]);
  const [accessoriesPredictions, setAccessoriesPredictions] = useState([]);
  const [subcategoryPredictions, setSubcategoryPredictions] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const responses = await Promise.all([
          fetch('http://localhost:8080/recommendations/predict'),
          fetch('http://localhost:8080/recommendations/predict/clothing'),
          fetch('http://localhost:8080/recommendations/predict/accessories')
        ]);

        const [overall, clothing, accessories] = await Promise.all(responses.map(res => res.json()));

        setOverallPredictions(overall);
        setClothingPredictions(clothing);
        setAccessoriesPredictions(accessories);
      } catch (error) {
        console.error('Error fetching predictions:', error);
      }
    };

    fetchPredictions();
  }, []);

  const fetchSubcategoryPredictions = async (subcategory) => {
    try {
      const response = await fetch(`http://localhost:8080/recommendations/predict/subcategory/${subcategory}`);
      const data = await response.json();
      setSubcategoryPredictions(data);
      setSelectedSubcategory(subcategory);
    } catch (error) {
      console.error('Error fetching subcategory predictions:', error);
    }
  };

  const renderChart = (predictions) => ({
    labels: predictions.map(prediction => prediction.ds),
    datasets: [
      {
        label: 'Predicted Trend',
        data: predictions.map(prediction => prediction.yhat),
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Lower Bound',
        data: predictions.map(prediction => prediction.yhat_lower),
        borderColor: 'gray',
        backgroundColor: 'rgba(169, 169, 169, 0.3)',
        fill: '-1',
        tension: 0.4,
      },
      {
        label: 'Upper Bound',
        data: predictions.map(prediction => prediction.yhat_upper),
        borderColor: 'gray',
        backgroundColor: 'rgba(169, 169, 169, 0.3)',
        fill: '-1',
        tension: 0.4,
      },
    ],
  });

  const renderPredictionData = (predictions) => (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Predicted Trend</th>
          <th>Lower Bound</th>
          <th>Upper Bound</th>
        </tr>
      </thead>
      <tbody>
        {predictions.map((prediction, index) => (
          <tr key={index}>
            <td>{prediction.ds}</td>
            <td>{prediction.yhat}</td>
            <td>{prediction.yhat_lower}</td>
            <td>{prediction.yhat_upper}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div>
      <h1>Fashion Sales Predictions</h1>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '48%' }}>
          <h2>Overall Predictions</h2>
          {renderPredictionData(overallPredictions)}

          <h2>Clothing Predictions</h2>
          {renderPredictionData(clothingPredictions)}

          <h2>Accessories Predictions</h2>
          {renderPredictionData(accessoriesPredictions)}

          <h2>Subcategory Predictions</h2>
          <input
            type="text"
            placeholder="Enter subcategory"
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
          />
          <button onClick={() => fetchSubcategoryPredictions(selectedSubcategory)}>Fetch Subcategory Predictions</button>

          {subcategoryPredictions.length > 0 && (
            <>
              <h2>Predictions for {selectedSubcategory}</h2>
              {renderPredictionData(subcategoryPredictions)}
            </>
          )}
        </div>

        <div style={{ width: '48%' }}>
          <h2>Overall Predictions Graph</h2>
          <Line data={renderChart(overallPredictions)} />

          <h2>Clothing Predictions Graph</h2>
          <Line data={renderChart(clothingPredictions)} />

          <h2>Accessories Predictions Graph</h2>
          <Line data={renderChart(accessoriesPredictions)} />

          {subcategoryPredictions.length > 0 && (
            <>
              <h2>Predictions for {selectedSubcategory} Graph</h2>
              <Line data={renderChart(subcategoryPredictions)} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

