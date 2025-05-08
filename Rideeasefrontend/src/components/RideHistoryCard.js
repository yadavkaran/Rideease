import React from "react";
import { FaStar } from "react-icons/fa";

const RideHistoryCard = ({
  ride_id,
  carpool_owner_id,
  status,
  total_seats,
  start_location,
  end_location,
  commuter_id,
  onWriteReview,
}) => {
  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        padding: "1.5rem",
        marginBottom: "21rem",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        marginBottom: "2rem",
        maxWidth: "450px",
        margin: "0 auto",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: "1.3rem", fontWeight: "bold", margin: 0 }}>
          <strong>Ride ID:</strong> {ride_id}
        </p>

        <button
          style={{
            backgroundColor: "transparent",
            color: "#FFC700",
            border: "none",
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
          onClick={() => onWriteReview(ride_id)}
        >
          <FaStar /> Write a Review
        </button>
      </div>

      <hr style={{ border: "1px solid #ddd", margin: "0.5rem 0" }} />

      <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
        <strong>Carpool Owner ID:</strong> {carpool_owner_id}
      </p>
      <p style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
        <strong>Status:</strong> {status}
      </p>
      <p style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
        <strong>Total Seats:</strong> {total_seats}
      </p>
    
      <p style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
        <strong>Commuter IDs:</strong> {commuter_id.join(", ")}
      </p>
    </div>
  );
};

export default RideHistoryCard;
