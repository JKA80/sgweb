// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// kirjautuminen
function Login() {
    // alustetaan arvojen käyttötilat
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // luodaan kahva tietojen lähettämiseen backendille
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ kayttaja: username, salasana: password })
        });
        // luodaan data ja tarkistetaan onnistuminen
        const data = await response.json();
        if (data.success) {
            localStorage.setItem('user_id', data.user_id);
            navigate('/addUserInfo');
        } else {
            alert(data.message);
        }
    };
    // lähetetään lomakkeen tiedot backendiin. Annetaan myös mahdollisuus siirtyä uuden tunnuksen luomiseen
    return (
        <div>
            <h1>Kirjaudu sisään</h1>
        <form onSubmit={handleSubmit}>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Käyttäjänimi" required />
            <br />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Salasana" required />
            <br />
            
                <button type="submit">Kirjaudu sisään</button>
            <br />
            <br />
        
            
                <button onClick={() => navigate('/adduser')}>Lisää uusi käyttäjä</button>
            

            
        </form></div>
    );
}

export default Login;