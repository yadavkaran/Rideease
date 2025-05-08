import axios from "axios";
import { use } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_MAPS_API;

export const searchRide = async (startLat, startLng, endLat, endLng) => {
  try {
    console.log("\n=== FRONTEND: SEARCH RIDE START ===");
    console.log("1. Input coordinates:", { startLat, startLng, endLat, endLng });

    const userId = sessionStorage.getItem("userId");
    console.log("2. User ID from session:", userId);

    if (!userId) {
      console.log("ERROR: No user ID found in session");
      throw new Error("User not logged in. Please log in to search for rides.");
    }

    // Ensure all coordinates are valid numbers
    const payload = {
      uid: parseInt(userId),
      start_lat: parseFloat(startLat),
      start_long: parseFloat(startLng),
      end_lat: parseFloat(endLat),
      end_long: parseFloat(endLng),
    };

    console.log("3. Prepared payload:", payload);

    // Validate coordinates
    if (isNaN(payload.start_lat) || isNaN(payload.start_long) || 
        isNaN(payload.end_lat) || isNaN(payload.end_long)) {
      console.log("ERROR: Invalid coordinates in payload");
      throw new Error("Invalid coordinates provided.");
    }

    console.log("4. Sending request to:", `${API_URL}/hopin/search-active-rides`);
    const response = await axios.post(`${API_URL}/hopin/search-active-rides`, payload);
    console.log("5. Received response:", response.data);

    if (response.data.success) {
      console.log("6. Request successful");
      if (response.data.data.length === 0) {
        console.log("7. No rides found");
        throw new Error("No rides available in your area.");
      }
      console.log("7. Found rides:", response.data.data.length);
      return response.data.data;
    } else {
      console.log("6. Request failed:", response.data.message);
      throw new Error(response.data.message || "Failed to search for rides.");
    }
  } catch (error) {
    console.error("\n=== FRONTEND: SEARCH RIDE ERROR ===");
    if (error.response) {
      console.error("Error response data:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to search for a ride."
      );
    } else {
      console.error("Error details:", error);
      throw new Error(error.message || "Unable to process your request. Please try again later.");
    }
  }
};

export const createRide = async (
  startLat,
  startLng,
  endLat,
  endLng,
  noOfSeats
) => {
  try {
    const response = await axios.post(`${API_URL}/hopin/carpool`, {
      uid: sessionStorage.getItem("userId"),
      start_lat: startLat,
      start_long: startLng,
      end_lat: endLat,
      end_long: endLng,
      no_of_seats: noOfSeats,
    });

    if (response.data) {
      console.log("Ride search results:", response.data);
      return response.data;
    }
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to search for a ride."
      );
    } else {
      console.error("Request error:", error.message);
      throw new Error(
        "Unable to process your request. Please try again later."
      );
    }
  }
};


export const writeReview = async (ride_id, rating, description) => {
  try {
    const response = await axios.post(`${API_URL}/hopin/review`, {
      ride_id: parseInt(ride_id),
      rating: rating,
      user_id: parseInt(sessionStorage.getItem("userId")),
      description: description
    });
    if (response.data.success) {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    return { success: false, message: 'An error occurred while submitting the review.' };
  }
};

export const fetchActiveRide = async () => {
  try {
    const response = await axios.post(`${API_URL}/hopin/activeride`, {
      uid: sessionStorage.getItem("userId"),
    });

    if (response.data) {
      console.log("Active ride details:", response.data);
      return response.data;
    }
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to fetch active ride details."
      );
    } else {
      console.error("Request error:", error.message);
      throw new Error(
        "Unable to process your request. Please try again later."
      );
    }
  }
};

export const updateRideStatus = async (rideStatus, rideId) => {
  try {
    const response = await axios.post(`${API_URL}/hopin/ridestatus`, {
      ride_status: rideStatus,
      ride_id: rideId,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.success) {
      console.log("Ride status updated:", response.data.data);
      return response.data;
    }
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to update ride status."
      );
    } else {
      console.error("Request error:", error.message);
      throw new Error(
        "Unable to process your request. Please try again later."
      );
    }
  }
};


export const getRideHistory = async (uid) => {
  console.log(uid)
  try {
    const response = await axios.post(`${API_URL}/hopin/ridehistory`, {
      uid: uid
    });
    return response.data.data; // Returns the data from the API
  } catch (error) {
    console.error("Error fetching ride history:", error.message);
    throw error; // Propagate error for handling in components
  }
};

// Function to convert coordinates to place name using Google Maps
export const getPlaceName = async (latitude, longitude) => {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      console.error('Google Maps API key is not configured');
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }

    console.log('Fetching place name for coordinates:', latitude, longitude);
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (response.data.results && response.data.results.length > 0) {
      const placeName = response.data.results[0].formatted_address;
      console.log('Found place name:', placeName);
      return placeName;
    }
    console.log('No place name found, using coordinates');
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  } catch (error) {
    console.error('Error getting place name:', error);
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }
};