import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { writeReview } from "../../service/RideService";
import { Alert } from "../../components/Alert";
import "./WriteReview.css";

const WriteReview = () => {
  const { rideId } = useParams();
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await writeReview(rideId, rating, description);
      navigate("/ratings");
      if (response.success) {
        Alert.success(response.message);
      } else {
        Alert.error(response.message || "Failed to submit review.");
      }
    } catch (error) {
      Alert.error("An error occurred while submitting the review.");
      console.error(error);
    }
  };

  return (
    <div className="write-review-container">
      <h2>Write a Review for Ride {rideId}</h2>

      <div style={{ marginBottom: "1.5rem" }}>
        <label htmlFor="description" className="description-label">
          Description:
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="5"
          placeholder="Write your review here..."
          className="description-textarea"
        />
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label className="rating-label">Rating:</label>
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((value) => (
            <FaStar
              key={value}
              className={`star ${value <= rating ? "active" : ""}`}
              onClick={() => setRating(value)}
            />
          ))}
        </div>
      </div>

      <button onClick={handleSubmit} className="submit-button">
        Submit Review
      </button>

      {message && (
        <p
          className={`response-message ${
            message.includes("successfully") ? "success" : "error"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default WriteReview;