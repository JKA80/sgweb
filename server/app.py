# app.py
from flask import Flask, jsonify, request, session
from flask_migrate import Migrate
from flask_cors import CORS
from flask_session import Session
from werkzeug.security import generate_password_hash, check_password_hash

from models import db, User, User_info

from string import ascii_lowercase, ascii_uppercase, punctuation, digits
from random import choice

# aluestetaan sovellus, Flask, sessionhallinta, SQLAlchemy sekä CORS
app = Flask(__name__)
app.secret_key = 'salainen_avain'
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_KEY_PREFIX'] = 'flask_'
Session(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///kayttajat.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

CORS(app)

#tietokannan muutosen hallintaan migrate
migrate = Migrate(app, db)

#tietokannan alustus
db.init_app(app)

'''testi-route ei tällä hetkellä tarpeellinen 
@app.route('/session-check', methods=['GET'])
def session_check():
    user_id = session.get('user_id')
    print(f"Session user_id: {user_id}")  # Debug-tulostus
    return jsonify({'user_id': user_id})
'''

#login-route, toimii myös avausikkunana
@app.route('/login', methods=['POST'])
def login():
    # haetaan data ja pilkotaan muuttujiin
    data = request.json
    kayttaja = data.get('kayttaja')
    salasana = data.get('salasana')

    # haetaan käyttäjätiedot ja verrataan niitä tietokantaan, jos löytyy päästetään kirjautumaan sisään, muuten kehotetaan tarkistamaan
    user = User.query.filter_by(kayttaja=kayttaja).first()
    if user and check_password_hash(user.salasana, salasana):
        # aluestetaan sessio, missä user_id kulkee mukana ja toimii yksilöivänä tekijänä
        session['user_id'] = user.id
        return jsonify({'success': True, 'message': 'Kirjautuminen onnistui!', 'user_id': user.id})
    else:
        return jsonify({'success': False, 'message': 'Kirjautuminen epäonnistui! Tarkista käyttäjänimi ja salasana.'})

# route uuden käyttäjän lisäämiseen
@app.route('/adduser', methods=['POST'])
def add_user():
    #määritellään funktio käyttjän lisäämiseen tietokantaan, hashataan salasana
    def create_user(kayttaja, salasana):
        hashed_password = generate_password_hash(salasana, method='scrypt')
        new_user = User(kayttaja=kayttaja, salasana=hashed_password)
        db.session.add(new_user)
        db.session.commit()
    # kuten aiemmin, vastaanotetaan data ja pilkotaan muuttujiin
    data = request.json
    kayttaja = data.get('kayttaja')
    salasana = data.get('salasana')
    # jos käyttäjänimi on jo käytössä annetaan ilmoitus
    existing_user = User.query.filter_by(kayttaja=kayttaja).first()
    if existing_user:
        return jsonify({'success': False, 'message': 'Käyttäjänimi on jo käytössä'})
    # jos estettä käyttäjätilin luomiselle ei ole, tehdään se
    create_user(kayttaja, salasana)
    return jsonify({'success': True, 'message': 'Käyttäjä lisätty onnistuneesti!'})
# käyttäjätietojen haku
@app.route('/userinfos', methods=['GET'])
def get_user_infos():
    user_id = session.get('user_id')
    
    user_infos = User_info.query.filter_by(kayttaja_id=user_id).all()
    if user_infos:
        return jsonify({
            'success': True,
            'user_infos': [
                {
                    'id': info.id,
                    'tunnus': info.tunnus,
                    'salasana': info.salasana,
                    'kohde': info.kohde
                } for info in user_infos
            ]
        })
    else:
        return jsonify({'success': False, 'message': 'Käyttäjän tietoja ei löytynyt.'})
# päivitetään salasana
@app.route('/updatepassword', methods=['POST'])
def update_password():
    data = request.json
    user_id = session.get('user_id')
    info_id = data.get('id')
    length = data.get('length')

    user_info = User_info.query.filter_by(kayttaja_id=user_id, id=info_id).first()

    user_info.salasana = create_password(length)
    db.session.commit()

    return jsonify({'success': True, 'message': 'Salasana päivitetty onnistuneesti!'})
# poistetaan tietty tietue
@app.route('/deleteuserinfo/<int:info_id>', methods=['DELETE'])
def delete_user_info(info_id):
    user_id = session.get('user_id')

    user_info = User_info.query.filter_by(kayttaja_id=user_id, id=info_id).first()
    if not user_info:
        return jsonify({'success': False, 'message': 'Käyttäjän tietoja ei löytynyt.'})

    db.session.delete(user_info)
    db.session.commit()

    return jsonify({'success': True, 'message': 'Käyttäjän tiedot poistettu onnistuneesti!'})
  
# lisätään käyttäjän tiedot, eli uusi luotu salasana tiettyyn palveluun
@app.route('/adduserinfo', methods=['POST'])
def add_user_info():
      

    # jälleen käytetään sessiota ja user_id:tä asioiden hallintaan eli loppupeleissä lisätään tiedot tietokantaan, jälleen hashataan salasana
    # pitää miettiä kaikkien tietojen kryptaamista...
    user_id = session.get('user_id')
    data = request.json
    pituus= data.get('pituus')
    tunnus = data.get('tunnus')
    kohde = data.get('kohde')
    salasana = create_password(int(pituus))

    new_user_info = User_info(
        kayttaja_id=user_id,
        tunnus=tunnus,
        salasana=salasana,
        kohde=kohde
    )
    db.session.add(new_user_info)
    db.session.commit()

    return jsonify({'success': True, 'message': 'Käyttäjän tiedot lisätty onnistuneesti!'})
# kirjaudu ulos eli lopeta sessio
@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'success': True, 'message': 'Kirjauduttu ulos onnistuneesti!'})

# funktio salasanan luomiseen
def create_password(length):
        caps = ascii_uppercase
        lows= ascii_lowercase
        specials = punctuation
        nums = digits

        all_chars = caps + lows + specials + nums

        pwd = ""
        length = 10
        round= 0
    
        while round < (length):
            pwd += choice(all_chars)
            round +=1

        return(pwd)
# name main
if __name__ == '__main__':
    app.run(port=5555, debug=True)




