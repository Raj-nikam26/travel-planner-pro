// Authentication System

function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/pages/')) {
        return '../';
    }
    return './';
}

document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    setupMobileMenu();
});

function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu) {
                mobileMenu.classList.toggle('hidden');
            }
        });
    }
}

async function checkAuthStatus() {
    try {
        const response = await fetch(`${getBasePath()}api/auth.php?action=check`);
        const data = await response.json();
        
        if (data.authenticated) {
            updateUIForLoggedIn(data.username);
        } else {
            updateUIForLoggedOut();
        }
    } catch (error) {
        console.error('Auth check error:', error);
        updateUIForLoggedOut();
    }
}

function updateUIForLoggedIn(username) {
    // Index page
    const notLoggedIn = document.getElementById('not-logged-in');
    const loggedIn = document.getElementById('logged-in');
    const indexUsername = document.getElementById('index-username');
    
    if (notLoggedIn) notLoggedIn.style.display = 'none';
    if (loggedIn) loggedIn.style.display = 'flex';
    if (indexUsername) indexUsername.textContent = `Welcome, ${username}!`;
    
    // Generator page
    const authUsername = document.getElementById('auth-username');
    if (authUsername) authUsername.textContent = `Logged in as: ${username}`;
}

function updateUIForLoggedOut() {
    // Index page
    const notLoggedIn = document.getElementById('not-logged-in');
    const loggedIn = document.getElementById('logged-in');
    
    if (notLoggedIn) notLoggedIn.style.display = 'block';
    if (loggedIn) loggedIn.style.display = 'none';
    
    // Generator page - redirect
    if (window.location.pathname.includes('generator.html')) {
        alert('⚠️ Please login first');
        window.location.href = getBasePath() + 'index.html';
    }
}

function showAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        // Clear fields
        document.getElementById('login-username').value = '';
        document.getElementById('login-password').value = '';
        document.getElementById('signup-username').value = '';
        document.getElementById('signup-email').value = '';
        document.getElementById('signup-password').value = '';
        
        modal.style.display = 'flex';
        showLogin();
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

async function login() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!username || !password) {
        alert('❌ Please fill in all fields');
        return;
    }
    
    try {
        const response = await fetch(`${getBasePath()}api/auth.php?action=login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('✅ Login successful!');
            closeAuthModal();
            window.location.reload();
        } else {
            alert('❌ ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Login failed');
    }
}

async function signup() {
    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    
    if (!username || !email || !password) {
        alert('❌ Please fill in all fields');
        return;
    }
    
    try {
        const response = await fetch(`${getBasePath()}api/auth.php?action=signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('✅ Account created!');
            closeAuthModal();
            window.location.reload();
        } else {
            alert('❌ ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Signup failed');
    }
}

async function logout() {
    try {
        const response = await fetch(`${getBasePath()}api/auth.php?action=logout`, {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('✅ Logged out');
            window.location.href = getBasePath() + 'index.html';
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Logout failed');
    }
}

function handleStartPlanning() {
    fetch(`${getBasePath()}api/auth.php?action=check`)
        .then(response => response.json())
        .then(data => {
            if (data.authenticated) {
                window.location.href = getBasePath() + 'pages/generator.html';
            } else {
                showAuthModal();
            }
        })
        .catch(() => showAuthModal());
}

function requireAuth() {
    fetch(`${getBasePath()}api/auth.php?action=check`)
        .then(response => response.json())
        .then(data => {
            if (!data.authenticated) {
                alert('⚠️ Please login first');
                setTimeout(() => {
                    window.location.href = getBasePath() + 'index.html';
                }, 1000);
            }
        });
}
