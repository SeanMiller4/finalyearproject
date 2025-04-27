'use client';
import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const mapContainerStyle = {
	width: '100%',
	height: '400px'
};

const GOOGLE_MAPS_API_KEY = 'AIzaSyAuWC2auTkyqnJp6RXCyrpfdh5LlTCqHyo';

export default function RetailersMap({ retailers }) {
	const mapRef = useRef(null);

	useEffect(() => {
	    const loader = new Loader({
	      apiKey: GOOGLE_MAPS_API_KEY,
	      version: 'weekly'
	    });
		
		let map;
		loader.load().then(() => {
			map = new google.maps.Map(mapRef.current, {
				center: retailers.length
				? { lat: retailers[0].lat, lng: retailers[0].lng }
				: { lat: 53.3498, lng: -6.2603 },
				zoom: 13
			});
			
			retailers.forEach(store => {
				new google.maps.Marker({
					position: {lat: store.lat, lng: store.lng },
					map,
					title: store.name
				});
			});
		});
		
		return () => {};
		}, [retailers]);
		
		return <div ref={mapRef} style={mapContainerStyle} />;
}