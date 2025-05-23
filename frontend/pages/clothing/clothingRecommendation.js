import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import BarChart from './barchart';
import dynamic from 'next/dynamic';
import { useAuth } from '../../src/contexts/AuthorisationContext';

const RetailersMap = dynamic(
	() => import('/src/components/RetailersMap'),
	{ ssr: false }
);

const TrendingPage = () => {
	const { currentUser } = useAuth();

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

	useEffect(() => {
		if (!currentUser) window.location.href = '/login';
	}, [currentUser]);

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
			const res = await fetch(`http://localhost:8080/api/saveRetailer?userId=${currentUser.id}`, {
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

	const isZaraProduct = selectedProduct && trendingData["Zara_Only_Items"]
		&& Object.prototype.hasOwnProperty.call(trendingData["Zara_Only_Items"], selectedProduct);

	const itemsYouSellProducts = trendingData["Items_You_Sell_Only"]
		? Object.keys(trendingData["Items_You_Sell_Only"])
		: [];
	const itemsYouSellValues = trendingData["Items_You_Sell_Only"]
		? Object.values(trendingData["Items_You_Sell_Only"])
		: [];

	const zaraItemsProducts = trendingData["Zara_Only_Items"]
		? Object.keys(trendingData["Zara_Only_Items"])
		: [];
	const zaraItemsValues = trendingData["Zara_Only_Items"]
		? Object.values(trendingData["Zara_Only_Items"])
		: [];

	const commonItemsProducts = trendingData["Items_You_Sell_That_Zara_Sells"]
		? Object.keys(trendingData["Items_You_Sell_That_Zara_Sells"])
		: [];
	const commonItemsValues = trendingData["Items_You_Sell_That_Zara_Sells"]
		? Object.values(trendingData["Items_You_Sell_That_Zara_Sells"])
		: [];


	return (
		<>
			<Head>
				<title>Trending Products Dashboard</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link
					rel="stylesheet"
					href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
				/>
			</Head>

			<header>
				<nav className="navbar navbar-dark bg-dark shadow-sm">
					<div className="container">
						<a href="#" className="navbar-brand">
							Trending Dashboard
						</a>
					</div>
				</nav>
			</header>

			<main className="container my-5">
				<h1 className="mb-4">Trending Products</h1>
				<p className="lead text-muted mb-4">
					Select a product and enter a city to find recommended retailers for that product.
				</p>
				{loadingTrending && <p>Loading trending products...</p>}
				{errorTrending && <p className="text-danger">{errorTrending}</p>}

				{!loadingTrending &&
					trendingData["Items_You_Sell_Only"] &&
					trendingData["Zara_Only_Items"] &&
					trendingData["Items_You_Sell_That_Zara_Sells"] && (
						<div className="row">
							<div className="col-md-4 mb-3">
								<div className="card h-100 shadow-sm">
									<div className="card-body">
										<h5 className="card-title">
											Items for Sale Trending on Google
										</h5>
										<ul className="list-group list-group-flush">
											{Object.keys(trendingData["Items_You_Sell_Only"])
												.sort(
													(a, b) =>
														trendingData["Items_You_Sell_Only"][b] -
														trendingData["Items_You_Sell_Only"][a]
												)
												.map((category, idx) => (
													<li
														key={idx}
														className="list-group-item list-group-item-action"
														style={{ cursor: 'pointer' }}
														onClick={() => {
															setSelectedProduct(category);
															setRetailers([]);
															setCity('');
														}}
													>
														<strong>{category}</strong>:{" "}
														{Number(trendingData["Items_You_Sell_Only"][category]).toFixed(2)}
													</li>
												))}
										</ul>
									</div>
								</div>
							</div>
							<div className="col-md-4 mb-3">
								<div className="card h-100 shadow-sm">
									<div className="card-body">
										<h5 className="card-title">Zara Items Trending on Google</h5>
										<ul className="list-group list-group-flush">
											{Object.keys(trendingData["Zara_Only_Items"])
												.sort(
													(a, b) =>
														trendingData["Zara_Only_Items"][b] -
														trendingData["Zara_Only_Items"][a]
												)
												.map((category, idx) => (
													<li
														key={idx}
														className="list-group-item list-group-item-action"
														style={{ cursor: 'pointer' }}
														onClick={() => {
															setSelectedProduct(category);
															setRetailers([]);
															setCity('');
														}}
													>
														<strong>{category}</strong>:{" "}
														{Number(trendingData["Zara_Only_Items"][category]).toFixed(2)}
													</li>
												))}
										</ul>
									</div>
								</div>
							</div>
							<div className="col-md-4 mb-3">
								<div className="card h-100 shadow-sm">
									<div className="card-body">
										<h5 className="card-title">Common Items Trending on Google</h5>
										<ul className="list-group list-group-flush">
											{Object.keys(trendingData["Items_You_Sell_That_Zara_Sells"])
												.sort(
													(a, b) =>
														trendingData["Items_You_Sell_That_Zara_Sells"][b] -
														trendingData["Items_You_Sell_That_Zara_Sells"][a]
												)
												.map((category, idx) => (
													<li
														key={idx}
														className="list-group-item list-group-item-action"
														style={{ cursor: 'pointer' }}
														onClick={() => {
															setSelectedProduct(category);
															setRetailers([]);
															setCity('');
														}}
													>
														<strong>{category}</strong>:{" "}
														{Number(trendingData["Items_You_Sell_That_Zara_Sells"][category]).toFixed(2)}
													</li>
												))}
										</ul>
									</div>
								</div>
							</div>
						</div>
					)}

				{selectedProduct && retailers.length === 0 && (
					<div className="card my-4 shadow-sm">
						<div className="card-body">
							<h2 className="card-title">Selected Product: {selectedProduct}</h2>
							<div className="mb-3">
								<label className="form-label">Select City:</label>
								<select
									className="form-select"
									value={city}
									onChange={(e) => setCity(e.target.value)}
								>
									<option value="">Choose a city</option>
									<option value="Dublin">Dublin</option>
									<option value="Cork">Cork</option>
									<option value="Athlone">Athlone</option>
									<option value="Galway">Galway</option>
									<option value="Kilkenny">Kilkenny</option>
									<option value="Letterkenny">Letterkenny</option>
									<option value="Limerick">Limerick</option>
									<option value="Waterford">Waterford</option>
									<option value="Wexford">Wexford</option>
									<option value="Belfast">Belfast</option>
									<option value="Newry">Newry</option>
									<option value="Carlow">Carlow</option>
									<option value="Ennis">Ennis</option>
									<option value="Derry">Derry</option>
									<option value="Tralee">Tralee</option>
								</select>
							</div>
							<button onClick={fetchRetailers} className="btn btn-primary">
								Get Retailers
							</button>
						</div>
					</div>
				)}

				{loadingRetailers && <p>Loading retailer recommendations...</p>}
				{errorRetailers && <p className="text-danger">{errorRetailers}</p>}
				{retailers.length > 0 && (
					<div className="my-4">
						<h2 className="mb-3">
							Recommended Retailers for {selectedProduct} in {city}
						</h2>
						<ul className="list-group mb-3">
							{retailers.map((store, idx) => (
								<li key={idx} className="list-group-item">
									<strong>{store.name}</strong> <br />
									{store.address} <br />
									Rating: {store.rating} (Popularity: {store.popularity}) <br />
									{!isZaraProduct && (
										<button
											onClick={() => handleSaveRetailer(store)}
											className="btn btn-sm btn-outline-primary mt-2"
										>
											Save To Potentially Sell To
										</button>
									)}
								</li>
							))}
						</ul>
						<div className="card">
							<div className="card-body p-0">
								<RetailersMap retailers={retailers} />
							</div>
						</div>
					</div>
				)}
				{trendingData["Items_You_Sell_Only"] && (
					<div className="my-5">
						<h2 className="mb-3">Trending Bar Chart: Items for Sale</h2>
						<BarChart
							labels={itemsYouSellProducts}
							dataset={itemsYouSellValues}
							chartTitle="Items You Sell"
						/>
					</div>
				)}
				{trendingData["Zara_Only_Items"] && (
					<div className="my-5">
						<h2 className="mb-3">Trending Bar Chart: Zara Items</h2>
						<BarChart
							labels={zaraItemsProducts}
							dataset={zaraItemsValues}
							chartTitle="Zara Only Items"
						/>
					</div>
				)}
				{trendingData["Items_You_Sell_That_Zara_Sells"] && (
					<div className="my-5">
						<h2 className="mb-3">Trending Bar Chart: Common Items</h2>
						<BarChart
							labels={commonItemsProducts}
							dataset={commonItemsValues}
							chartTitle="Common Items"
						/>
					</div>
				)}
			</main>

			<footer className="text-muted py-4 bg-light">
				<div className="container text-center">
					<p className="mb-0">Trending Products Dashboard</p>
					<p>
						<a href="#">Back to top</a>
					</p>
				</div>
			</footer>

			<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" />
		</>
	);
};
export default TrendingPage;