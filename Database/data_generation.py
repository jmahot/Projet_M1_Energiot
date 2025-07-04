#V3 data_generation
import json
import random
from datetime import datetime, timedelta

# Paramètres
nb_entreprises = 3
nb_localisations = 20
nb_appareils = 50
jours_simulation = 14  # Générer events sur 7 jours
start_date = datetime(2025, 6, 1, 6, 0, 0)  # Début 6h du 1er juin

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
        "type_salle": random.choice(["Bureau", "Amphi", "Salle de cours", "Salle de réunion", "Open space"]),
        "etage": random.randint(0, 3),
        "id_entreprise": random.choice(entreprises)["id_entreprise"]
    })

# Générer appareils
for i in range(1, nb_appareils+1):
    appareils.append({
        "id_appareil": f"CAM{i:03}",
        "id_localisation": random.choice(localisations)["id_localisation"],
    })

event_id = 1

# Fonction pour générer événements pour un appareil sur plusieurs jours
def generer_events_appareil(appareil_id, start_dt, jours, etat_initial="OFF"):
    global event_id
    current_time = start_dt
    etat = etat_initial

    for jour in range(jours):
        # 👇 Ajuste heure de fin pour dernier jour
        jour_debut = current_time.replace(hour=7, minute=0, second=0)
        if jour == jours - 1:
            jour_fin = current_time.replace(hour=15, minute=0, second=0)
        else:
            jour_fin = current_time.replace(hour=21, minute=0, second=0)

        temp_events = []
        dernier_etat = etat

        t = jour_debut
        etat_local = dernier_etat
        while t < jour_fin:
            etat_local = "ON" if etat_local == "OFF" else "OFF"

            if etat_local == "ON":
                duree = random.randint(15, 120)
            else:
                duree = random.randint(5, 60)

            delta = timedelta(minutes=duree, seconds=random.randint(0, 59))
            event_time = t + delta
            if event_time > jour_fin:
                event_time = jour_fin

            if etat_local != dernier_etat:
                temp_events.append({
                    "date_complete": t,
                    "event": etat_local
                })
                dernier_etat = etat_local

            t = event_time

        # Générer events nuit uniquement si ce n'est pas le dernier jour
        if jour != jours - 1:
            for _ in range(random.randint(0, 2)):
                heure = random.randint(22, 23)
                minute = random.randint(0, 59)
                seconde = random.randint(0, 59)
                dt_nuit = current_time.replace(hour=heure, minute=minute, second=seconde)

                if dernier_etat != "OFF":
                    temp_events.append({
                        "date_complete": dt_nuit,
                        "event": "OFF"
                    })
                    dernier_etat = "OFF"

            for _ in range(random.randint(0, 2)):
                heure = random.randint(0, 5)
                minute = random.randint(0, 59)
                seconde = random.randint(0, 59)
                dt_nuit = current_time.replace(hour=heure, minute=minute, second=seconde)

                if dernier_etat != "OFF":
                    temp_events.append({
                        "date_complete": dt_nuit,
                        "event": "OFF"
                    })
                    dernier_etat = "OFF"

        temp_events.sort(key=lambda x: x["date_complete"])

        etat = dernier_etat

        for ev in temp_events:
            events.append({
                "id_event": event_id,
                "id_appareil": appareil_id,
                "event": ev["event"],
                "date_complete": ev["date_complete"].strftime("%Y-%m-%d %H:%M:%S")
            })
            event_id += 1

        current_time += timedelta(days=1)

    return etat

# Générer events pour chaque appareil
for appareil in appareils:
    etat_initial = "OFF"
    generer_events_appareil(appareil["id_appareil"], start_date, jours_simulation, etat_initial)

# Trier tous les événements par date pour ordre strict
events.sort(key=lambda e: datetime.strptime(e["date_complete"], "%Y-%m-%d %H:%M:%S"))

# Réassigner les IDs dans l’ordre
for i, e in enumerate(events, start=1):
    e["id_event"] = i

# Création de la base complète
database = {
    "entreprises": entreprises,
    "localisations": localisations,
    "appareils": appareils,
    "events": events
}

# Sauvegarder dans fichier JSON
with open("Database/database_energiot_v3.json", "w") as f:
    json.dump(database, f, indent=4, ensure_ascii=False)

print(f"Base de données JSON générée avec {len(events)} événements pour {len(appareils)} appareils.")