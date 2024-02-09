import React, { useState } from 'react';
import axios from 'axios';
import './Authentication.css';


const Login = ({ setIsLoggedIn, setShowRegistration }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
   

      try {
        const response = await axios.post(`${window.location.origin}/login`, {
          email,
          password,
        });

        localStorage.setItem('token', response.data.token);
        setIsLoggedIn(true); 
      console.log('Login successful!'); 

    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="form-container"> 
      <h2 className='authhead'>Login</h2>
      {error && <p className="error-message">{error}</p>} 
      <form className='authform' onSubmit={handleSubmit}>
        <div className='input'>
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        <div className='input'>
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
