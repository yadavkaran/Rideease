import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import NavbarComponent from '../../components/NavBar';
import { searchRide, getPlaceName } from '../../service/RideService';
import { Alert } from '../../components/Alert';
import './SearchRide.css';

const SearchRide = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [availableRides, setAvailableRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationNames, setLocationNames] = useState({});

  const startLat = searchParams.get('startLat');
  const startLong = searchParams.get('startLong');
  const endLat = searchParams.get('endLat');
  const endLong = searchParams.get('endLong');

  // Function to get location names for a ride
  const getLocationNames = useCallback(async (ride) => {
    try {
      const [startName, endName] = await Promise.all([
        getPlaceName(
          ride.start_location.coordinates[1],
          ride.start_location.coordinates[0]
        ),
        getPlaceName(
          ride.end_location.coordinates[1],
          ride.end_location.coordinates[0]
        )
      ]);

      setLocationNames(prev => ({
        ...prev,
        [ride.ride_id]: { start: startName, end: endName }
      }));
    } catch (error) {
      console.error('Error fetching location names:', error);
    }
  }, []);

  useEffect(() => {
    if (!startLat || !startLong || !endLat || !endLong) {
      navigate('/home');
      return;
    }

    const fetchRides = async () => {
      try {
        setLoading(true);
        const rides = await searchRide(
          parseFloat(startLat),
          parseFloat(startLong),
          parseFloat(endLat),
          parseFloat(endLong)
        );
        setAvailableRides(rides);
        
        // Get location names for all rides immediately
        for (const ride of rides) {
          await getLocationNames(ride);
        }
        
        setError(null);
      } catch (err) {
        setError(err.message);
        Alert.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [startLat, startLong, endLat, endLong, navigate, getLocationNames]);

  const handleBookRide = (ride) => {
    navigate(`/payment?startLat=${startLat}&startLong=${startLong}&endLat=${endLat}&endLong=${endLong}&price=${ride.price}&rideId=${ride.ride_id}`);
  };

  if (loading) {
    return (
      <div className="search-ride-container">
        <NavbarComponent />
        <div className="loading-section">
          <div className="spinner"></div>
          <p>Searching for available rides...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-ride-container">
      <NavbarComponent />
      <div className="rides-section">
        <h2>Available Rides</h2>
        {error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="rides-list">
            {availableRides.map((ride) => (
              <div key={ride.ride_id} className="ride-card">
                <div className="ride-info">
                  <div className="ride-header">
                    <div className="price-tag">${ride.price ? ride.price.toFixed(2) : '0.00'}</div>
                    <div className="seats-available">{ride.seat_available} seats left</div>
                  </div>
                  
                  <div className="distance-info">
                    <div className="distance-detail">
                      <span className="distance-icon pickup">📍</span>
                      <div className="distance-text">
                        <span className="distance-label">Pickup Distance:</span>
                        <span className="distance-value">
                          {ride.startDistance ? `${ride.startDistance.toFixed(2)} miles` : 'Nearby'}
                        </span>
                      </div>
                    </div>
                    <div className="distance-detail">
                      <span className="distance-icon dropoff">🏁</span>
                      <div className="distance-text">
                        <span className="distance-label">Drop-off Distance:</span>
                        <span className="distance-value">
                          {ride.endDistance ? `${ride.endDistance.toFixed(2)} miles` : 'Nearby'}
                        </span>
                      </div>
                    </div>
                    <div className="total-distance">
                      <span className="distance-label">Total Trip Distance:</span>
                      <span className="distance-value">
                        {ride.totalDistance ? `${ride.totalDistance.toFixed(2)} miles` : 'Calculating...'}
                      </span>
                    </div>
                  </div>

                  <div className="locations-info">
                    <div className="location-detail">
                      <span className="label">Pickup Location</span>
                      <span className="location-name">
                        {locationNames[ride.ride_id]?.start || 'Loading location...'}
                      </span>
                    </div>
                    <div className="location-detail">
                      <span className="label">Drop-off Location</span>
                      <span className="location-name">
                        {locationNames[ride.ride_id]?.end || 'Loading location...'}
                      </span>
                    </div>
                  </div>

                  <div className="owner-info">
                    <span className="label">Carpool Owner:</span>
                    <span className="owner-id">#{ride.carpool_owner || 'Unknown'}</span>
                  </div>
                </div>
                
                <button 
                  className="book-button"
                  onClick={() => handleBookRide(ride)}
                >
                  Book This Ride
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchRide;
