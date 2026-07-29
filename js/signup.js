document.addEventListener('DOMContentLoaded', () => {
  redirectIfAuthenticated();

  const form = document.getElementById('signupForm');
  const fields = {
    fullName: {
      input: document.getElementById('fullName'),
      error: document.getElementById('fullNameError'),
      validate: (v) => validators.fullName(v),
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('emailError'),
      validate: (v) => validators.email(v),
    },
    phone: {
      input: document.getElementById('phone'),
      error: document.getElementById('phoneError'),
      validate: (v) => validators.phone(v),
    },
    location: {
      input: document.getElementById('location'),
      error: document.getElementById('locationError'),
      validate: (v) => validators.location(v),
    },
    password: {
      input: document.getElementById('password'),
      error: document.getElementById('passwordError'),
      validate: (v) => validators.password(v),
    },
    confirmPassword: {
      input: document.getElementById('confirmPassword'),
      error: document.getElementById('confirmPasswordError'),
      validate: (v) => validators.confirmPassword(v, fields.password.input.value),
    },
  };

  initPasswordToggle(document.getElementById('togglePassword'), fields.password.input);
  initPasswordToggle(document.getElementById('toggleConfirmPassword'), fields.confirmPassword.input);

  Object.values(fields).forEach(({ input, error, validate }) => {
    input.addEventListener('blur', () => {
      const message = validate(input.value);
      showFieldError(input, error, message);
    });

    input.addEventListener('input', () => {
      if (input.classList.contains('is-invalid')) {
        const message = validate(input.value);
        showFieldError(input, error, message);
      }
      if (input === fields.password.input && fields.confirmPassword.input.value) {
        const confirmMsg = fields.confirmPassword.validate(fields.confirmPassword.input.value);
        showFieldError(fields.confirmPassword.input, fields.confirmPassword.error, confirmMsg);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    Object.values(fields).forEach(({ input, error, validate }) => {
      const message = validate(input.value);
      showFieldError(input, error, message);
      if (message) isValid = false;
    });

    if (!isValid) return;

    const result = registerUser({
      fullName: fields.fullName.input.value.trim(),
      email: fields.email.input.value.trim(),
      phone: fields.phone.input.value.replace(/\D/g, ''),
      location: fields.location.input.value.trim(),
      password: fields.password.input.value,
    });

    const alertEl = document.getElementById('formAlert');

    if (!result.success) {
      alertEl.textContent = result.message;
      alertEl.className = 'alert alert-error visible';
      showFieldError(fields.email.input, fields.email.error, result.message);
      return;
    }

    alertEl.textContent = 'Account created successfully! Redirecting to sign in...';
    alertEl.className = 'alert alert-success visible';

    setTimeout(() => {
      window.location.href = 'signin.html';
    }, 1500);
  });
});
