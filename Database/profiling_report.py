import pandas as pd
import mysql.connector
from ydata_profiling import ProfileReport

# Connexion MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="7PgQy4iV#o@H",
    database="energiot"
)


# Récupérer la liste des tables
cursor = conn.cursor()
cursor.execute("SHOW TABLES")
tables = [table[0] for table in cursor.fetchall()]

# Profiling pour chaque table
for table_name in tables:
    print(f"Génération du report pour la table : {table_name}")

    # Charger la table en DataFrame
    df = pd.read_sql(f"SELECT * FROM {table_name}", con=conn)

    # Générer le rapport
    profile = ProfileReport(df, title=f"Profiling Report - {table_name}", explorative=True)

    # Sauvegarder en HTML
    profile.to_file(f"Database/Profile_Report/{table_name}_profiling_report.html")

print("Tous les rapports ont été générés.")
conn.close()