import React from 'react';
import { Link } from 'react-router-dom';

function Welcome() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to Transport Management</h1>
      <p>Please choose an option:</p>
      <div>
        <Link to="/login"><button>Login</button></Link>
        <Link to="/register"><button>Register</button></Link>
      </div>
    </div>
  );
}

export default Welcome;
