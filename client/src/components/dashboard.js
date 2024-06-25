import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// tietueen ja salasanan käsittely
const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = location.state?.userInfo;
  const [length, setPwdLength] = useState('');
// jos tietoa ei ole palataan kotiin, vaikka tähänkään ei nyt pitäisi päästä ilman
  useEffect(() => {
    if (!userInfo) {
      navigate('/user-home');
    }
  }, [userInfo, navigate]);

 // kahva millä siirretään salasana suoraan leikepöydälle, jotta sitä esitetä näytöllä ollenkaan
  const handlePasswordCopy = async () => {
    try {
      await navigator.clipboard.writeText(userInfo.salasana);
      alert('Salasana kopioitu leikepöydälle!');
    } catch (error) {
      console.error('Error copying password:', error);
    }
  };

  // kahva salasanan uuden pituuden asettamiseksi
  const handlePasswordChange = (event) => {
    setPwdLength(event.target.value);
  };
// kahva millä hoidetaan backendilla salasanan vaihto
  const handlePasswordUpdate = async () => {
    try {
      const response = await fetch('/updatepassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id: userInfo.id, length }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Salasana päivitetty onnistuneesti!');
        setPwdLength('');
      } else {
        alert('Salasanan päivitys epäonnistui: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };
// kahva kyseisen tietueen poistamiseksi
  const handleDeleteUserInfo = async () => {
    try {
      const response = await fetch(`/deleteuserinfo/${userInfo.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        alert('Tietue poistettu onnistuneesti!');
        navigate('/choose-target');
      } else {
        alert('Tietueen poistaminen epäonnistui: ' + data.message);
      }
    } catch (error) {
      console.error('Virhe', error);
    }
  };

  return (
    <div>
      <h1>{userInfo.kohde} - Tiedot</h1>
      <button onClick={handlePasswordCopy}>Kopioi salasana leikepöydälle</button>

      <h2>Päivitä salasana</h2>
      <input
        type="text"
        placeholder="Salasanan pituus"
        value={length}
        onChange={handlePasswordChange}
      />
      <button onClick={handlePasswordUpdate}>Päivitä salasana</button>

      <h2>Poista tietue</h2>
      <button onClick={handleDeleteUserInfo}>Poista</button>
      <br />
      <br/>
      <button onClick={() => navigate('/choosetarget')}>Palaa</button>
    </div>
  );
};

export default Dashboard;
