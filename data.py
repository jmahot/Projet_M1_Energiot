import json
import random
from datetime import datetime, timedelta

# Paramètres de génération
nb_entreprises = 3
nb_localisations = 10
nb_appareils = 10
nb_events = 1000

entreprises = []
localisations = []
appareils = []
events = []

# Générer entreprises
for i in range(1, nb_entreprises+1):
    entreprises.append({
        "id_entreprise": i,
        "nom_entreprise": f"Entreprise_{chr(64+i)}",
        "prix_kwh": round(random.uniform(0.17, 0.21), 4)
    })

# Générer localisations
for i in range(1, nb_localisations+1):
    localisations.append({
        "id_localisation": i,
        "numero_salle": 100 + i,
        "type_salle": random.choice(["Bureau","Amphi","Salle de cours","Salle de réunion","Open space"]),
        "etage": random.randint(0, 3),
        "id_entreprise": random.choice(entreprises)["id_entreprise"]
    })

# Générer appareils
for i in range(1, nb_appareils+1):
    appareils.append({
        "id_appareil": f"CAM{i:03}",
        "id_localisation": random.choice(localisations)["id_localisation"],
    })

# Suivi des derniers états par appareil
etat_appareil = {appareil["id_appareil"]: "OFF" for appareil in appareils}

# Date de départ pour les events
current_datetime = datetime(2025, 6, 1, 0, 0, 0)

# Générer events avec alternance et priorité sur horaires de bureau
for i in range(1, nb_events+1):
    random_appareil = random.choice(appareils)
    id_appareil = random_appareil["id_appareil"]

    # Inverser l'état précédent
    dernier_etat = etat_appareil[id_appareil]
    nouvel_etat = "ON" if dernier_etat == "OFF" else "OFF"
    etat_appareil[id_appareil] = nouvel_etat

    # Déterminer le créneau horaire : 95% en journée, 5% la nuit
    if random.random() < 0.95:
        heure = random.randint(8, 19)  # journée
    else:
        heure = random.choice(list(range(0, 8)) + [20, 21, 22, 23])  # nuit

    minute = random.randint(0, 59)
    seconde = random.randint(0, 59)

    # Incrémenter le datetime pour garantir ordre croissant
    increment_minutes = random.randint(1, 30)  # écart de 1 à 30 min
    current_datetime += timedelta(minutes=increment_minutes)

    # Remplace l'heure/minute/seconde par celles générées pour cet event
    event_datetime = current_datetime.replace(hour=heure, minute=minute, second=seconde)

    # Si on recule dans le temps par rapport au précédent event (possible avec replace), on force à avancer
    if event_datetime <= current_datetime:
        event_datetime = current_datetime + timedelta(minutes=1)
    current_datetime = event_datetime  # on met à jour la date courante

    events.append({
        "id_event": i,
        "id_appareil": id_appareil,
        "event": nouvel_etat,
        "date_complete": event_datetime.strftime("%Y-%m-%d %H:%M:%S")
    })

# Assemble le tout
database = {
    "entreprises": entreprises,
    "localisations": localisations,
    "appareils": appareils,
    "events": events
}

# Sauvegarde en JSON
with open("database_energiot.json", "w") as f:
    json.dump(database, f, indent=4)

print("Base de données JSON générée avec succès.")
