import React, { useState, useEffect } from 'react'
import Head from 'next/head';

export default function ClothingTrends() {
	const [trends, setTrends] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchVogueTrends = async () => {
			try {
				const response = await fetch('http://localhost:8080/api/vogueTrending');
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				setTrends(data.trends);
			} catch (error) {
				console.error("Error fetching vogue trends:", error);
				setError("Error fetching vogue trends:" + error.message);
			}
			setLoading(false);
		};

		fetchVogueTrends();
	}, []);

	return (
		<>
			<Head>
				<title>Vogue Clothing Trends</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link
					rel="stylesheet"
					href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
				/>
			</Head>
			<div className="container mt-5">
				<h1 className="mb-4">Clothing Trends From Vogue's Fashion Page</h1>
				{loading && <p>Loading vogue trends...</p>}
				{error && (
					<div className="alert alert-danger" role="alert">
						{error}
					</div>
				)}
				{!loading && !error && trends.length > 0 && (
					<div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
						{trends.map((trend, index) => (
							<div className="col" key={index}>
								<div className="card h-100 shadow-sm">
									<div className="card-body">
										<h5 className="card-title">{trend.text}</h5>
										<p className="card-text">
											<a
												href={trend.url}
												target="_blank"
												rel="noopener noreferrer"
											>
												Click here to follow link
											</a>
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
				{!loading && !error && trends.length === 0 && (
					<div className="alert alert-info" role="alert">
						No trends found.
					</div>
				)}
			</div>
			<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
		</>
	);
}