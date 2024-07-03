// components/LogoutButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Kirjaudu ulos
    </button>
  );
};

export default LogoutButton;