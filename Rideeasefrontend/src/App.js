import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./routes/LoginPg/Login";
import ChatRoom from "./routes/ChatPg/Chat";
import ForgotPasswordModal from "./routes/ForgotPasswordPg/ForgotPasswordModal";
import CreateAccount from "./routes/CreateAccountPg/CreateAccount";
import { ToastWrapper } from "./components/Alert";
import ProtectedRoute from "./service/ProtectedRoutes";
import Payment from "./routes/PaymentPg/Payment";
import Rating from "./routes/RatingPg/Rating";
import RideHistory from "./routes/RideHistoryPg/RideHistory";
import WriteReview from "./routes/WriteReviewPg/WriteReview";
import ResetPasswordModal from "./routes/ResetPasswordPg/ResetPasswordModal";
import User from "./routes/UserType/User";
import HomePage from "./routes/HomePg/HomePage";
import Message from "./routes/MessagePg/Message";
import StartPage from "./routes/StartPage/StartPage";
import Profile from "./routes/ProfilePg/Profile";
import ContactUs from "./routes/ContactUS/ContactUS";
import ActiveRide from "./routes/ActiveRidePg/ActiveRide";
import SearchRide from "./routes/SearchRidePg/SearchRide";

const App = () => {
  return (
    <Router>
      <ToastWrapper />
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/user-type" element={<ProtectedRoute element={<User />} />} />
        <Route path="/payment" element={<ProtectedRoute element={<Payment />} />} />
        <Route path="/home" element={<ProtectedRoute element={<HomePage />} />} />
        <Route path="/active-ride" element={<ProtectedRoute element={<ActiveRide />} />} />
        <Route path="/search-ride" element={<ProtectedRoute element={<SearchRide />} />} />
        <Route path="/chat" element={<ProtectedRoute element={<ChatRoom />} />} />
        <Route path="/forgot-password" element={<ForgotPasswordModal isOpen={true} onClose={() => {}} />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/ride-history" element={<ProtectedRoute element={<RideHistory />} />} />
        <Route path="/ratings" element={<ProtectedRoute element={<Rating />} />} />
        <Route path="/payment" element={<ProtectedRoute element={<Payment />} />} />
        <Route path="/message" element={<ProtectedRoute element={<Message />} />} />
        <Route path="/reset-password" element={<ResetPasswordModal isOpen={true} onClose={() => {}} />} />
        <Route path="/write-review/:rideId" element={<ProtectedRoute element={<WriteReview />} />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
