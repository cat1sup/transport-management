import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './Components/AuthContext';
import NavigationBar from './Components/NavigationBar/NavigationBar';
import Welcome from './Components/Welcome/Welcome';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import RegistrationSuccess from './Components/Register/RegisterSuccess';
import ProfileSettings from './Components/ProfileSettings/ProfileSettings'; 
import TransportRoutes from './Components/Routes/TransportRoutes';
import Shipments from './Components/Shipments/Shipments';
import TransportInfo from './Components/TransportInfo/TransportInfo';
import History from './Components/History/History';

const App = () => (
  <AuthProvider>
    <Router>
      <Main />
    </Router>
  </AuthProvider>
);

const Main = () => {
  const location = useLocation();
  const showNavbar = !['/', '/login', '/register', '/registration-success'].includes(location.pathname); 

  return (
    <>
      {showNavbar && <NavigationBar />}
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/registration-success" element={<RegistrationSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="/transportRoutes" element={<TransportRoutes />} />
        <Route path="/shipments" element={<Shipments />} />
        <Route path="/transportInfo" element={<TransportInfo />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </>
  );
};

export default App;
