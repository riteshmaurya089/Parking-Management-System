document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const authModal = document.getElementById('authModal');
    const closeModal = document.querySelector('.auth-modal .close');
    const tabBtns = document.querySelectorAll('.auth-tabs .tab-btn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const adminLink = document.querySelector('.admin-link');

    // Current user (simulated - in real app would come from backend)
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

    // Initialize auth state
    function initAuthState() {
        if (currentUser) {
            // User is logged in
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'block';
            
            // Show admin link if user is admin
            if (currentUser.isAdmin && adminLink) {
                adminLink.style.display = 'block';
            } else if (adminLink) {
                adminLink.style.display = 'none';
            }
        } else {
            // User is not logged in
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'block';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (adminLink) adminLink.style.display = 'none';
        }
    }

    // Show auth modal
    function showAuthModal(tab = 'login') {
        if (authModal) {
            authModal.style.display = 'block';
            switchTab(tab);
        }
    }

    // Switch between login/register tabs
    function switchTab(tab) {
        tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        
        if (loginForm) loginForm.style.display = tab === 'login' ? 'block' : 'none';
        if (registerForm) registerForm.style.display = tab === 'register' ? 'block' : 'none';
    }

    // Close modal
    function closeAuthModal() {
        if (authModal) authModal.style.display = 'none';
    }

    // Show toast notification
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // Validate email format
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Validate password strength
    function isPasswordStrong(password) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return re.test(password);
    }

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            // Basic validation
            if (!email || !password) {
                showToast('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate API call - in a real app, this would be a fetch request
            setTimeout(() => {
                // Check against "registered" users in localStorage
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const user = users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    // Successful login
                    currentUser = {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        isAdmin: user.isAdmin || false
                    };
                    
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    showToast('Login successful!', 'success');
                    closeAuthModal();
                    initAuthState();
                    
                    // Redirect to home page or refresh
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                } else {
                    // Failed login
                    showToast('Invalid email or password', 'error');
                }
            }, 500);
        });
    }

    // Register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            
            // Basic validation
            if (!name || !email || !password || !confirmPassword) {
                showToast('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }
            
            if (!isPasswordStrong(password)) {
                showToast('Password must be at least 8 characters with uppercase, lowercase, and number', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showToast('Passwords do not match', 'error');
                return;
            }
            
            // Simulate API call - in a real app, this would be a fetch request
            setTimeout(() => {
                // Check if email already exists
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const emailExists = users.some(u => u.email === email);
                
                if (emailExists) {
                    showToast('Email already registered', 'error');
                    return;
                }
                
                // Create new user
                const newUser = {
                    id: Date.now().toString(),
                    name,
                    email,
                    password, // In a real app, this would be hashed
                    isAdmin: false,
                    createdAt: new Date().toISOString()
                };
                
                // Save to "database"
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
                
                // Auto-login the new user
                currentUser = {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    isAdmin: false
                };
                
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                showToast('Registration successful!', 'success');
                closeAuthModal();
                initAuthState();
                
                // Redirect to home page
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }, 500);
        });
    }

    // Password strength indicator
    const passwordInput = document.getElementById('registerPassword');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strengthBars = document.querySelectorAll('.strength-bar');
            const strengthText = document.querySelector('.strength-text');
            
            if (!password) {
                strengthBars.forEach(bar => bar.style.backgroundColor = '#eee');
                strengthText.textContent = '';
                return;
            }
            
            // Very simple strength calculation
            let strength = 0;
            if (password.length >= 6) strength++;
            if (password.length >= 8) strength++;
            if (/[A-Z]/.test(password)) strength++;
            if (/\d/.test(password)) strength++;
            if (/[^A-Za-z0-9]/.test(password)) strength++;
            
            // Update UI
            strengthBars.forEach((bar, index) => {
                if (index < strength) {
                    const colors = ['#e74c3c', '#f39c12', '#3498db', '#2ecc71', '#27ae60'];
                    bar.style.backgroundColor = colors[strength - 1];
                } else {
                    bar.style.backgroundColor = '#eee';
                }
            });
            
            const strengthLabels = ['Very weak', 'Weak', 'Moderate', 'Strong', 'Very strong'];
            strengthText.textContent = `Password strength: ${strengthLabels[strength - 1] || ''}`;
        });
    }

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Clear current user
            localStorage.removeItem('currentUser');
            currentUser = null;
            
            showToast('Logged out successfully', 'success');
            initAuthState();
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }

    // Event listeners for auth modal
    if (loginBtn) loginBtn.addEventListener('click', () => showAuthModal('login'));
    if (registerBtn) registerBtn.addEventListener('click', () => showAuthModal('register'));
    if (closeModal) closeModal.addEventListener('click', closeAuthModal);
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === authModal) {
            closeAuthModal();
        }
    });

    // Initialize auth state
    initAuthState();

    // Create a default admin user if none exists (for demo purposes)
    if (!localStorage.getItem('users')) {
        const defaultUsers = [
            {
                id: 'admin1',
                name: 'Admin User',
                email: 'admin@smartpark.com',
                password: 'Admin123', // In a real app, this would be hashed
                isAdmin: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 'user1',
                name: 'John Doe',
                email: 'john@example.com',
                password: 'Password123',
                isAdmin: false,
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
});