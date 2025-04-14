// Error tracking utility
class ErrorTracker {
    constructor() {
        this.errors = [];
    }

    logError(error, context = {}) {
        const errorEntry = {
            timestamp: new Date().toISOString(),
            error: error.message || error,
            stack: error.stack,
            context: context,
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        this.errors.push(errorEntry);
        console.error('Error logged:', errorEntry);

        // In production, you would send this to your error tracking service
        // this.sendToErrorTrackingService(errorEntry);
    }

    // Example method to send errors to a tracking service
    async sendToErrorTrackingService(errorEntry) {
        try {
            const response = await fetch('/api/error-tracking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': this.getCsrfToken()
                },
                body: JSON.stringify(errorEntry)
            });

            if (!response.ok) {
                throw new Error('Failed to send error to tracking service');
            }
        } catch (error) {
            console.error('Failed to send error to tracking service:', error);
        }
    }
}

// CSRF Protection utility
class CsrfProtection {
    constructor() {
        this.token = this.generateToken();
        this.setupCsrfToken();
    }

    generateToken() {
        const array = new Uint32Array(8);
        window.crypto.getRandomValues(array);
        return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
    }

    setupCsrfToken() {
        // Store token in a secure cookie
        document.cookie = `csrf_token=${this.token}; path=/; secure; samesite=strict`;
        
        // Also store in localStorage for easy access
        localStorage.setItem('csrf_token', this.token);
    }

    getCsrfToken() {
        return localStorage.getItem('csrf_token') || this.token;
    }

    validateToken(token) {
        return token === this.getCsrfToken();
    }

    // Add CSRF token to fetch requests
    async fetchWithCsrf(url, options = {}) {
        const headers = {
            ...options.headers,
            'X-CSRF-Token': this.getCsrfToken()
        };

        const response = await fetch(url, {
            ...options,
            headers
        });

        if (response.status === 403) {
            throw new Error('CSRF token validation failed');
        }

        return response;
    }
}

// Export utilities
export const errorTracker = new ErrorTracker();
export const csrfProtection = new CsrfProtection(); 