import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css';

function Welcome() {
  useEffect(() => {
    document.body.className = 'welcome-body';
    return () => {
      document.body.className = '';
    };
  }, []);

  return (
    <div className="welcome-body">
      <div className="welcome-background"></div> {/* Blurred background */}
      <div className="welcome-overlay"></div> {/* Dark overlay */}
      <div className="welcome-container">
        <h1>Transforming Logistics with Transport Management</h1>
        <div className="welcome-buttons">
          <Link to="/login"><button className="welcome-button">Login</button></Link>
          <Link to="/register"><button className="welcome-button">Register</button></Link>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
