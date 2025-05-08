// src/components/CarInfo.js

import React, { useState, useEffect } from 'react';
import './CarInfo.css';

const CarInfo = () => {
  // vinInput is what the user types; currentVin is the VIN we use for fetching data.
  const [vinInput, setVinInput] = useState('');
  const [currentVin, setCurrentVin] = useState('');
  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // When currentVin changes, fetch the car data from the API.
  useEffect(() => {
    if (!currentVin) return;

    async function fetchCarData() {
      setLoading(true);
      setError(null);
      try {
        const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${currentVin}?format=json`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        setCarData(data);
      } catch (err) {
        setError(err.message);
        setCarData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchCarData();
  }, [currentVin]);

  // When the user submits the form, trigger the API call by setting currentVin
  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentVin(vinInput.trim());
  };

  return (
    <div className="car-info">
      <h2>Car Information</h2>
      {/* VIN Search Form */}
      <form onSubmit={handleSubmit} className="vin-form">
        <label>
          Enter VIN:
          <input
            type="text"
            value={vinInput}
            onChange={(e) => setVinInput(e.target.value)}
            placeholder="Enter VIN..."
            required
          />
        </label>
        <button type="submit">Search</button>
      </form>

      {/* Display loading, error or car information */}
      {loading && <div className="car-info-loading">Loading car information...</div>}
      {error && <div className="car-info-error">Error: {error}</div>}
      {carData && carData.Results && carData.Results.length > 0 && !loading && !error && (
        <div className="car-info-details">
          <p>
            <strong>VIN:</strong> {currentVin}
          </p>
          <p>
            <strong>Make:</strong> {carData.Results[0].Make || 'N/A'}
          </p>
          <p>
            <strong>Model:</strong> {carData.Results[0].Model || 'N/A'}
          </p>
          <p>
            <strong>Model Year:</strong> {carData.Results[0].ModelYear || 'N/A'}
          </p>
          <p>
            <strong>Vehicle Type:</strong> {carData.Results[0].VehicleType || 'N/A'}
          </p>
          {/* Add more fields as needed */}
        </div>
      )}
    </div>
  );
};

export default CarInfo;
