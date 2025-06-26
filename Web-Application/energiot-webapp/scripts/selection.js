fetch("../data/database_energiot2.json")
  .then(response => response.json())
  .then(data => {
    const entreprises = data.entreprises;
    const selectionContainer = document.getElementById("entreprise-selection");

    entreprises.forEach(ent => {
      const card = document.createElement("div");
      card.className = "dashboard";
      card.innerHTML = `
        <h3>${ent.nom_entreprise}</h3>
        <p><strong>kWh price:</strong> €${ent.prix_kwh}</p>
        <button onclick="selectEntreprise(${ent.id_entreprise})">Select</button>
      `;
      selectionContainer.appendChild(card);
    });
  })
  .catch(error => console.error("Failed to load entreprise list:", error));

function selectEntreprise(id) {
  localStorage.setItem("selectedEntreprise", id);
  window.location.href = "./pages/dashboard.html";
}
