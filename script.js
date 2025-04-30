function showSection(id) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute('data-theme', currentTheme === 'light' ? 'dark' : 'light');
}
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const navBackdrop = document.getElementById('navBackdrop');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  navBackdrop.classList.toggle('active');
});

navBackdrop.addEventListener('click', () => {
  navLinks.classList.remove('active');
  navBackdrop.classList.remove('active');
});
function toggleMenu() {
  const links = document.getElementById("navLinks");
  const backdrop = document.getElementById("navBackdrop");
  links.classList.toggle("active");
  backdrop.classList.toggle("active");
}
