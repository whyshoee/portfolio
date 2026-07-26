// frontend/public/js/login.js

async function handleLogin() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const errorMsg = document.getElementById('errorMsg');

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      window.location.href = '/admin'; // Push straight to dashboard panel
    } else {
      errorMsg.textContent = data.error || 'Invalid credentials.';
      errorMsg.style.display = 'block';
    }
  } catch (err) {
    console.error('Login request failed:', err);
    errorMsg.textContent = 'Server communication error.';
    errorMsg.style.display = 'block';
  }
}

// Bind the button securely using DOM events (No inline HTML attributes!)
document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', handleLogin);
  }
});