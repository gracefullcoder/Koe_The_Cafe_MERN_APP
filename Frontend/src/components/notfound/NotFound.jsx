import React from 'react';
import { Link } from 'react-router-dom';
import brokenRobot from '../../assets/images/brokenrobot.jpg';

const NotFound = () => {
  return (
    <div className="not-found">
      <img src={brokenRobot} alt="Broken Robot" className="robot-icon" />
      <h1>404</h1>
      <p>The page you are searching for is not available now.</p>
      <Link to="/" className="home-link">Go to Home</Link>
    </div>
  );
};

export default NotFound;
