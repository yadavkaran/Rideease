import { useEffect, useState } from "react";
import RatingCard from "../../components/RatingCard";
import axios from "axios";

const Rating = () => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.post(`${API_URL}/hopin/getreview`,{user_id: parseInt(sessionStorage.getItem("userId"))});
        if (response.data.success) {
          setReviews(response.data.data); // Set the actual reviews data from the API response
        } else {
          console.error("Failed to fetch reviews");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [API_URL]); // Empty dependency array ensures this runs once when the component mounts

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Ratings, Feedback, & Complaints</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {reviews.map((review) => (
          <RatingCard
            key={review._id} // Use the unique _id as the key
            rfc_id={review._id}
            rfc_description={review.description}
            ride_id={review.ride_id}
            user_id={review.user_id}
            date={new Date(review.created_at).toLocaleDateString()} // Format the date as needed
            rating={review.rating}
          />
        ))}
      </div>
    </div>
  );
};

export default Rating;
