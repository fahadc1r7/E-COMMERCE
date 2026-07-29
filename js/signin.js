document.addEventListener('DOMContentLoaded', () => {
  redirectIfAuthenticated();

  const form = document.getElementById('signinForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const alertEl = document.getElementById('formAlert');

  initPasswordToggle(document.getElementById('togglePassword'), passwordInput);

  emailInput.addEventListener('blur', () => {
    const message = validators.email(emailInput.value);
    showFieldError(emailInput, emailError, message);
  });

  passwordInput.addEventListener('blur', () => {
    const message = passwordInput.value ? '' : 'Password is required.';
    showFieldError(passwordInput, passwordError, message);
  });

  emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('is-invalid')) {
      showFieldError(emailInput, emailError, validators.email(emailInput.value));
    }
  });

  passwordInput.addEventListener('input', () => {
    if (passwordInput.classList.contains('is-invalid')) {
      showFieldError(passwordInput, passwordError, passwordInput.value ? '' : 'Password is required.');
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alertEl.classList.remove('visible');

    const emailMsg = validators.email(emailInput.value);
    const passwordMsg = passwordInput.value ? '' : 'Password is required.';

    showFieldError(emailInput, emailError, emailMsg);
    showFieldError(passwordInput, passwordError, passwordMsg);

    if (emailMsg || passwordMsg) return;

    const result = authenticateUser(emailInput.value.trim(), passwordInput.value);

    if (!result.success) {
      alertEl.textContent = result.message;
      alertEl.className = 'alert alert-error visible';
      showFieldError(emailInput, emailError, result.message.includes('email') ? result.message : '');
      showFieldError(passwordInput, passwordError, result.message.includes('password') ? result.message : '');
      return;
    }

    alertEl.textContent = 'Sign in successful! Redirecting...';
    alertEl.className = 'alert alert-success visible';

    setTimeout(() => {
      window.location.href = 'landing.html';
    }, 1000);
  });
});
