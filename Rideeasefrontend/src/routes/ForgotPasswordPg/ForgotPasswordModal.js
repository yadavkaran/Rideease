import React, { useState } from 'react';
import './ForgotPasswordModal.css';
import { forgotPassword } from '../../service/AuthService';
import { Alert } from '../../components/Alert';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async(e) => {
    e.preventDefault();
    onClose();
    await forgotPassword(email).then(data=>{
      Alert.success(data.message);
    },err=>{
      Alert.error("User does not exist");
    });

  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Reset Password</h2>
        <form onSubmit={handleForgotPassword}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Reset</button>
          <button type="button" onClick={onClose}>
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
