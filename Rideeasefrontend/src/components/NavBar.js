// NavbarComponent.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import "./NavBar.css";
import { logout } from "../service/AuthService";

const NavbarComponent = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/home" className="navbar-brand">
          Rideease
        </Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
          <Nav.Link as={Link} to="/profile" className="nav-link">
              Profile
            </Nav.Link>
          <Nav.Link as={Link} to="/active-ride" className="nav-link">
              Active Rides
            </Nav.Link>
            <Nav.Link as={Link} to="/ride-history" className="nav-link">
              Ride History
            </Nav.Link>
            <Nav.Link as={Link} to="/user-type" className="nav-link">
              Change User
            </Nav.Link>
            <Nav.Link as={Link} to="/ratings" className="nav-link">
              View Rating
            </Nav.Link>
            <Nav.Link as={Link} to="/contact-us" className="nav-link">
              Contact Us
            </Nav.Link>
            <Nav.Link onClick={handleLogout} className="nav-link logout-link">
              <i className="fas fa-sign-out-alt"></i> Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
