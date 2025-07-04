fetch("data/database_energiot_v3.json")
  .then(response => response.json())
  .then(data => {
    const entreprises = data.entreprises;
    const selectionContainer = document.getElementById("entreprise-selection");

    entreprises.forEach(ent => {
      const card = document.createElement("div");
      card.className = "dispositif-card";
      card.innerHTML = `
        <h3>${ent.nom_entreprise}</h3>
        <p><strong>Prix kWh :</strong> €${ent.prix_kwh}</p>
        <button onclick="selectEntreprise(${ent.id_entreprise}, '${ent.nom_entreprise}')">Sélectionner</button>
      `;
      selectionContainer.appendChild(card);
    });
  })
  .catch(error => {
    console.error("Erreur lors du chargement des entreprises :", error);
    document.getElementById("entreprise-selection").innerHTML = "<p>Erreur de chargement des entreprises.</p>";
  });

function selectEntreprise(id, nom) {
  localStorage.setItem("selectedEntreprise", id);
  localStorage.setItem("selectedEntrepriseNom", nom);
  window.location.href = "./public/pages/dashboard.html";
}
