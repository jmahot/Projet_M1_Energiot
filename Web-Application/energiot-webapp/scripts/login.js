const validUsers = [
  { username: "client", password: "password123" },
  { username: "user2", password: "pass456" }
];

document.getElementById("login-form").addEventListener("submit", function(event) {
  event.preventDefault();

  const username = this.username.value.trim();
  const password = this.password.value.trim();

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

document.getElementById("logout-btn").addEventListener("click", function() {
  localStorage.removeItem("loggedInUser");
  document.getElementById("client-preview").style.display = "none";
  document.getElementById("login-section").style.display = "block";
});
