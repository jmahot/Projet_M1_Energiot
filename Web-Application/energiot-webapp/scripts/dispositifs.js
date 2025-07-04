fetch("../../data/database_energiot_v3.json")
  .then(response => response.json())
  .then(data => {
    const { entreprises, appareils, localisations, events } = data;
    const selectedEntrepriseId = localStorage.getItem("selectedEntreprise");

    if (!selectedEntrepriseId) {
      document.getElementById("appareils-container").innerHTML = "<p>Veuillez d'abord sélectionner une entreprise.</p>";
      return;
    }

    const entrepriseNameSpan = document.getElementById("entreprise-name");
    const entreprise = entreprises.find(e => e.id_entreprise == selectedEntrepriseId);
    entrepriseNameSpan.textContent = entreprise ? entreprise.nom_entreprise : "Inconnue";

    const appareilsContainer = document.getElementById("appareils-container");
    appareilsContainer.innerHTML = "";

    const appareilsFiltered = appareils.filter(a => a.id_entreprise == selectedEntrepriseId);

    if (appareilsFiltered.length === 0) {
      appareilsContainer.innerHTML = "<p>Aucun dispositif trouvé pour cette entreprise.</p>";
      return;
    }

    appareilsFiltered.forEach(appareil => {
      const loc = localisations.find(l => l.id_localisation === appareil.id_localisation);
      const appareilEvents = events.filter(e => e.id_appareil === appareil.id_appareil);
      const lastEvent = appareilEvents[appareilEvents.length - 1];
      const onCount = appareilEvents.filter(e => e.event === "ON").length;

      const card = document.createElement("div");
      card.className = "dispositif-card";
      card.innerHTML = `
        <h3>🛠️ ${appareil.nom_appareil || appareil.id_appareil}</h3>
        <p><strong>Localisation :</strong> ${loc ? `${loc.numero_salle} (${loc.type_salle})` : "Inconnue"}</p>
        <p><strong>Dernier statut :</strong> 
          <span class="${lastEvent && lastEvent.event === 'ON' ? 'status-on' : 'status-off'}">
            ${lastEvent ? lastEvent.event : "Aucun événement"}
          </span>
        </p>
        <p><strong>Total ON :</strong> ${onCount}</p>
        <a href="dispositif-profile.html?id=${appareil.id_appareil}" class="btn-link">Voir profil</a>
      `;

      appareilsContainer.appendChild(card);
    });
  })
  .catch(error => {
    console.error("Erreur lors du chargement des dispositifs :", error);
    document.getElementById("appareils-container").innerHTML = "<p>Erreur de chargement des dispositifs.</p>";
  });
