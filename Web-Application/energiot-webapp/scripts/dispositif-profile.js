// Récupérer l'id du dispositif depuis l'URL
const params = new URLSearchParams(window.location.search);
const appareilId = params.get("id");

if (!appareilId) {
  document.getElementById("dispositif-profile").innerHTML = "<p>Dispositif non spécifié.</p>";
  throw new Error("ID dispositif manquant dans l'URL");
}

fetch("../../data/database_energiot_v3.json")
  .then(response => response.json())
  .then(data => {
    const { appareils, localisations, events } = data;
    const profileContainer = document.getElementById("dispositif-profile");

    // Trouver l'appareil demandé
    const appareil = appareils.find(c => c.id_appareil === appareilId);
    if (!appareil) {
      profileContainer.innerHTML = `<p>Dispositif introuvable.</p>`;
      return;
    }

    // Trouver localisation associée
    const loc = localisations.find(l => l.id_localisation === appareil.id_localisation);

    // Filtrer événements de cet appareil
    const appareilEvents = events.filter(e => e.id_appareil === appareil.id_appareil);

    if (appareilEvents.length === 0) {
      profileContainer.innerHTML = `<p>Aucun événement trouvé pour ce dispositif.</p>`;
      return;
    }

    // Dernier événement
    const lastEvent = appareilEvents[appareilEvents.length - 1];
    // Nombre d'activations (événements ON)
    const onCount = appareilEvents.filter(e => e.event === "ON").length;

    // Construction HTML principal
    profileContainer.innerHTML = `
      <h2>Profil du dispositif</h2>
      <button onclick="history.back()" class="back-button">← Retour aux dispositifs</button>
      <div class="dispositif-card-profile">
        <h3>🛠️ Dispositif : ${appareil.id_appareil}</h3>
        <p><strong>Emplacement :</strong> Salle ${loc ? loc.numero_salle : "Inconnu"} (${loc ? loc.type_salle : "Inconnu"})</p>
        <p><strong>Étage :</strong> ${loc ? loc.etage : "Inconnu"}</p>
        <p><strong>Dernier statut de la lumière :</strong> 
          <span class="${lastEvent.event === 'ON' ? 'status-on' : 'status-off'}">
            ${lastEvent.event === 'ON' ? 'Allumée' : 'Éteinte'}
          </span>
        </p>
        <p><strong>Total d'activations :</strong> ${onCount}</p>
        <br>

        <label for="date-filter"><strong>Choisir un jour :</strong></label>
        <input type="date" id="date-filter" style="margin-left: 10px; padding: 5px;" />
        <br><br>
        <h4>Historique des événements de lumière :</h4>
        <div id="event-history" style="margin-top: 10px;"></div>

        <p class="info-note" style="margin-top: 20px;">
          Dispositif composé d’un kit Energiot (capteur Arduino + caméra IA embarquée) pour le suivi automatisé de l’éclairage.
        </p>
      </div>
    `;

    const dateFilterInput = document.getElementById("date-filter");
    const eventHistoryDiv = document.getElementById("event-history");

    // Fonction pour afficher les événements filtrés par date
    function afficherEventsPourDate(dateStr) {
      const eventsDuJour = appareilEvents.filter(e => e.date_complete.startsWith(dateStr));

      if (eventsDuJour.length === 0) {
        eventHistoryDiv.innerHTML = "<p>Aucun événement pour ce jour.</p>";
        return;
      }

      eventHistoryDiv.innerHTML = `
        <table style="width: 100%; max-width: 600px; margin: auto; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th style="padding: 8px; border: 1px solid #ddd;">Heure</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Événement</th>
            </tr>
          </thead>
          <tbody>
            ${eventsDuJour.map(e => `
              <tr style="text-align: center;">
                <td style="padding: 6px; border: 1px solid #ddd; font-family: monospace;">${e.date_complete.slice(11)}</td>
                <td style="padding: 6px; border: 1px solid #ddd; color: ${e.event === "ON" ? 'green' : 'red'};">
                  ${e.event === "ON" ? "Allumée" : "Éteinte"}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    // Initialiser la date à celle du dernier événement
    const derniereDate = lastEvent.date_complete.slice(0, 10);
    dateFilterInput.value = derniereDate;
    afficherEventsPourDate(derniereDate);

    // Événement sur changement de date
    dateFilterInput.addEventListener("change", () => {
      afficherEventsPourDate(dateFilterInput.value);
    });
  })
  .catch(error => {
    console.error("Erreur lors du chargement du profil du dispositif :", error);
    document.getElementById("dispositif-profile").innerHTML = "<p>Erreur de chargement des données.</p>";
  });
