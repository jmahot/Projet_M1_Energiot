# Projet ENERGIOT - Dashboard & Data Profiling

## Prérequis

- Python 3.10.x (préféré pour compatibilité)
- MySQL installé et configuré avec notre base de données
- Virtualenv (recommandé)

---

## Installation

1. Créer un environnement virtuel et l'activer :

```
# Créer un environnement
python -m venv venv
```

```
# Activer l'environnement
.\venv\Scripts\activate
```

2. Installer les dépendances :

```
pip install -r requirements.txt
```

Configuration
    Mettre à jour les informations de connexion à la base MySQL dans profiling_report.py (utilisateur, mot de passe, nom de la base, host).

3. Lancer le streamlit : py -m streamlit run dashboard_energiot.py