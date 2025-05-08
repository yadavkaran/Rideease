import React, { useEffect, useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordModal from '../ForgotPasswordPg/ForgotPasswordModal';
import { login } from '../../service/AuthService';
import { Alert } from '../../components/Alert';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("token") && sessionStorage.getItem("userId")) {
      navigate('/user-type');
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
      Alert.success("Login successful!");
      navigate('/user-type');
    } catch (error) {
      Alert.error("Invalid email or password. Please try again.");
    }
  };

  const handleForgotPassword = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <img src="/images/car-icon.png" alt="Car icon with passengers" />
      </div>
      <form className="login-form" onSubmit={handleLogin}>
        <h1>Hop-In: Seamless Journey <br />Every Time!</h1>
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
        <label className="remember-me">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          Remember Me
        </label>
        <button type="submit">LOGIN</button>
        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate('/create-account')}
        >
          Create Account
        </button>
        <button
          type="button"
          className="secondary-button"
          onClick={handleForgotPassword}
        >
          Forgot Password
        </button>
      </form>

      {isModalOpen && (
        <ForgotPasswordModal
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Login;