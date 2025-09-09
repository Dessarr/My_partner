// Secure Authentication System
class SecureAuth {
    constructor() {
        this.sessionKey = 'owl_auth_session';
        this.maxAttempts = 3;
        this.lockoutTime = 5 * 60 * 1000; // 5 minutes
        this.sessionTimeout = 60 * 60 * 1000; // 60 minutes
        
        // Secure credentials (in real app, this would be hashed and stored server-side)
        this.validCredentials = {
            username: 'azumi',
            password: '090908'
        };
        
        this.init();
    }
    
    init() {
        this.checkSession();
        this.setupEventListeners();
        this.preventDirectAccess();
    }
    
    // Input sanitization to prevent injection attacks
    sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        
        // Remove potentially dangerous characters
        return input
            .replace(/[<>\"'%;()&+]/g, '') // Remove SQL injection chars
            .replace(/script/gi, '') // Remove script tags
            .replace(/javascript/gi, '') // Remove javascript
            .replace(/on\w+=/gi, '') // Remove event handlers
            .trim()
            .substring(0, 50); // Limit length
    }
    
    // Validate input format
    validateInput(username, password) {
        const errors = [];
        
        // Username validation (case-insensitive)
        if (!username || username.length < 3) {
            errors.push('Username must be at least 3 characters');
        }
        
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            errors.push('Username can only contain letters, numbers, and underscores');
        }
        
        // Password validation
        if (!password || password.length < 6) {
            errors.push('Password must be at least 6 characters');
        }
        
        if (password.length > 50) {
            errors.push('Password is too long');
        }
        
        return errors;
    }
    
    // Rate limiting to prevent brute force
    checkRateLimit() {
        const attempts = this.getAttempts();
        const lastAttempt = attempts.timestamp;
        const now = Date.now();
        
        if (attempts.count >= this.maxAttempts) {
            if (now - lastAttempt < this.lockoutTime) {
                const remainingTime = Math.ceil((this.lockoutTime - (now - lastAttempt)) / 1000);
                throw new Error(`Too many failed attempts. Try again in ${remainingTime} seconds.`);
            } else {
                // Reset attempts after lockout period
                this.resetAttempts();
            }
        }
    }
    
    // Track failed login attempts
    recordFailedAttempt() {
        const attempts = this.getAttempts();
        attempts.count += 1;
        attempts.timestamp = Date.now();
        localStorage.setItem('owl_login_attempts', JSON.stringify(attempts));
    }
    
    // Get failed attempts
    getAttempts() {
        const stored = localStorage.getItem('owl_login_attempts');
        return stored ? JSON.parse(stored) : { count: 0, timestamp: 0 };
    }
    
    // Reset failed attempts
    resetAttempts() {
        localStorage.removeItem('owl_login_attempts');
    }
    
    // Create secure session
    createSession() {
        const sessionData = {
            authenticated: true,
            timestamp: Date.now(),
            sessionId: this.generateSessionId()
        };
        
        // Store session with expiration
        sessionStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
        
        // Also store in localStorage for persistence (with timeout)
        localStorage.setItem(this.sessionKey, JSON.stringify({
            ...sessionData,
            expires: Date.now() + this.sessionTimeout
        }));
    }
    
    // Generate secure session ID
    generateSessionId() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    // Check if session is valid
    checkSession() {
        const sessionData = this.getSession();
        
        if (!sessionData) {
            this.redirectToLogin();
            return false;
        }
        
        // Check if session has expired
        if (Date.now() - sessionData.timestamp > this.sessionTimeout) {
            this.destroySession();
            this.redirectToLogin();
            return false;
        }
        
        return true;
    }
    
    // Get current session
    getSession() {
        // Check sessionStorage first (more secure)
        let sessionData = sessionStorage.getItem(this.sessionKey);
        
        if (sessionData) {
            return JSON.parse(sessionData);
        }
        
        // Fallback to localStorage
        sessionData = localStorage.getItem(this.sessionKey);
        
        if (sessionData) {
            const parsed = JSON.parse(sessionData);
            
            // Check if localStorage session has expired
            if (parsed.expires && Date.now() > parsed.expires) {
                this.destroySession();
                return null;
            }
            
            return parsed;
        }
        
        return null;
    }
    
    // Destroy session
    destroySession() {
        sessionStorage.removeItem(this.sessionKey);
        localStorage.removeItem(this.sessionKey);
        localStorage.removeItem('owl_login_attempts');
    }
    
    // Redirect to login page
    redirectToLogin() {
        if (window.location.pathname !== '/login.html' && !window.location.pathname.endsWith('login.html')) {
            window.location.href = 'login.html';
        }
    }
    
    // Prevent direct access to protected pages
    preventDirectAccess() {
        if (window.location.pathname.includes('index.html') || 
            window.location.pathname === '/' || 
            window.location.pathname.endsWith('/')) {
            
            if (!this.checkSession()) {
                return;
            }
        }
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Auto-logout on page unload (optional)
        window.addEventListener('beforeunload', () => {
            // Keep session for single tab, but could clear here for security
        });
        
        // Check session periodically
        setInterval(() => {
            if (!this.checkSession()) {
                this.redirectToLogin();
            }
        }, 60000); // Check every minute
    }
    
    // Login function
    async login(username, password) {
        try {
            // Check rate limiting
            this.checkRateLimit();
            
            // Sanitize inputs
            const cleanUsername = this.sanitizeInput(username);
            const cleanPassword = this.sanitizeInput(password);
            
            // Validate inputs
            const validationErrors = this.validateInput(cleanUsername, cleanPassword);
            if (validationErrors.length > 0) {
                throw new Error(validationErrors.join(', '));
            }
            
            // Simulate network delay to prevent timing attacks
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
            
            // Check credentials (case-insensitive username comparison)
            // This allows: Azumi, AZUMI, azumI, etc. to all work
            const usernameMatch = cleanUsername.toLowerCase() === this.validCredentials.username.toLowerCase();
            const passwordMatch = cleanPassword === this.validCredentials.password;
            
            
            if (usernameMatch && passwordMatch) {
                
                // Reset failed attempts on successful login
                this.resetAttempts();
                
                // Create session
                this.createSession();
                
                return { success: true, message: 'Login successful!' };
            } else {
                // Record failed attempt
                this.recordFailedAttempt();
                throw new Error('Invalid username or password');
            }
            
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
    
    // Logout function
    logout() {
        this.destroySession();
        this.redirectToLogin();
    }
    
    // Check if user is authenticated
    isAuthenticated() {
        return this.checkSession();
    }
}

// Initialize authentication system
const auth = new SecureAuth();

// Export for use in other files
window.auth = auth;
