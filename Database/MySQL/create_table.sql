CREATE TABLE entreprises (
    id_entreprise INT PRIMARY KEY,
    nom_entreprise VARCHAR(100),
    prix_kwh DECIMAL(5,2)
);

CREATE TABLE localisations (
    id_localisation INT PRIMARY KEY,
    numero_salle INT,
    type_salle VARCHAR(50),
    etage INT,
    id_entreprise INT,
    FOREIGN KEY (id_entreprise) REFERENCES entreprises(id_entreprise)
);

CREATE TABLE appareils (
    id_appareil VARCHAR(10) PRIMARY KEY,
    id_localisation INT,
    FOREIGN KEY (id_localisation) REFERENCES localisations(id_localisation)
);

CREATE TABLE events (
    id_event INT PRIMARY KEY,
    id_appareil VARCHAR(10),
    event ENUM('ON','OFF'),
    date_complete DATETIME,
    FOREIGN KEY (id_appareil) REFERENCES appareils(id_appareil)
);