import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/contexts/AuthorisationContext';
import React, { useState, useEffect } from 'react';

export default function ClothingDashboard() {
	const router = useRouter();
	const { currentUser, logout } = useAuth();
	
	useEffect(() => {
		if(!currentUser) window.location.href = '/login';
	}, [currentUser]);
	
	if(!currentUser) {
		return null;
	}

	const handleLogout = async () => {
		await logout();
		alert('You are now logged out');
		router.pusg('/login');
	};

	const handleNavigation = (path) => {
		router.push(path);
	};

	return (
		<>
			<Head>
				<title>Clothing Dashboard</title>
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
					<h1 className="display-4 fw-bold">Clothing Dashboard</h1>
					<p className="lead text-muted">
						Manage your clothing agency with functions to see what clothing items are trending on Google, receive retailer recommendations for specific items of clothing, view social clothing trends and more.
					</p>
				</div>
			</section>

			<div className="album py-5 bg-light">
				<div className="container">
					<div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">

						<div className="col">
							<div className="card shadow-sm">
								<img
									src="/gtrends.png"
									alt="Clothing Trends"
									className="card-img-top"
									style={{ height: '225px', objectFit: 'cover' }}
								/>
								<div className="card-body">
									<p className="card-text">
										View Google Trends for clothes and request retailer recommendations.
									</p>
									<div className="d-flex justify-content-between align-items-center">
										<button
											onClick={() =>
												handleNavigation('/clothing/clothingRecommendation')
											}
											className="btn btn-sm btn-outline-primary"
										>
											Explore
										</button>
										<small className="text-muted">Updated recently</small>
									</div>
								</div>
							</div>
						</div>

						<div className="col">
							<div className="card shadow-sm">
								<img
									src="/vogue.png"
									alt="Clothing Trends"
									className="card-img-top"
									style={{ height: '225px', objectFit: 'cover' }}
								/>
								<div className="card-body">
									<p className="card-text">
										View Clothing Trends from Vogue and stay ahead of the curve.
									</p>
									<div className="d-flex justify-content-between align-items-center">
										<button
											onClick={() => handleNavigation('/clothing/clothingTrends')}
											className="btn btn-sm btn-outline-primary"
										>
											Explore
										</button>
										<small className="text-muted">Updated recently</small>
									</div>
								</div>
							</div>
						</div>

						<div className="col">
							<div className="card shadow-sm">
								<img
									src="/sell.png"
									alt="Clothing Trends"
									className="card-img-top"
									style={{ height: '225px', objectFit: 'cover' }}
								/>
								<div className="card-body">
									<p className="card-text">
										Sell to Retailer and generate automated clothing invoices.
									</p>
									<div className="d-flex justify-content-between align-items-center">
										<button
											onClick={() => handleNavigation('/clothing/clothingSellToRetailer')}
											className="btn btn-sm btn-outline-primary"
										>
											Explore
										</button>
										<small className="text-muted">Updated recently</small>
									</div>
								</div>
							</div>
						</div>

						<div className="col">
							<div className="card shadow-sm">
								<img
									src="/graph.png"
									alt="Clothing Trends"
									className="card-img-top"
									style={{ height: '225px', objectFit: 'cover' }}
								/>
								<div className="card-body">
									<p className="card-text">
										Forecast future clothing sales based on historical data.
									</p>
									<div className="d-flex justify-content-between align-items-center">
										<button
											onClick={() =>
												handleNavigation('/clothing/forecastClothingTrends')
											}
											className="btn btn-sm btn-outline-primary"
										>
											Explore
										</button>
										<small className="text-muted">Updated recently</small>
									</div>
								</div>
							</div>
						</div>

						<div className="col">
							<div className="card shadow-sm">
								<img
									src="/logout.png"
									alt="Clothing Trends"
									className="card-img-top"
									style={{ height: '225px', objectFit: 'cover' }}
								/>
								<div className="card-body">
									<p className="card-text">Click below to log out of your account.</p>
									<div className="d-flex justify-content-between align-items-center">
										<button
											onClick={handleLogout}
											className="btn btn-sm btn-outline-danger"
										>
											Logout
										</button>
										<small className="text-muted">Session active</small>
									</div>
								</div>
							</div>
						</div>

					</div>
				</div>
			</div>

			<footer className="text-muted py-4 bg-light">
				<div className="container text-center">
					<p className="mb-0">
						Clothing Agency Dashboard
					</p>
					<p>
						<a href="#">Back to top</a>
					</p>
				</div>
			</footer>

			<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" />
		</>
	);
}
