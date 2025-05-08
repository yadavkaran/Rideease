import express from "express";
import axios from "axios";
import cors from "cors";
import db from "../db/connection.js";
import bcrypt from "bcryptjs";
import RideDet from "../models/Ride_details.js";
import MessagesSch from "../models/message.js";
// import mongoose from "mongoose";

// Utility functions
function calculatePrice(start_lat, start_long, end_lat, end_long) {
  const distance = getDistanceFromLatLonInMiles(
    parseFloat(start_lat),
    parseFloat(start_long),
    parseFloat(end_lat),
    parseFloat(end_long)
  );
  
  // Base price $2 for first mile, then $1 per additional mile
  const basePrice = 2;
  const additionalPrice = Math.max(0, distance - 1);
  const totalPrice = basePrice + additionalPrice;
  
  // Round to 2 decimal places
  return Math.round(totalPrice * 100) / 100;
}

function getDistanceFromLatLonInMiles(lat1, lon1, lat2, lon2) {
  const R = 3963.2; // Radius of the earth in miles
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in miles
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

const hopinService = {
  createcarpool: async (body) => {
    try {
      if (
        body.uid &&
        body.start_lat &&
        body.start_long &&
        body.no_of_seats &&
        body.end_lat &&
        body.end_long
      ) {
        const fetch_ride = await RideDet.findOne({is_active: {$in: ["0","1"]},$or:[{carpool_owner: body.uid}]}).sort({$natural: -1}).exec();
        if(!fetch_ride){
          const newRideDetails = new RideDet({
            carpool_owner: body.uid,
            start_location: {
              type: "Point",
              coordinates: [body.start_long, body.start_lat],
            },
            end_location: {
              type: "Point",
              coordinates: [body.end_long, body.end_lat],
            },
            start_time: new Date(),
            is_active: "0",
            seat_available: body.no_of_seats,
          });
          const savedRideDetails = await newRideDetails.save();
          const key_message = savedRideDetails.ride_id + "_" + Date.now();
          let message_json_arr = {
            [key_message]: "Hello Commuters to your carpool, journey",
          };
          const messageNew = new MessagesSch({
            message_json: JSON.stringify(message_json_arr),
            ride_id: savedRideDetails.ride_id,
          });
          const mesaage_new_save = messageNew.save();
          return "New carpool created";
        } else{
          return "One carpool already active";
        }
      } else {
        return "Ride can not be created";
      }
    } catch (error) {
      return error.message;
    }
  },
  
  joincarpoolserv: async (body) => {
    try {
      if (
        body.uid &&
        body.start_lat &&
        body.start_long &&
        body.end_lat &&
        body.end_long
      ) {
        const radiusInRadians = process.env.radiusInMiles / 3963.2;
        const findrides = await RideDet.find({
          start_location: {
            $geoWithin: {
              $centerSphere: [
                [body.start_long, body.start_lat],
                radiusInRadians,
              ],
            },
          },
          end_location: {
            $geoWithin: {
              $centerSphere: [[body.end_long, body.end_lat], radiusInRadians],
            },
          },
          is_active: 0,
          seat_available: { $gte: 1 },
        }).exec();
        let return_data = "";
        if (findrides.length >= 1) {
          let commuter_id_new = findrides[0]["commuter_id"];
          let seats_avaialble = Number(findrides[0]["seat_available"]) - 1;
          commuter_id_new.push(Number(body.uid));
          const update_ride = RideDet.updateOne(
            { ride_id: findrides[0]["ride_id"] },
            { $set: { commuter_id: commuter_id_new, seat_available: seats_avaialble} }
          ).exec();
          findrides[0]["commuter_id"] = commuter_id_new;
          return_data = findrides[0];
        } else {
          return_data = "No rides found";
        }
        return return_data;
      } else {
        return "Necessary co-ordinates missing";
      }
    } catch (error) {
      return error.message;
    }
  },

  writeReview: async (body) => {
    try {
      const { ride_id, user_id, rating, description } = body;

      // Input validation
      if (!ride_id || !user_id || rating === undefined || !description) {
        return { success: false, message: "Invalid data" };
      }

      if (typeof rating !== "number" || rating < 0 || rating > 5) {
        return { success: false, message: "Rating must be between 0 and 5" };
      }
      // Check if the ride exists
      const ride = await db
        .collection("ride_details")
        .findOne({ ride_id: ride_id });
      console.log(ride);
      if (!ride) {
        return { success: false, message: "Ride not found" };
      }

      // Save the review
      const review = {
        ride_id,
        user_id,
        rating,
        description,
        created_at: new Date(),
      };

      const result = await db.collection("reviews").insertOne(review);

      if (!result.insertedId) {
        return { success: false, message: "Failed to save the review" };
      }

      return { success: true, message: "Review submitted successfully" };
    } catch (err) {
      console.error("Write review error:", err.message);
      return {
        success: false,
        message: "An error occurred while submitting the review",
      };
    }
  },

  maproutenew: async (body) => {
    try {
      const HOPIN_MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;
      if (
        !body.origin_lat ||
        !body.origin_long ||
        !body.destination_lat ||
        !body.destination_long
      ) {
        return res
          .status(400)
          .json({ error: "Origin and destination are required." });
      }
      const response = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${body.origin_long},${body.origin_lat};${body.destination_long},${body.destination_lat}`,
        {
          params: {
            geometries: "geojson",
            access_token: HOPIN_MAPBOX_ACCESS_TOKEN,
          },
        }
      );
      return response.data;
    } catch (error) {
      return "Failed to fetch route data";
    }
  },
  getReviewsGiven: async (user_id) => {
    try {
      const reviews = await db
        .collection("reviews")
        .find({ user_id })
        .toArray();

      if (!reviews || reviews.length === 0) {
        return { success: false, message: "No reviews found for the user." };
      }

      return { success: true, data: reviews };
    } catch (error) {
      console.error("Error fetching reviews:", error.message);
      return {
        success: false,
        message: "An error occurred while fetching reviews.",
      };
    }
  },
  activeride: async (body) => {
    try{
        if(body.uid){
            const fetch_ride = await RideDet.findOne({is_active: {$in: ["0","1"]},$or:[{carpool_owner: body.uid},{commuter_id: body.uid}]}).sort({$natural: -1}).exec();
            return fetch_ride;
        } else{
            return "Cannot fecth Ride";
        }
    } catch(error){
        console.error("Active Ride Error:", error.message);
      return {
        success: false,
        message: "An error occurred while fetching ride details",
      };
    }
  },
  updateridestatus: async (body) => {
    try{
        if(body.ride_status && body.ride_id) {
            const update_ride = RideDet.updateOne(
                { ride_id: body.ride_id },
                { $set: { is_active: body.ride_status } }
            ).exec();
            return "Ride updated";
        }else{
            return "Necesaary information required to upate ride"
        }
    } catch (error){
        console.error("Ride Status Error:", error.message);
      return {
        success: false,
        message: "An error occurred while updating ride status",
      };
    }
  },
  ridehistory: async (body) => {
    try {
        if(body.uid){
            const ride_history = await RideDet.find({$or:[{carpool_owner:body.uid},{commuter_id:body.uid}]}).exec();
            return ride_history;
        }else{
            return "Provide user id to get ride history of user"
        }
    } catch (error){
        console.error("Ride History Error:", error.message);
      return {
        success: false,
        message: "An error occurred while getting ride history",
      };
    }
  },
  searchActiveRides: async (body) => {
    try {
      console.log("\n=== SEARCH ACTIVE RIDES DEBUG ===");
      console.log("1. Received request body:", body);

      // Validate required fields
      if (!body.uid) {
        console.log("ERROR: Missing user ID");
        return {
          success: false,
          message: "User ID is required"
        };
      }

      if (!body.start_lat || !body.start_long || !body.end_lat || !body.end_long) {
        console.log("ERROR: Missing coordinates:", { 
          start_lat: body.start_lat,
          start_long: body.start_long,
          end_lat: body.end_lat,
          end_long: body.end_long
        });
        return {
          success: false,
          message: "Start and end coordinates are required"
        };
      }

      // Validate coordinate types
      const coordinates = {
        start_lat: parseFloat(body.start_lat),
        start_long: parseFloat(body.start_long),
        end_lat: parseFloat(body.end_lat),
        end_long: parseFloat(body.end_long)
      };

      console.log("2. Parsed coordinates:", coordinates);

      if (Object.values(coordinates).some(isNaN)) {
        console.log("ERROR: Invalid coordinate values");
        return {
          success: false,
          message: "Invalid coordinate values provided"
        };
      }

      // Find all active rides that have seats and the user isn't involved in
      const availableRides = await RideDet.find({
        is_active: {$in: ["0", "1"]},
        seat_available: { $gte: 1 },
        carpool_owner: { $ne: parseInt(body.uid) },
        commuter_id: { $nin: [parseInt(body.uid)] }
      }).exec();

      console.log("9. Found active rides:", availableRides.length);

      // Calculate distances and sort by total distance
      const ridesWithDistances = availableRides.map(ride => {
        const startDistance = getDistanceFromLatLonInMiles(
          coordinates.start_lat,
          coordinates.start_long,
          ride.start_location.coordinates[1],
          ride.start_location.coordinates[0]
        );
        const endDistance = getDistanceFromLatLonInMiles(
          coordinates.end_lat,
          coordinates.end_long,
          ride.end_location.coordinates[1],
          ride.end_location.coordinates[0]
        );
        // Calculate price using ride's coordinates
        const price = calculatePrice(
          ride.start_location.coordinates[1],  // ride's start latitude
          ride.start_location.coordinates[0],  // ride's start longitude
          ride.end_location.coordinates[1],    // ride's end latitude
          ride.end_location.coordinates[0]     // ride's end longitude
        );
        return {
          ...ride.toObject(),
          startDistance,
          endDistance,
          totalDistance: startDistance + endDistance,
          price
        };
      });

      // Sort rides by total distance
      ridesWithDistances.sort((a, b) => a.totalDistance - b.totalDistance);

      console.log("10. Rides with distances:", 
        JSON.stringify(ridesWithDistances.map(ride => ({
          ride_id: ride.ride_id,
          start: ride.start_location.coordinates,
          end: ride.end_location.coordinates,
          startDistance: ride.startDistance.toFixed(2) + " miles",
          endDistance: ride.endDistance.toFixed(2) + " miles",
          totalDistance: ride.totalDistance.toFixed(2) + " miles",
          price: ride.price
        })), null, 2)
      );

      if (ridesWithDistances.length === 0) {
        console.log("11. No rides found");
        return {
          success: true,
          data: [],
          message: "No active rides found"
        };
      }

      console.log("12. Successfully found and sorted rides");
      return {
        success: true,
        data: ridesWithDistances,
        message: "Active rides found"
      };
    } catch (error) {
      console.error("=== SEARCH ACTIVE RIDES ERROR ===");
      console.error("Error details:", error);
      console.error("Stack trace:", error.stack);
      return {
        success: false,
        message: "An error occurred while searching for rides: " + error.message
      };
    }
  }
};

export default hopinService;
