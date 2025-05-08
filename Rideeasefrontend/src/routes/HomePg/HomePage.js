import React from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';
import { logout } from '../../service/AuthService';
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import CarPool from "../CarPoolPg/CarPool"
import NavbarComponent from '../../components/NavBar';

const HomePage = () => {
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="landing-container">
      <NavbarComponent></NavbarComponent>
      <div className="map-container">
        <CarPool />
      </div>
    </div>
  );
};

export default HomePage;
