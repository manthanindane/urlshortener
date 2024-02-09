import React, { useState, useEffect } from 'react';
import Login from './Login'; 
import Main from './Main'; 
import Registration from './Registration';
import { jwtDecode } from 'jwt-decode'; 
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false); 
  const [showRegistration, setShowRegistration] = useState(false); 

  const handleShowLogin = () => {
    setShowLogin(true);
    setShowRegistration(false); 
  };

  const handleShowRegistration = () => {
    setShowRegistration(true);
    setShowLogin(false); 
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false); 
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        jwtDecode(token); 
        setIsLoggedIn(true); 
      } catch (error) {
        console.error('Error decoding token:', error); 
        localStorage.removeItem('token'); 
      }
    }
  }, []); 

  return (
    <>
      <div className='logout'>
      {isLoggedIn && (
        <>
          <Main /> 
          <button className='logoutbutton' onClick={handleLogout}>Logout</button>
        </>
      )}
      </div>
      {!isLoggedIn && (
        <>
          <div className="auth-buttons">
            <button className="loginbutton"onClick={handleShowLogin}>Login</button>
            <button className="registerbutton" onClick={handleShowRegistration}>Register</button>
          </div>

          {showLogin && <Login setIsLoggedIn={setIsLoggedIn} setShowRegistration={setShowRegistration} />}
          {showRegistration && <Registration setShowLogin={setShowLogin} />} 
        </>
      )}

     
    </>
  );
}

export default App;
