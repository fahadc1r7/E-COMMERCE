/**
 * Shared authentication utilities using localStorage
 */
const AUTH_STORAGE_KEY = 'touristAuthUsers';
const SESSION_KEY = 'touristAuthSession';

function getRegisteredUsers() {
  try {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveRegisteredUsers(users) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(users));
}

function registerUser(userData) {
  const users = getRegisteredUsers();
  const exists = users.some(
    (u) => u.email.toLowerCase() === userData.email.toLowerCase()
  );
  if (exists) {
    return { success: false, message: 'An account with this email already exists.' };
  }
  users.push(userData);
  saveRegisteredUsers(users);
  return { success: true };
}

function authenticateUser(email, password) {
  const users = getRegisteredUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) {
    const emailExists = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (!emailExists) {
      return { success: false, message: 'No account found with this email. Please sign up first.' };
    }
    return { success: false, message: 'Incorrect password. Please try again.' };
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: user.email, fullName: user.fullName }));
  return { success: true, user };
}

function getSession() {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
}

function requireAuth(redirectTo = 'signin.html') {
  if (!getSession()) {
    window.location.href = redirectTo;
  }
}

function redirectIfAuthenticated(redirectTo = 'landing.html') {
  if (getSession()) {
    window.location.href = redirectTo;
  }
}

/**
 * Password visibility toggle
 */
function initPasswordToggle(toggleBtn, inputEl) {
  toggleBtn.addEventListener('click', () => {
    const isPassword = inputEl.type === 'password';
    inputEl.type = isPassword ? 'text' : 'password';
    toggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    toggleBtn.innerHTML = isPassword ? '&#128065;' : '&#128584;';
  });
}

/**
 * Validation helpers
 */
const validators = {
  fullName(value) {
    if (!value.trim()) return 'Full name is required.';
    if (value.trim().length < 2) return 'Full name must be at least 2 characters.';
    return '';
  },

  email(value) {
    if (!value.trim()) return 'Email is required.';
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(value.trim())) return 'Please enter a valid email (e.g., example@mail.com).';
    return '';
  },

  phone(value) {
    if (!value.trim()) return 'Phone number is required.';
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 10) return 'Phone number must be exactly 10 digits.';
    return '';
  },

  location(value) {
    if (!value.trim()) return 'Location/City is required.';
    const pattern = /^[A-Za-z\s]+$/;
    if (!pattern.test(value.trim())) return 'Location must contain only alphabets.';
    return '';
  },

  password(value) {
    if (!value) return 'Password is required.';
    if (value.length < 8) return 'Password must be at least 8 characters long.';
    if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
      return 'Password must contain both letters and numbers.';
    }
    return '';
  },

  confirmPassword(value, password) {
    if (!value) return 'Please confirm your password.';
    if (value !== password) return 'Passwords do not match.';
    return '';
  },
};

function showFieldError(input, errorEl, message) {
  if (message) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  } else {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }
}

function clearFieldValidation(input, errorEl) {
  input.classList.remove('is-invalid', 'is-valid');
  errorEl.textContent = '';
  errorEl.classList.remove('visible');
}
