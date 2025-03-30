import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head'
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Predictions() {
  const router = useRouter();
  const [clothingPredictions, setClothingPredictions] = useState([]);
  const [subcategoryPredictions, setSubcategoryPredictions] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const responses = await Promise.all([
          fetch('http://localhost:8080/api'),
          fetch('http://localhost:8080/api/clothing'),
        ]);

        const [clothing] = await Promise.all(responses.map(res => res.json()));

        setClothingPredictions(Array.isArray(clothing) ? clothing : []);
      } catch (error) {
        console.error('Error fetching predictions:', error);
      }
    };

    fetchPredictions();
  }, []);

  const fetchSubcategoryPredictions = async (subcategory) => {
    try {
      const response = await fetch(`http://localhost:8080/api/subcategory/${subcategory}`);
      const data = await response.json();
      setSubcategoryPredictions(Array.isArray(data) ? data : []);
      setSelectedSubcategory(subcategory);
    } catch (error) {
      console.error('Error fetching subcategory predictions:', error);
    }
  };

  const renderChart = (predictions) => {
    if (!Array.isArray(predictions) || predictions.length === 0) {
      return { labels: [], datasets: [] };
    }

    const labels = predictions.map(prediction => prediction.ds.split(' ')[0]);
    const yhatData = predictions.map(prediction => Math.round(prediction.yhat));

    return {
      labels,
      datasets: [
        {
          label: 'Predicted Sales',
          data: yhatData,
          borderColor: 'blue',
          backgroundColor: 'rgba(0, 0, 255, 0.2)',
          fill: true,
          tension: 0.4,
        }
      ],
    };
  };

  const renderPredictionData = (predictions) => {
    if (!Array.isArray(predictions) || predictions.length === 0) {
      return <p>No prediction data available.</p>;
    }

    return (
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Predicted Sales In USD</th>
          </tr>
        </thead>
        <tbody>
          {predictions.map((prediction, index) => (
            <tr key={index}>
              <td>{prediction.ds.split(' ')[0]}</td>
              <td>{Math.round(prediction.yhat)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const handleNavigation = (path) => {
	router.push(path);
  };
  
  const handleLogout = () => {
	alert('Logged out!');
	router.push('/login');
  };
  
  return (
	<>
	<Head>
	  <title>Fashion Sales Predictions</title>
	  <meta name="viewport" content="width=device-width, initial-scale=1" />
	  <link
	    rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
	  />
	</Head>
	
	<header>
	  <nav className="navbar navbar-dark bg-dark shadow-sm">
	    <div className="container">
		  <a href="#" className="navbar-brand d-flex align-items-center">
		    <strong>Clothing Dashboard</strong>
		  </a>
		</div>
	  </nav>
	</header>
	
	<section className="py-5 text-center bg-light">
	  <div className="container">
	    <h1 className="display-4 fw-bold">Fashion Sales Predictions</h1>
	    <p className="lead text-muted">
	      Detailed predictions for clothing and subcategory trends.
	    </p>
	  </div>
	</section>

	<main className="container my-4">
	  <div className="row">
	    <div className="col-md-6">
		  <h2>Clothing Predictions</h2>
		  {renderPredictionData(clothingPredictions)}
		  
		  <h2>Subcategory Predictions</h2>
		  <div className="mb-3">
		  <input
		    type="text"
			className="form-control"
			placeholder="Enter subcategory"
			value={selectedSubcategory}
			onChange={(e) => setSelectedSubcategory(e.target.value)}
	      />
		</div>
		<button onClick={() => fetchSubcategoryPredictions(selectedSubcategory)} className="btn btn-outline-primary mb-3">
		  Fetch Subcategory Predictions
		</button>
		{subcategoryPredictions.length > 0 && (
          <>
		    <h2>Predictions for {selectedSubcategory}</h2>
			{renderPredictionData(subcategoryPredictions)}
		  </>
		)}
      </div>
	  
	  <div className="col-md-6">
		<h2 className="mt-4">Clothing Predictions Graph</h2>
		<Line data={renderChart(clothingPredictions)} />

		{subcategoryPredictions.length > 0 && (
			<>
			  <h2 className="mt-4">Predictions for {selectedSubcategory} Graph</h2>
			  <Line data={renderChart(subcategoryPredictions)} />
			</>
		  )}
		</div>
	  </div>
   </main>
   
   <footer className="text-muted py-4 bg-light">
     <div className="container text-center">
	   <p className="mb-0">Clothing Agency Dashboard</p>
	   <p><a href="#">Back to top</a></p>
	 </div>
   </footer>
   
   <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" />
  </>
 );
}