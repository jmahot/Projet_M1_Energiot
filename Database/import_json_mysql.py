import json
import mysql.connector

# Connexion MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="7PgQy4iV#o@H",
    database="energiot"
)
cursor = conn.cursor()

# Créer les tables (optionnel : à exécuter une seule fois)
cursor.execute("""
CREATE TABLE IF NOT EXISTS entreprises (
    id_entreprise INT PRIMARY KEY,
    nom_entreprise VARCHAR(100),
    prix_kwh DECIMAL(5,2)
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS localisations (
    id_localisation INT PRIMARY KEY,
    numero_salle INT,
    type_salle VARCHAR(50),
    etage INT,
    id_entreprise INT,
    FOREIGN KEY (id_entreprise) REFERENCES entreprises(id_entreprise)
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS appareils (
    id_appareil VARCHAR(10) PRIMARY KEY,
    id_localisation INT,
    FOREIGN KEY (id_localisation) REFERENCES localisations(id_localisation)
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS events (
    id_event INT PRIMARY KEY,
    id_appareil VARCHAR(10),
    event ENUM('ON','OFF'),
    date_complete DATETIME,
    FOREIGN KEY (id_appareil) REFERENCES appareils(id_appareil)
)
""")

# Charger le fichier JSON
with open("database_energiot.json") as f:
    data = json.load(f)

# Insérer entreprises
for e in data["entreprises"]:
    cursor.execute("""
        INSERT INTO entreprises (id_entreprise, nom_entreprise, prix_kwh)
        VALUES (%s, %s, %s)
    """, (e["id_entreprise"], e["nom_entreprise"], e["prix_kwh"]))

# Insérer localisations
for l in data["localisations"]:
    cursor.execute("""
        INSERT INTO localisations (id_localisation, numero_salle, type_salle, etage, id_entreprise)
        VALUES (%s, %s, %s, %s, %s)
    """, (l["id_localisation"], l["numero_salle"], l["type_salle"], l["etage"], l["id_entreprise"]))

# Insérer appareils
for a in data["appareils"]:
    cursor.execute("""
        INSERT INTO appareils (id_appareil, id_localisation)
        VALUES (%s, %s)
    """, (a["id_appareil"], a["id_localisation"]))

# Insérer events
for ev in data["events"]:
    cursor.execute("""
        INSERT INTO events (id_event, id_appareil, event, date_complete)
        VALUES (%s, %s, %s, %s)
    """, (ev["id_event"], ev["id_appareil"], ev["event"], ev["date_complete"]))

# Commit des insertions
conn.commit()
print("Import JSON → MySQL terminé avec succès.")

# Fermer la connexion
cursor.close()
conn.close()
