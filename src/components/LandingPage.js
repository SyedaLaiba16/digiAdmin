import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import './LandingPage.css';

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

function LandingPage() {
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    navigate('/login'); // Navigate to login page
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg bg-light navbar-light fixed-top shadow-sm px-5 py-3 py-lg-0">
        <a href="/" className="navbar-brand d-flex align-items-center p-0">
          <img
            src="/img/logo.png"
            alt="DigiLex Logo"
            style={{
              height: "55px",
              width: "55px",
              objectFit: "contain",
              marginRight: "8px",
            }}
          />
          <h1 className="m-0 text-primary" style={{ fontSize: "28px" }}>
            DigiLex
          </h1>
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
        >
          <span className="fa fa-bars"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarCollapse">
          <div className="navbar-nav ms-auto py-0 pe-4 border-end border-2">
            <a href="#home" className="nav-item nav-link active">
              Home
            </a>
            <a href="#about" className="nav-item nav-link">
              About
            </a>
            <a href="#contact" className="nav-item nav-link">
              Contact
            </a>
          </div>

          <button
            onClick={handleAdminLogin}
            className="btn btn-admin-login ms-lg-3 mt-3 mt-lg-0"
          >
            Admin Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container-fluid hero-header py-5 mb-5" id="home">
        <div className="container py-5">
          <div className="row g-5 align-items-center">
            {/* Text Section */}
            <div className="col-lg-6 text-center text-lg-start">
              <h1 className="display-4 text-dark mb-4">
                DigiLex: Empowering Potential, One Mind at a Time
              </h1>
              <p className="text-dark mb-4 pb-2">
                DigiLex is an interactive dyslexia-focused app designed for children and teenagers aged 5-16, 
                offering fun and engaging tools to help them overcome learning challenges. With personalized support, 
                the app adapts to each user's unique needs, making learning more accessible and enjoyable. 
                Through gamified experiences, interactive lessons, and progress tracking, DigiLex breaks barriers, helping young minds unlock their full potential. Whether it's reading, writing, or comprehension, 
                DigiLex is here to guide every step of the way.
              </p>
              <a
                href="#about"
                className="btn btn-primary-gradient py-sm-3 px-4 px-sm-5 rounded-pill me-3"
              >
                Learn More
              </a>
            </div>

            {/* Image Section */}
            <div className="col-lg-6 text-center hero-image-container">
              <div className="screenshot-frame">
                <img
                  className="img-fluid screenshot-img"
                  src="/img/screenshot-1.jpeg"
                  alt="DigiLex App Screenshot"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="container-xxl py-5" id="about">
        <div className="container py-5 px-lg-5">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <img
                className="img-fluid rounded"
                src="/img/about2.jpeg"
                alt="About DigiLex"
              />
            </div>
            
            <div className="col-lg-6">
              <h5 className="text-primary-gradient fw-medium">About our App & Features</h5>
              <h1 className="mb-4">DigiLex is a dyslexia-focused app designed to empower individuals with innovative tools and personalized support.</h1>
              <ul className="mb-4">
                <li>Our tailored features ensure that every user receives support designed specifically for their unique learning needs.</li>
                <li>DigiLex bridges the gap between challenges and opportunities, fostering confidence and independence.</li>
                <li>By combining cutting-edge technology with empathetic design, DigiLex transforms how dyslexia is approached and supported.</li>
                <li>We believe everyone deserves a chance to thrive—DigiLex is here to make that vision a reality.</li>
              </ul>
              <div className="row g-4 mb-4">
                <div className="col-sm-6">
                  <div className="d-flex">
                    <i className="fa fa-cogs fa-2x text-primary-gradient flex-shrink-0 mt-1"></i>
                    <div className="ms-3">
                      <h2 className="mb-0">415</h2>
                      <p>days</p>
                      <p className="text-primary-gradient mb-0">Available in</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex">
                    <i className="fa fa-comments fa-2x text-secondary-gradient flex-shrink-0 mt-1"></i>
                    <div className="ms-3">
                      <h2 className="mb-0">16</h2>
                      <p>years old</p>
                      <p className="text-secondary-gradient mb-0">Target Audience</p>
                    </div>
                  </div>
                </div>
              </div>
              <a href="#download" className="btn btn-primary-gradient py-sm-3 px-4 px-sm-5 rounded-pill mt-3">Download Now</a>
            </div>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="container-xxl py-5" id="process">
        <div className="container py-5 px-lg-5">
          <div className="text-center pb-4">
            <h5 className="text-primary-gradient fw-medium">How It Works</h5>
            <h1 className="mb-5">3 Easy Steps</h1>
          </div>
          <div className="row gy-5 gx-4 justify-content-center">
            {/* Step 1 */}
            <div className="col-lg-4 col-sm-6 text-center pt-4">
              <div className="position-relative bg-light rounded pt-5 pb-4 px-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center bg-primary-gradient rounded-circle position-absolute top-0 start-50 translate-middle shadow"
                  style={{ width: "100px", height: "100px" }}
                >
                  <i className="fa fa-cog fa-3x text-white"></i>
                </div>
                <h5 className="mt-4 mb-3">Install the App</h5>
                <p className="mb-0">
                  Download DigiLex from your app store and take the first step towards empowering young learners.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="col-lg-4 col-sm-6 text-center pt-4">
              <div className="position-relative bg-light rounded pt-5 pb-4 px-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center bg-secondary-gradient rounded-circle position-absolute top-0 start-50 translate-middle shadow"
                  style={{ width: "100px", height: "100px" }}
                >
                  <i className="fa fa-address-card fa-3x text-white"></i>
                </div>
                <h5 className="mt-4 mb-3">Setup Your Profile</h5>
                <p className="mb-0">
                  Create a personalized profile tailored to your age and learning needs for a customized experience.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="col-lg-4 col-sm-6 text-center pt-4">
              <div className="position-relative bg-light rounded pt-5 pb-4 px-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center bg-primary-gradient rounded-circle position-absolute top-0 start-50 translate-middle shadow"
                  style={{ width: "100px", height: "100px" }}
                >
                  <i className="fa fa-check fa-3x text-white"></i>
                </div>
                <h5 className="mt-4 mb-3">Enjoy The Features</h5>
                <p className="mb-0">
                  Dive into interactive lessons, gamified activities, and progress tracking designed to unlock your full potential.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Download Section */}
      <div className="container-xxl py-5" id="download">
        <div className="container py-5 px-lg-5">
          <div className="row g-5 align-items-center">
            {/* Image */}
            <div className="col-lg-6">
              <img
                className="img-fluid"
                src="/img/about1.jpeg"
                alt="Download DigiLex"
              />
            </div>

            {/* Text Content */}
            <div className="col-lg-6">
              <h5 className="text-primary-gradient fw-medium">Download</h5>
              <h1 className="mb-4">Download The Latest Version Of Our App</h1>
              <p className="mb-4">
                Stay up-to-date with DigiLex by downloading the latest version from your app store. 
                Packed with new features, enhanced performance, and the latest tools for dyslexia support, 
                our updated app ensures a smoother, more engaging experience for users aged 5-16. 
                Don't miss out on the most innovative and effective solutions we've designed to help young learners thrive!
              </p>

              <div className="row g-4">
                {/* App Store */}
                <div className="col-sm-6">
                  <a href="#" className="d-flex bg-primary-gradient rounded py-3 px-4 align-items-center">
                    <i className="fab fa-apple fa-3x text-white flex-shrink-0"></i>
                    <div className="ms-3">
                      <p className="text-white mb-0">Available On</p>
                      <h5 className="text-white mb-0">App Store</h5>
                    </div>
                  </a>
                </div>

                {/* Play Store */}
                <div className="col-sm-6">
                  <a href="#" className="d-flex bg-secondary-gradient rounded py-3 px-4 align-items-center">
                    <i className="fab fa-android fa-3x text-white flex-shrink-0"></i>
                    <div className="ms-3">
                      <p className="text-white mb-0">Available On</p>
                      <h5 className="text-white mb-0">Play Store</h5>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screenshot Carousel */}
      <div className="container-xxl py-5">
        <div className="container">
          <h5 className="text-primary-gradient fw-medium text-center">
            Screenshots
          </h5>
          <h1 className="mb-5 text-center">See DigiLex in Action</h1>

          <Swiper
            modules={[Pagination, Navigation, Autoplay]}
            spaceBetween={40}
            slidesPerView={1}
            loop
            pagination={{ clickable: true }}
            navigation
            autoplay={{ delay: 3000 }}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="screenshot-swiper"
          >
            {[1,2,3,4,5,6].map((num) => (
              <SwiperSlide key={num} className="screenshot-carousel">
                <div className="screenshot-frame">
                  <img
                    className="img-fluid screenshot-img"
                    src={`img/screenshot-${num}.jpeg`}
                    alt={`Screenshot ${num}`}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Contact Section */}
      <div className="container-xxl py-5" id="contact">
        <div className="container">
          <h5 className="text-primary-gradient fw-medium text-center">
            Contact Us
          </h5>
          <h1 className="mb-5 text-center">Get In Touch</h1>
          <form className="w-75 mx-auto">
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Your Name"
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Your Email"
              />
            </div>
            <div className="mb-3">
              <textarea
                className="form-control"
                rows="4"
                placeholder="Your Message"
              ></textarea>
            </div>
            <button className="btn btn-primary-gradient px-4 py-2 rounded-pill">
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <div className="container py-5 px-lg-5">
          <div className="row g-5">
            {/* Address */}
            <div className="col-md-6 col-lg-3">
              <h4>Address</h4>
              <p><i className="fa fa-map-marker-alt me-2"></i>5C, Block 5, Nazimabad, Karachi, Sindh 74600</p>
              <p><i className="fa fa-phone-alt me-2"></i>+012 345 67890</p>
              <p><i className="fa fa-envelope me-2"></i>digilex10@gmail.com</p>
            </div>

            {/* Quick Link */}
            <div className="col-md-6 col-lg-3">
              <h4>Quick Links</h4>
              <a href="#about">About Us</a>
              <a href="#contact">Contact Us</a>
            </div>

            {/* Popular Link */}
            <div className="col-md-6 col-lg-3">
              <h4>Popular Links</h4>
              <a href="#about">About Us</a>
              <a href="#contact">Contact Us</a>
            </div>

            {/* Newsletter */}
            <div className="col-md-6 col-lg-3">
              <h4>Newsletter</h4>
              <p>Join our newsletter to stay updated.</p>
              <div className="newsletter-input position-relative mt-3">
                <input
                  type="email"
                  className="form-control rounded-pill pe-5"
                  placeholder="Your Email"
                />
                <button className="btn position-absolute top-0 end-0 mt-1 me-2">
                  <i className="fa fa-paper-plane text-white fs-5"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="container px-lg-5 mt-4">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              &copy; <a href="#">DigiLex</a>, All Rights Reserved.
              <br />Supervisor: Ms. Ushna
              <br />Group Members: Nawal Shahid, 
              Sheeza Shabir, 
              Syeda Laiba Wali, 
              Sehar Fatima
            </div>
            <div className="col-md-6 text-center text-md-end">
              <a href="#">Home</a>
              <a href="#">Cookies</a>
              <a href="#">Help</a>
              <a href="#">FAQs</a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Back to Top */}
      <a href="#" className="back-to-top">
        <i className="fa fa-arrow-up"></i>
      </a>
    </div>
  );
}

export default LandingPage;