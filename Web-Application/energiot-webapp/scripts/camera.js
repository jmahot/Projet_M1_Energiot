fetch("../../data/database_energiot2.json")
  .then(response => response.json())
  .then(data => {
    const { appareils, localisations, events } = data;
    const cameraList = document.getElementById("camera-list");

    appareils.forEach(camera => {
      const loc = localisations.find(l => l.id_localisation === camera.id_localisation);
      const cameraEvents = events.filter(e => e.id_appareil === camera.id_appareil);
      const lastEvent = cameraEvents[cameraEvents.length - 1];
      const onCount = cameraEvents.filter(e => e.event === "ON").length;

      const card = document.createElement("div");
      card.className = "dashboard";
      card.innerHTML = `
        <h3><a href="camera-profile.html?id=${camera.id_appareil}">📸 ${camera.id_appareil}</a></h3>
        <p><strong>Room:</strong> ${loc.numero_salle} (${loc.type_salle})</p>
        <p><strong>Last Status:</strong> <span class="${lastEvent.event === 'ON' ? 'status-on' : 'status-off'}">${lastEvent.event}</span></p>
        <p><strong>Total ON events:</strong> ${onCount}</p>
      `;
      cameraList.appendChild(card);
    });
  })
  .catch(error => console.error("Failed to load camera list:", error));
