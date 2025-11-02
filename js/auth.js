// Simple authentication system (localStorage based)

function showAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('modal-title').textContent = 'Welcome Back';
}

function showSignup() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('modal-title').textContent = 'Create Account';
}

function login() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    if (!username || !password) {
        alert('❌ Please fill in all fields');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '{}');

    if (users[username] && users[username].password === password) {
        localStorage.setItem('currentUser', username);
        alert('✅ Login successful!');
        closeAuthModal();
        location.reload();
    } else {
        alert('❌ Invalid username or password');
    }
}

function signup() {
    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;

    if (!username || !email || !password) {
        alert('❌ Please fill in all fields');
        return;
    }

    if (password.length < 6) {
        alert('❌ Password must be at least 6 characters');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '{}');

    if (users[username]) {
        alert('❌ Username already exists');
        return;
    }

    users[username] = {
        email,
        password,
        createdAt: new Date().toISOString()
    };

    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', username);
    alert('✅ Account created! Welcome ' + username);
    closeAuthModal();
    location.reload();
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        alert('✅ Logged out successfully');
        location.reload();
    }
}

function requireAuth() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
        showAuthModal();
    } else {
        // Show logged in UI
        const notLoggedIn = document.getElementById('not-logged-in');
        const loggedIn = document.getElementById('logged-in');
        const authUsername = document.getElementById('auth-username');
        const indexUsername = document.getElementById('index-username');

        if (notLoggedIn) notLoggedIn.style.display = 'none';
        if (loggedIn) loggedIn.style.display = 'flex';
        if (authUsername) authUsername.textContent = '👤 ' + currentUser;
        if (indexUsername) indexUsername.textContent = '👤 ' + currentUser;
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a page that requires auth
    if (document.getElementById('auth-modal')) {
        requireAuth();
    }
});

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('auth-modal');
    if (modal && event.target === modal) {
        closeAuthModal();
    }
});
