import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// funktio missä valitaan, mitä tietuetta halutaan käsitellä
const ChooseTarget = () => {
  const [userInfos, setUserInfos] = useState([]);
  const navigate = useNavigate();

    // haetaan käyttäjätiedot backendilta
  useEffect(() => {
    const fetchUserInfos = async () => {
      try {
        const response = await fetch('/userinfos', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        if (data.success) {
          setUserInfos(data.user_infos);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Virhe:', error);
      }
    };

    fetchUserInfos();
  }, []);
// kahva infon siirtämiseen eteenpäin
  const handleSelectUserInfo = (userInfo) => {
    navigate('/dashboard', { state: { userInfo } });
  };

  return (
    <div>
      <h1>Käyttäjän kohteet</h1>
      {userInfos.length === 0 ? (
        <p>Ei kohteita.</p>
      ) : (
        <ul>
          {userInfos.map(info => (
            <li key={info.id}>
              {info.kohde}
              <button onClick={() => handleSelectUserInfo(info)}>Valitse</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChooseTarget;