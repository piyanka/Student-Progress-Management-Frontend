import React from "react";
import { Link } from "react-router-dom";
import HeroImg from "./Assets/hero-illustration.svg"; // Replace with your actual SVG path


const HeroSection = () => {
  return (
    <div className="hero-container">
      <div className="hero-content">
        {/* Left Text Section */}
        <div className="hero-text">
          <h1>Empower Student Growth with Ease 📊✨</h1>
          <p>
            Track Codeforces progress, analyze problem-solving trends, and keep your students engaged — all from one simple dashboard.
          </p>
          <div className="hero-buttons">
            {/* <Link to="/signup">
              <button className="primary-btn">🚀 Get Started</button>
            </Link> */}
            {/* <a
              href="https://github.com/your-repo-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="secondary-btn">⭐ GitHub Repo</button>
            </a> */}
          </div>
        </div>

        {/* Right Image Section */}
        <div className="hero-image">
          <img src={HeroImg} alt="Students managing progress" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
