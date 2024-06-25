import React from 'react';
import { useNavigate } from 'react-router-dom';
// uloskirjautumispainike, laitetaan useimmille sivuille, joten oma tiedostonsa.
const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('/logout', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        navigate('/login');
        alert(data.message);
      } else {
        alert('Kirjautumisessa ulos tapahtui virhe: ' + data.message);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <button onClick={handleLogout} style={{ margin: '10px', padding: '10px' }}>
      Kirjaudu ulos
    </button>
  );
};

export default LogoutButton;