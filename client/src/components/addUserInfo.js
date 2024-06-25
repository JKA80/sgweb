import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// uuden käyttäjän lisääminen
function AddUserInfo() {
    // alustetaan arvojen käyttötilat
    const [username, setUsername] = useState('');
    const [length, setLength] = useState('');
    const [target, setTarget] = useState('');
    const navigate = useNavigate();

    // luodaan kahva tietojen lähettämiseen backendille
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/adduserinfo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tunnus: username, pituus: length, kohde: target }),
            credentials: 'include' 
        });
        // luodaan data ja tarkistetaan onnistuminen
        const data = await response.json();
        if (data.success) {
            alert(data.message);
        } else {
            alert(data.message);
        }
    };

    return (
        // lähetetään lomakkeen tiedot backendiin.
        <div>
            <h1>Luo salasana</h1>
        <form onSubmit={handleSubmit}>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Tunnus" required />
            <br />
                <input type="legnth" value={length} onChange={(e) => setLength(e.target.value)} placeholder="Pituus" required />
            <br />
                <input type="text" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Kohde" required />
            
            <br />
                <button type="submit">Vahvista</button>
            <br />
            <br />
                <h2>Hallitse salasanoja</h2>
                <button onClick={() => navigate('/chooseTarget')}>Siirry</button>
            
            <br />

            

        </form></div>
    );
}

export default AddUserInfo;