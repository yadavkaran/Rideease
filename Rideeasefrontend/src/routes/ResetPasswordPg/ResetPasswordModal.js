import React, { useState } from 'react';
import './ResetPasswordModal.css';
import { resetPassword } from '../../service/AuthService';

const ResetPasswordModal = ({ onClose }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      await resetPassword(newPassword);
      onClose();
    } catch (error) {
      setErrorMessage('Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Reset Password</h2>
        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit">Reset Password</button>
          <button type="button" onClick={onClose}>
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
