/* =========================
   INICIO / ACCESO — INTERACCIÓN DE UI
   Solo comportamiento visual. No hay validación de credenciales,
   lectura real de tarjeta ni enrutamiento por rol: eso se conecta
   al backend más adelante.
========================= */

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggle-contrasena');
  const toggleIcon = document.getElementById('toggle-contrasena-icon');
  const passwordInput = document.getElementById('contrasena');

  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener('click', () => {
      const isHidden = passwordInput.type === 'password';
      passwordInput.type = isHidden ? 'text' : 'password';
      toggleBtn.setAttribute('aria-pressed', String(isHidden));
      toggleBtn.setAttribute('aria-label', isHidden ? 'Ocultar contraseña' : 'Mostrar contraseña');
      if (toggleIcon) {
        toggleIcon.classList.toggle('fa-eye', isHidden);
        toggleIcon.classList.toggle('fa-eye-slash', !isHidden);
      }
    });
  }

  // Placeholder: aquí se conectará el submit real (POST a /api/auth/login
  // o el que corresponda) y la lógica de enrutamiento según el rol devuelto.
  const form = document.getElementById('form-credenciales');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log('[inicio.js] Submit de credenciales — pendiente de conectar a backend.');
    });
  }
});
