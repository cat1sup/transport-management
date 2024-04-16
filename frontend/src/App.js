import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Components/AuthContext';  // Adjust path as necessary
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from './Components/NavigationBar/NavigationBar';
import Welcome from './Components/Welcome/Welcome';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import Dashboard from './Components/Dashboard/Dashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<NavigationBar><Dashboard /></NavigationBar>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
