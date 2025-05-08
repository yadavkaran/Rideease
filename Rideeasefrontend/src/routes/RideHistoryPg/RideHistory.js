import React, { useEffect, useState } from "react";
import RideHistoryCard from "../../components/RideHistoryCard";
import { useNavigate } from "react-router-dom";
import { getRideHistory } from "../../service/RideService";
import "./RideHistory.css";

const RideHistory = () => {
  const [rideHistoryList, setRideHistoryList] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  const getStatus = (status) => {
    if (status == 0) {
      return "Ride Not Started";
    }
    if (status == 1) {
      return "Ride In Progress";
    }
    if (status == 2) {
      return "Ride Ended";
    }
  };

  useEffect(() => {
    
    const fetchRideHistory = async () => {
      try {
        const data = await getRideHistory(sessionStorage.getItem("userId"));
        setRideHistoryList(data); 
        window.scrollTo(0, 0);
      } catch (err) {
        setError("Failed to load ride history");
      } finally {
        setLoading(false); 
      }
    };

    fetchRideHistory();
  }, []);

  const handleReview = (rideId) => {
    navigate(`/write-review/${rideId}`);
  };

  if (loading) {
    return <div className="loading-message">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="ride-history-page">
    <h1 className="ride-history-title">Ride History</h1>
    <div className="ride-history-container">
      <div className="ride-history-list">
        {rideHistoryList.map((ride) => (
          <RideHistoryCard
            key={ride.ride_id}
            ride_id={ride.ride_id}
            carpool_owner_id={ride.carpool_owner}
            status={getStatus(ride.is_active)} 
            total_seats={ride.seat_available}
            start_location={`Lat: ${ride.start_location.coordinates[1]}, Long: ${ride.start_location.coordinates[0]}`} 
            end_location={`Lat: ${ride.end_location.coordinates[1]}, Long: ${ride.end_location.coordinates[0]}`}
            commuter_id={ride.commuter_id}
            message_id={ride._id} 
            onWriteReview={handleReview}
          />
        ))}
      </div>
    </div>
    </div>
  );
};

export default RideHistory;