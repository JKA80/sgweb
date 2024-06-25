# models.py
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData


# metadatan muotoilu, onkohan lopulta edes tarpeen?
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

# SQLAlchemy tietokantayhteys, metadata käytössä, pitää harkita tarvetta
db = SQLAlchemy(metadata=metadata)

# käyttäjätietojen tietokantamalli
class User(db.Model):
  __tablename__ = 'kayttajat' 

  id = db.Column(db.Integer, primary_key=True)
  kayttaja = db.Column(db.String(80), unique=True, nullable=False)
  salasana = db.Column(db.String)

  tiedot = db.relationship('User_info', backref='kayttaja', uselist=False)

# käyttäjän tallentamien tietojen tietokantamalli
class User_info(db.Model):
    __tablename__ = 'kayttaja_tiedot'
    id = db.Column(db.Integer, primary_key=True)
    kayttaja_id = db.Column(db.Integer, db.ForeignKey('kayttajat.id'), nullable=False)
    tunnus = db.Column(db.String, nullable=False)
    salasana = db.Column(db.String, nullable=False)
    kohde = db.Column(db.String, nullable=False)