import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const RegistrationSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="register-body">
            <div className="register-background"></div>
            <div className="register-overlay"></div>
            <div className="register-form success-card"> {/* Use the same card styling */}
                <h3>Account created successfully!</h3>
                <button onClick={() => navigate('/login')} className="register-button">Go to Login</button>
            </div>
        </div>
    );
}

export default RegistrationSuccess;
