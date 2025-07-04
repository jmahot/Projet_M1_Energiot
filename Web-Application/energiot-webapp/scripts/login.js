const validUsers = [
  { username: "client", password: "client123" },
  { username: "admin", password: "admin123" }
];

document.getElementById("login-form").addEventListener("submit", event => {
  event.preventDefault();
  const username = event.target.username.value.trim();
  const password = event.target.password.value.trim();

  const userValid = validUsers.some(u => u.username === username && u.password === password);

  if (userValid) {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("client-preview").style.display = "block";
    localStorage.setItem("loggedInUser", username);
    document.getElementById("login-error").style.display = "none";
  } else {
    document.getElementById("login-error").style.display = "block";
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (loggedInUser) {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("client-preview").style.display = "block";
  }
});

document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  document.getElementById("client-preview").style.display = "none";
  document.getElementById("login-section").style.display = "block";
});
