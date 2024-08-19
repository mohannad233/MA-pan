import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginRegister.css'; // استيراد ملف CSS الخاص بتسجيل الدخول

const LoginRegister = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = isRegister ? 'register' : 'login';
    try {
      const response = await axios.post(`/auth/${action}`, {
        username,
        password
      });
      if (response.data.auth && response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/admin');
      } else {
        alert(response.data.message || 'Success');
      }
    } catch (error) {
      console.error('There was an error!', error);
      alert('حدث خطأ أثناء العملية. الرجاء المحاولة مرة أخرى.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>{isRegister ? 'Register' : 'Login'}</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="submit-button">{isRegister ? 'Register' : 'Login'}</button>
          <button type="button" className="switch-button" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Switch to Login' : 'Switch to Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginRegister;
