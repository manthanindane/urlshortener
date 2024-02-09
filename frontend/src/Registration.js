import React, { useState } from 'react';
import axios from 'axios';

const Registration = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${window.location.origin}/register`, {
        username,
        email,
        password,
      });

      console.log('Registration successful!');
      alert('Registration successful! Please login to continue.');

    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2 className='authhead'>Registration</h2>
      {error && <p className="error-message">{error}</p>}
      <form className='authform' onSubmit={handleSubmit}>
        <div className='input'>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Registration;
