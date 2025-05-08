import React, { useEffect, useState } from "react";
import { fetchActiveRide, updateRideStatus } from "../../service/RideService";
import { useNavigate } from "react-router-dom";
import { Alert } from "../../components/Alert";
import RideProgressBar from "../../components/RideProgressBar";
import "./ActiveRide.css"; // Import the updated CSS

const ActiveRide = () => {
  const [ride, setRide] = useState(null);
  const [error, setError] = useState(null);
  const userID = sessionStorage.getItem("userId");
  const [rideStatus, setRideStatus] = useState(0);
  const [btnValue, setBtnValue] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const navigate = useNavigate();

  const handleRideStatus = async () => {
    let updated_status = "";

    if (rideStatus == 0) {
      Alert.success("Ride Started!");
      updated_status = "1";
    } else if (rideStatus == 1) {
      updated_status = "2";
      navigate("/home");
      Alert.success("Ride Ended Successfully!");
    } else {
      return;
    }
    await updateRideStatus(updated_status, ride.ride_id)
      .then((data) => {
        setRideStatus(updated_status);
        setBtnValue(getStatus(updated_status));
      })
      .catch((err) => {
        console.error("Error:", err.message);
      });
  };

  const getStatus = (status) => {
    if (status == 0) {
      return "Start Ride";
    }
    if (status == 1) {
      return "End Ride";
    }
    if (status == 2) {
      return "Ride Ended";
    }
  };

  const generateMapUrl = (start, end) => {
    const baseUrl = "https://www.google.com/maps/embed/v1/directions";
    const apiKey = process.env.REACT_APP_MAPS_API || "";
    const origin = `${start.coordinates[1]},${start.coordinates[0]}`;
    const destination = `${end.coordinates[1]},${end.coordinates[0]}`;
    const new_url = `${baseUrl}?key=${apiKey}&origin=${origin}&destination=${destination}&mode=driving`;
    console.log(new_url);
    return new_url;
  };

  useEffect(() => {
    const fetchRideData = async () => {
      try {
        const result = await fetchActiveRide();
        if (result.success && result.data) {
          setRide(result.data);
          setRideStatus(result.data.is_active);
          setBtnValue(getStatus(result.data.is_active));
          setMapUrl(generateMapUrl(result.data.start_location, result.data.end_location));
        } else if (result.success && result.data === null) {
          setError("No active rides available.");
        } else {
          setError("Failed to fetch ride details.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRideData();
  }, []);

  return (
    <div className="search-ride-container">
      <h1 className="title">Ride Details #{ride?.ride_id}</h1>
      <RideProgressBar rideStatus={rideStatus} />
      {ride ? (
        <div style={{ textAlign: "center" }}>
          <p>
            <strong>Start Time:</strong>{" "}
            {new Date(ride.start_time).toLocaleString()}
          </p>
          <p>
            <strong>Seats Available:</strong> {ride.seat_available}
          </p>

          {ride.carpool_owner == userID ? (
            <button className="button" onClick={handleRideStatus}>
              {btnValue}
            </button>
          ) : null}
          <div className="iframe-container">
            <iframe
              src={mapUrl}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      ) : (
        <p className="loading-message">No active rides available.</p>
      )}
    </div>
  );
};

export default ActiveRide;