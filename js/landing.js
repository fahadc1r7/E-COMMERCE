document.addEventListener('DOMContentLoaded', () => {
  requireAuth();

  const session = getSession();
  const welcomeEl = document.getElementById('welcomeMessage');
  const userNameEl = document.getElementById('userName');

  if (session) {
    welcomeEl.style.display = 'block';
    userNameEl.textContent = session.fullName;
  }

  document.getElementById('logoutBtn').addEventListener('click', () => {
    logout();
    window.location.href = 'signin.html';
  });
});
