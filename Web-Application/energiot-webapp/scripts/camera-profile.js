// Get the camera id from URL query params
const params = new URLSearchParams(window.location.search);
const cameraId = params.get("id");

fetch("../../data/database_energiot2.json")
  .then(response => response.json())
  .then(data => {
    const { appareils, localisations, events } = data;
    const profileContainer = document.getElementById("camera-profile");

    const camera = appareils.find(c => c.id_appareil === cameraId);
    if (!camera) {
      profileContainer.innerHTML = `<p>Camera not found.</p>`;
      return;
    }

    const loc = localisations.find(l => l.id_localisation === camera.id_localisation);
    const cameraEvents = events.filter(e => e.id_appareil === camera.id_appareil);
    const lastEvent = cameraEvents[cameraEvents.length - 1];
    const onCount = cameraEvents.filter(e => e.event === "ON").length;

    profileContainer.innerHTML = `
      <div class="dashboard">
        <h3>📸 ${camera.id_appareil}</h3>
        <p><strong>Location:</strong> Room ${loc.numero_salle} (${loc.type_salle})</p>
        <p><strong>Floor:</strong> ${loc.etage}</p>
        <p><strong>Last Status:</strong> <span class="${lastEvent.event === 'ON' ? 'status-on' : 'status-off'}">${lastEvent.event}</span></p>
        <p><strong>Total ON events:</strong> ${onCount}</p>
        <h4>Recent Events</h4>
        <ul>
          ${cameraEvents.slice(-10).map(e => `<li>${e.date_complete} — ${e.event}</li>`).join("")}
        </ul>
      </div>
    `;
  })
  .catch(error => console.error("Failed to load camera profile:", error));
