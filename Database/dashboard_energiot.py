import streamlit as st
import pandas as pd
import mysql.connector
import matplotlib.pyplot as plt
import seaborn as sns

# Connexion à ta base MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="7PgQy4iV#o@H",
    database="energiot"
)

# Charger les données
events = pd.read_sql("SELECT * FROM events", conn)
appareils = pd.read_sql("SELECT * FROM appareils", conn)
entreprises = pd.read_sql("SELECT * FROM entreprises", conn)
localisations = pd.read_sql("SELECT * FROM localisations", conn)

# Merge pour enrichir les events
df = events.merge(appareils, on="id_appareil").merge(localisations, on="id_localisation").merge(entreprises, on="id_entreprise")

# Affichage des données
st.title("Dashboard ÉNERGIOT")
st.write(df.head())

# Plot de la répartition des events ON/OFF
plt.figure(figsize=(8,4))
sns.countplot(x="event", data=df)
st.pyplot(plt)

# Nombre d'événements par entreprise
plt.figure(figsize=(8,4))
sns.countplot(x="nom_entreprise", data=df)
st.pyplot(plt)
