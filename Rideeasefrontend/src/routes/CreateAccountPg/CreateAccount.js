import React, { useState } from 'react';
import './CreateAccount.css';
import { signup } from '../../service/AuthService';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CreateAccount = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact_no, setContact] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signup(firstName, lastName, email, password, contact_no);
      toast.success("User Created Successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="create-account-container">
      <ToastContainer />
      <div className="create-account-image">
        <img src="/images/car-icon.png" alt="Car icon with passengers" />
      </div>
      <form className="create-account-form" onSubmit={handleSignup}>
        <h1>Create an Account</h1>
        <div className="name-inputs">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Enter Contact Number"
          value={contact_no}
          onChange={(e) => {
            const newVal = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
            setContact(newVal);
          }}
          maxLength="10"
          pattern="[0-9]{10}"
          required
        />
       
        <button type="submit">Sign Up</button>
        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate('/login')}
        >
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default CreateAccount;