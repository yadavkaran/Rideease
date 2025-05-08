import React, { useState } from "react";

const RatingCard = ({ rfc_description, ride_id, date, rating }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleDescription = () => {
    setExpanded(!expanded);
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "1rem",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        marginBottom: "1rem",
        width: "400px",
        height: "auto",
        margin: "0 auto",
        textAlign: "center",
        overflow: "hidden", 
        transition: "height 0.3s ease-in-out",
      }}
    >
      <p style={{ fontWeight: "bold" }}>
        Ride Id: {ride_id}
      </p>
      <hr style={{ border: "none", borderTop: "1px solid #ccc", margin: "0.5rem 0" }} />
      <p>
        <strong>Description:</strong>{" "}
        {expanded ? (
          rfc_description
        ) : (
          <>
            {rfc_description.length > 100
              ? `${rfc_description.slice(0, 100)}...`
              : rfc_description}
          </>
        )}
      </p>
      {rfc_description.length > 100 && (
        <button
          onClick={toggleDescription}
          style={{
            background: "none",
            border: "none",
            color: "#007BFF",
            cursor: "pointer",
            padding: "0",
            textDecoration: "underline",
            fontSize: "0.9rem",
          }}
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      )}
      <p>
        <strong>Date:</strong> {date}
      </p>
      <div>
        <strong>Rating:</strong>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "0.5rem" }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={{
                fontSize: "1.5rem",
                color: star <= rating ? "#FFD700" : "#ccc",
                marginRight: "0.5rem",
              }}
            >
              ★
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingCard;
