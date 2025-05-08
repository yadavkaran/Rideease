import React from 'react';
import './User.css';
import { useNavigate } from 'react-router-dom';
import car_owner from "../../assets/car_owner.png";
import commuter from "../../assets/commuter.png";

function User() {
  const navigate = useNavigate();

  const onUserTypeSelected = (user_type) => {
    sessionStorage.setItem("user_type", user_type);
    navigate('/home');
  };

  return (
    <>
      <h1 className="web-title">Select User</h1>

      <div className="container">
        <div className="flip-card" onClick={() => onUserTypeSelected('commuter')}>
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <img src={commuter} alt="Commuter" className="image" />
              <h3 className="card-title">Commuter</h3>
            </div>
            <div className="flip-card-back">
              <h3>Commuter</h3>
              <p>
                A commuter is someone who joins an existing carpool to share rides
                with others. Save money, reduce traffic, and make new friends!
              </p>
            </div>
          </div>
        </div>

        <div className="flip-card" onClick={() => onUserTypeSelected('carpool-owner')}>
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <img src={car_owner} alt="Carpool Owner" className="image" />
              <h3 className="card-title">Carpool Owner</h3>
            </div>
            <div className="flip-card-back">
              <h3>Carpool Owner</h3>
              <p>
                A carpool owner creates and manages carpools. Offer rides to others,
                earn extra income, and contribute to a greener environment!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default User;