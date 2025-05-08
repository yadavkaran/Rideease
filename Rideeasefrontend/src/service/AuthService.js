import axios from "axios";
import { Alert } from "../components/Alert";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

/**
 * Sign-up function to register a new user with first name and last name.
 * @param {string} firstName - The user's first name.
 * @param {string} lastName - The user's last name.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @param {string} contact_no - The user's conatct_no.
 */
export const signup = async (firstName, lastName, email, password, contact_no) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, {
      firstName,
      lastName,
      email,
      password,
      contact_no,
    });
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Sign-up failed");
    } else {
      throw new Error("Unable to complete sign-up. Please try again later.");
    }
  }
};

/**
 * Login function for user authentication.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 */
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    if (!response.data.token || !response.data.uid) {
      throw new Error("Login failed: Missing token or user ID");
    }

    sessionStorage.setItem("token", response.data.token);
    sessionStorage.setItem("userId", response.data.uid.toString());
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Login failed");
    } else {
      throw new Error("Unable to complete login. Please try again later.");
    }
  }
};

/**
 * Logout function to clear session and redirect to login.
 * @param {function} navigate - React Router's navigate function.
 */
export const logout = (navigate) => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("userId");
  sessionStorage.removeItem("user_type");
  navigate("/login");
  Alert.success("Logout Successful!");
};

/**
 * Forgot password function to request a password reset email.
 * @param {string} email - The user's email address.
 */
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, {
      email,
    });

    if (response.data.message) {
     return response.data;
    } else {
      Alert.info(
        "If the email is registered, you'll receive a reset link shortly."
      );
    }
  } catch (error) {
    if (error.response) {
      return "Failed to send reset email.";
    } else {
      return "Unable to process your request. Please try again later.";
    }
  }
};

/**
 * Reset password function to set a new password for the user.
 * @param {string} newPassword - The new password to be set.
 */
export const resetPassword = async (newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/auth/reset-password`, {
      password: newPassword,
    });

    if (response.status === 200) {
      Alert.success("Password has been successfully reset.");
      return response.data;
    } else {
      throw new Error("Failed to reset password.");
    }
  } catch (error) {
    Alert.error("Error resetting password. Please try again.");
    console.error("Error resetting password:", error);
    throw error;
  }
};
