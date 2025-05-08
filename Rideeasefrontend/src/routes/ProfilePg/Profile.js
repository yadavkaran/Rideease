import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password123', // This will be encrypted
    phoneNumber: '123-456-7890',
    customerId: '', // Randomly generated
  });

  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const [tempUser, setTempUser] = useState({ ...user }); // Temporary state for editing

  // Function to encrypt the password
  const encryptPassword = (password) => {
    return '*'.repeat(password.length); // Simple encryption for demonstration
  };

  // Generate a random customer ID on component mount
  useEffect(() => {
    const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
    setUser((prevUser) => ({ ...prevUser, customerId: randomId }));
    setTempUser((prevUser) => ({ ...prevUser, customerId: randomId }));
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  // Save changes
  const handleSave = () => {
    setUser({ ...tempUser });
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  // Cancel editing
  const handleCancel = () => {
    setTempUser({ ...user });
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="profile-details">
        <div className="profile-item">
          <span className="label">First Name:</span>
          {isEditing ? (
            <input
              type="text"
              name="firstName"
              value={tempUser.firstName}
              onChange={handleInputChange}
              className="edit-input"
            />
          ) : (
            <span className="value">{user.firstName}</span>
          )}
        </div>
        <div className="profile-item">
          <span className="label">Last Name:</span>
          {isEditing ? (
            <input
              type="text"
              name="lastName"
              value={tempUser.lastName}
              onChange={handleInputChange}
              className="edit-input"
            />
          ) : (
            <span className="value">{user.lastName}</span>
          )}
        </div>
        <div className="profile-item">
          <span className="label">Email:</span>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={tempUser.email}
              onChange={handleInputChange}
              className="edit-input"
            />
          ) : (
            <span className="value">{user.email}</span>
          )}
        </div>
        <div className="profile-item">
          <span className="label">Password:</span>
          {isEditing ? (
            <input
              type="password"
              name="password"
              value={tempUser.password}
              onChange={handleInputChange}
              className="edit-input"
            />
          ) : (
            <span className="value">{encryptPassword(user.password)}</span>
          )}
        </div>
        <div className="profile-item">
          <span className="label">Phone Number:</span>
          {isEditing ? (
            <input
              type="text"
              name="phoneNumber"
              value={tempUser.phoneNumber}
              onChange={handleInputChange}
              className="edit-input"
            />
          ) : (
            <span className="value">{user.phoneNumber}</span>
          )}
        </div>
        <div className="profile-item">
          <span className="label">Customer ID:</span>
          <span className="value">{user.customerId}</span>
        </div>
      </div>
      <div className="profile-actions">
        {isEditing ? (
          <>
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </>
        ) : (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;