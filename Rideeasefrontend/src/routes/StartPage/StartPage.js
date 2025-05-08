import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "./Startpage.css";

import img1 from "../../assets/image1.png";
import img2 from "../../assets/image2.png";
import img3 from "../../assets/image3.png";
import img4 from "../../assets/image1.png";
import img5 from "../../assets/image5.png";

const reviews = [
  { name: "Emily R.", comment: "Best ride experience! The driver was punctual and friendly. ⭐⭐⭐⭐⭐" },
  { name: "Jake P.", comment: "Super affordable and safe. Highly recommend! ⭐⭐⭐⭐⭐" },
  { name: "Sophia L.", comment: "Amazing service! My ride was smooth and comfortable. ⭐⭐⭐⭐⭐" },
  { name: "Michael B.", comment: "Easy to book, and drivers are very professional. ⭐⭐⭐⭐⭐" },
  { name: "Emma W.", comment: "Loved it! Always my go-to ride service. ⭐⭐⭐⭐⭐" }
];

const StartPage = () => {
  const navigate = useNavigate();

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000
  };

  useEffect(()=>{
    if (sessionStorage.getItem("token") && sessionStorage.getItem("userId")) {
      navigate('/user-type');
    }
  })
  return (
    <div className="start-page">
      <nav className="navbar">
        <div className="logo">RideEase</div>
        <div className="nav-links">
          <Link to="/login" className="nav-btn">Login</Link>
          <Link to="/create-account" className="nav-btn signup">Sign Up</Link>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-content">
          <h1>Seamless Rides, Anytime, Anywhere</h1>
          <p>Your go-to app for safe, affordable, and reliable rides.</p>
          <Link to="/login" className="cta-btn">Book a Ride</Link>
        </div>
      </header>

      <section className="contrast-section">
        <div className="black-section">
          <h2>Why Choose RideEase?</h2>
          <p>Experience the convenience and affordability of modern carpooling.</p>
        </div>
        <div className="white-section">
          <h2>Join Our Community</h2>
          <p>Be part of a network that values safe and seamless transportation.</p>
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <img src={img1} alt="Recent Activity" className="feature-img large"/>
          <div className="feature-text">
            <h2>Log in to see your recent activity</h2>
            <p>View past trips, ride suggestions, and support resources.</p>
            <Link to="/login" className="feature-btn">Log in to your account</Link>
          </div>
        </div>

        <div className="feature feature-reverse">
        <img src={img2} alt="Business Solutions" className="feature-img large"/>
        <div className="feature-text">
            <h2>Drive when you want, earn what you need</h2>
            <p>Set your schedule, pick your rides, and start earning.</p>
            <Link to="/create-account" className="feature-btn">Get started</Link>
          </div>
       </div>

        <div className="feature">
          <img src={img3} alt="Business Solutions" className="feature-img large"/>
          <div className="feature-text">
            <h2>The RideEase you know, reimagined for business</h2>
            <p>Manage rides for companies with ease.</p>
            <Link to="/business" className="feature-btn">Check out our solutions</Link>
          </div>
        </div>

        <div className="feature feature-reverse">
        <img src={img2} alt="Business Solutions" className="feature-img large"/>
        <div className="feature-text">
            <h2>Save and earn on RideEase</h2>
            <p>Exclusive deals with our membership.</p>
            <Link to="/membership" className="feature-btn">Learn More</Link>
          </div>
        </div>

      </section>

      <section className="reviews">
        <h2>What Our Riders Say</h2>
        <Slider {...sliderSettings}>
          {reviews.map((review, index) => (
            <div key={index} className="review-card">
              <p className="review-text">"{review.comment}"</p>
              <p className="reviewer">- {review.name}</p>
            </div>
          ))}
        </Slider>
      </section>

      <footer className="footer">
        <p>© 2025 RideEase. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default StartPage;
