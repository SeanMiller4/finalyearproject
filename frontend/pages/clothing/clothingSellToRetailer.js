import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../src/contexts/AuthorisationContext';

export default function SavedRetailers() {
	const { currentUser } = useAuth();

	useEffect(() => {
		if (!currentUser) window.location.href = '/login';
	}, [currentUser]);

	if (!currentUser) {
		return null;
	}

	const [retailers, setRetailers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [selectedRetailer, setSelectedRetailer] = useState(null);
	const [price, setPrice] = useState('');
	const [quantity, setQuantity] = useState('');
	const [orderStatus, setOrderStatus] = useState('');

	useEffect(() => {
		if (!currentUser || !currentUser.id) return;

		const fetchRetailers = async () => {
			setLoading(true);
			try {
				const response = await fetch(`http://localhost:8080/api/savedRetailers?userId=${currentUser.id}`);
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
	}, [currentUser.id]);

	const handleSellClick = (retailer) => {
		setSelectedRetailer(retailer);
		setPrice('');
		setQuantity('');
		setOrderStatus('');
	};

	const handleDeleteClick = async (id) => {
		if (!confirm('Are you sure you want to delete this retailer?')) return;
		const res = await fetch(`http://localhost:8080/api/retailers/${id}`,
			{ method: 'DELETE' }
		);
		setRetailers(prev => prev.filter(r => r.id !== id));
	};

	const handleOrderSubmit = async (e) => {
		e.preventDefault();

		const orderData = {
			retailer: selectedRetailer.name,
			product: selectedRetailer.product ? (selectedRetailer.product.name || selectedRetailer.product) : "",
			price: parseFloat(price),
			quantity: parseInt(quantity),
		};

		try {
			const res = await fetch('http://localhost:8080/api/orders', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(orderData),
			});

			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`);
			}

			const invoiceBlob = await res.blob();
			const invoiceUrl = window.URL.createObjectURL(invoiceBlob);
			window.open(invoiceUrl, '_blank');
			setOrderStatus('Order created successfully!');
		} catch (error) {
			console.error("Error creating order:", error);
			setOrderStatus('Error creating order.');
		}
	};

	return (
		<>
			<Head>
				<title>Saved Retailers - Clothing Dashboard</title>
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
					<h1 className="display-4 fw-bold">Saved Retailers</h1>
					<p className="lead text-muted">
						Manage your saved retailers and create orders seamlessly.
					</p>
				</div>
			</section>

			<div className="container mt-4">
				{loading && (
					<div className="alert alert-info">Loading saved retailers...</div>
				)}
				{error && (
					<div className="alert alert-danger">{error}</div>
				)}

				{!loading && !error && (
					<>
						{retailers.length === 0 ? (
							<div className="alert alert-warning">No retailers saved yet.</div>
						) : (
							<div className="row">
								{retailers.map((retailer) => (
									<div key={retailer.id} className="col-md-4 mb-4">
										<div className="card h-100">
											<div className="card-body">
												<h5 className="card-title">{retailer.name}</h5>
												<p className="card-text">{retailer.address}</p>
												<p className="card-text">
													Rating: {retailer.rating} | Popularity: {retailer.popularity}
												</p>
												<p className="card-text">
													Product:{" "}
													{retailer.product
														? retailer.product.name || retailer.product
														: "N/A"}
												</p>
											</div>
											<div className="card-footer">
												<button
													className="btn btn-primary"
													onClick={() => handleSellClick(retailer)}
												>
													Sell
												</button>
												<button
													className="btn btn-danger"
													onClick={() => handleDeleteClick(retailer.id)}
												>
													Delete
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
						)}

						{selectedRetailer && (
							<div className="card mt-4">
								<div className="card-header">
									Create Order for {selectedRetailer.name}
								</div>
								<div className="card-body">
									<p className="card-text">
										Product:{" "}
										{selectedRetailer.product
											? selectedRetailer.product.name || selectedRetailer.product
											: "No product available"}
									</p>
									<form onSubmit={handleOrderSubmit}>
										<div className="mb-3">
											<label className="form-label">Price (In Units):</label>
											<input
												type="number"
												step="0.5"
												className="form-control"
												value={price}
												onChange={(e) => setPrice(e.target.value)}
												required
											/>
										</div>
										<div className="mb-3">
											<label className="form-label">Quantity (In Units):</label>
											<input
												type="number"
												className="form-control"
												value={quantity}
												onChange={(e) => setQuantity(e.target.value)}
												required
											/>
										</div>
										<button type="submit" className="btn btn-success">
											Create Order &amp; Generate Invoice
										</button>
									</form>
									{orderStatus && (
										<div className="mt-3 alert alert-info">{orderStatus}</div>
									)}
								</div>
							</div>
						)}
					</>
				)}
			</div>

			<footer className="text-muted py-4 bg-light">
				<div className="container text-center">
					<p className="mb-0">Clothing Agency Dashboard</p>
					<p>
						<a href="#">Back to top</a>
					</p>
				</div>
			</footer>

			<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
		</>
	);
}		