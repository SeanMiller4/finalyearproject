import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: 53.3498, 
  lng: -6.2603, 
};

function MapComponent({ retailers }) {
  return (
    <LoadScript googleMapsApiKey="AIzaSyCfzvUFO8pvBPsPLCxkr0qkhG41w9QVLLQ">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
      >
        {retailers.map((retailer, index) => (
          <Marker
            key={index}
            position={{ lat: retailer.latitude, lng: retailer.longitude }}
            label={retailer.name}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default MapComponent;
