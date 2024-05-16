import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Components/AuthContext';
import NavigationBar from './Components/NavigationBar/NavigationBar';
import Welcome from './Components/Welcome/Welcome';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import RegistrationSuccess from './Components/Register/RegisterSuccess';
import ProfileSettings from './Components/ProfileSettings/ProfileSettings'; 
import TransportRoutes from './Components/Routes/TransportRoutes';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavigationBar /> 
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registration-success" element={<RegistrationSuccess />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />
          <Route path="/transportRoutes" element={<TransportRoutes />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
