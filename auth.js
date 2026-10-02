/**
 * Authentication & API Integration for Repayment
 */

const API_CONFIG = {
    // Live backend URL from Swagger documentation
    BASE_URL: 'https://repayment-nmti.onrender.com', 
    ENDPOINTS: {
        REGISTER: '/api/v1/auth/register-user',
        LOGIN: '/api/v1/auth/login-user',
        ORDERS: '/api/v1/orders'
    },
    // Set to false to use the live backend
    MOCK_MODE: false 
};

/**
 * Handle User Registration
 * @param {Object} userData - { firstName, lastName, email, password, phone }
 */
async function registerUser(userData) {
    if (API_CONFIG.MOCK_MODE) {
        console.warn('AUTH: Mock Mode is ENABLED. No data is being sent to your database.');
        console.log('Mock Data Payload:', userData);
        return new Promise(resolve => setTimeout(() => resolve({ success: true, message: 'Mock registration successful' }), 1000));
    }

    const url = `${API_CONFIG.BASE_URL.replace(/\/$/, '')}${API_CONFIG.ENDPOINTS.REGISTER}`;
    console.log(`AUTH: Attempting Registration at ${url}`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        // Better error handling for non-JSON responses (like 405 Method Not Allowed)
        let data = {};
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            data = await response.json();
        }

        if (!response.ok) {
            // Log the full server response so you can see exactly which field failed
            console.error(`AUTH: API Error (${response.status})`, data);
            console.error('AUTH: Full server validation details:', JSON.stringify(data, null, 2));
            
            if (response.status === 405) {
                throw new Error('API Error: 405 Method Not Allowed. Please ensure your endpoint supports POST requests.');
            }

            // Handle cases where message is an array of validation errors (e.g. class-validator)
            let errorMessage;
            if (Array.isArray(data.message)) {
                errorMessage = data.message.join('\n');
                console.error('AUTH: Validation errors:\n' + errorMessage);
            } else {
                errorMessage = data.message || data.error || `Registration failed (Status: ${response.status})`;
            }
                
            throw new Error(errorMessage);
        }

        return { success: true, data };
    } catch (error) {
        console.error('Registration Error:', error);
        return { success: false, message: error.message };
    }
}

/**
 * Handle User Login
 * @param {Object} credentials - { email, password }
 */
async function loginUser(credentials) {
    if (API_CONFIG.MOCK_MODE) {
        console.warn('AUTH: Mock Mode is ENABLED. No real login is occurring.');
        console.log('Mock Login Attempt:', credentials);
        const mockUser = { id: 1, email: credentials.email, firstName: 'Test', lastName: 'User' };
        localStorage.setItem('auth_token', 'mock_token_123');
        localStorage.setItem('user_info', JSON.stringify(mockUser));
        return new Promise(resolve => setTimeout(() => resolve({ success: true, data: { user: mockUser } }), 1000));
    }

    const url = `${API_CONFIG.BASE_URL.replace(/\/$/, '')}${API_CONFIG.ENDPOINTS.LOGIN}`;
    console.log(`AUTH: Attempting Login at ${url}`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        let data = {};
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            data = await response.json();
        }

        if (!response.ok || data.status === 'error' || data.status === false || data.success === false || (data.statusCode && data.statusCode >= 400) || (data.code && data.code >= 400)) {
            console.error(`AUTH: API Error`, data);
            
            if (response.status === 405) {
                throw new Error('API Error: 405 Method Not Allowed. Please ensure your endpoint supports POST requests.');
            }

            const errorMessage = Array.isArray(data.message) 
                ? data.message.join(', ') 
                : (data.message || data.error || `Login failed (Status: ${response.status})`);

            throw new Error(errorMessage);
        }

        // Extract token and user info, handling the backend's resultData wrapper
        let token = data.token || data.accessToken || data.access_token;
        let user = data.user;
        
        if (!token && data.resultData) {
            if (typeof data.resultData === 'string') {
                token = data.resultData;
            } else if (typeof data.resultData === 'object') {
                token = data.resultData.token || data.resultData.accessToken || data.resultData.access_token;
                user = data.resultData.user || data.resultData;
            }
        }

        // Store token if returned
        if (token) {
            localStorage.setItem('auth_token', token);
        } else {
            console.warn('AUTH: Login successful but no token received.');
        }
        
        // Store user info if returned
        if (user && Object.keys(user).length > 0 && user !== token) {
            localStorage.setItem('user_info', JSON.stringify(user));
        }

        return { success: true, data };
    } catch (error) {
        console.error('Login Error:', error);
        return { success: false, message: error.message };
    }
}

/**
 * Logout User
 */
function logoutUser() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    window.location.href = 'login.html';
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    return !!localStorage.getItem('auth_token');
}

/**
 * Fetch Service Packages from Live API
 */
async function getServicePackages() {
    if (API_CONFIG.MOCK_MODE) {
        console.warn('AUTH: [MOCK] Returning mock service packages.');
        return new Promise(resolve => setTimeout(() => resolve({ 
            success: true, 
            data: [
                { id: "1", name: "Fraud Investigation Report", price: 3500, pricePerTx: 750, features: ["Case Review", "Evidence Gathering", "Investigation Report", "Recommended Action Plan"], isActive: true },
                { id: "2", name: "Full Support Package", price: 10000, pricePerTx: null, features: ["Personalized Consultation", "Implementation Support", "Monitoring & Feedback", "24/7 Support Hotline", "Everything in Basic"], isActive: true },
                { id: "3", name: "Crypto Tracing Report", price: 3500, pricePerTx: 750, features: ["Asset Movement Investigation", "Perpetrators Investigation", "Blockchain Analysis", "Recommended Action Plan"], isActive: true }
            ] 
        }), 600));
    }

    const baseUrl = API_CONFIG.BASE_URL.replace(/\/$/, '');
    const url = `${baseUrl}/api/v1/service-packages`;
    console.log(`AUTH: Fetching Service Packages from ${url}`);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'accept': 'application/json' }
        });

        const content = await response.json();
        console.log('AUTH: Raw service packages response:', content);

        if (!response.ok) {
            throw new Error(`Failed to fetch services (Status: ${response.status})`);
        }

        // Handle the "resultData" wrapper object from this backend
        let data = [];
        if (content && Array.isArray(content.resultData)) {
            data = content.resultData;
        } else if (Array.isArray(content)) {
            data = content;
        }

        console.log(`AUTH: Service packages loaded successfully — ${data.length} packages found.`, data);
        return { success: true, data };
    } catch (error) {
        console.error('AUTH: Service Packages Fetch Error:', error);
        return { success: false, message: error.message, data: [] };
    }
}

/**
 * Fetch total money retrieved for clients
 * Sums the "amountLost" field from all cases as a proxy for retrieved funds.
 * Replace with a dedicated stats endpoint if one becomes available.
 */
async function getRetrievedTotal() {
    if (API_CONFIG.MOCK_MODE) {
        console.warn('AUTH: [MOCK] Returning mock money retrieved total.');
        return { success: true, total: 14750000 };
    }

    const baseUrl = API_CONFIG.BASE_URL.replace(/\/$/, '');
    const url = `${baseUrl}/api/v1/cases`;
    console.log(`AUTH: Fetching total retrieved amount from ${url}`);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'accept': 'application/json' }
        });

        const content = await response.json();

        if (!response.ok) {
            throw new Error(`Failed to fetch cases (Status: ${response.status})`);
        }

        let cases = [];
        if (content && Array.isArray(content.resultData)) {
            cases = content.resultData;
        } else if (Array.isArray(content)) {
            cases = content;
        }

        // Sum all amountLost fields to get the total retrieved
        const total = cases.reduce((sum, c) => sum + (Number(c.amountLost) || 0), 0);
        console.log(`AUTH: Total retrieved amount = $${total.toLocaleString()} across ${cases.length} cases.`);
        return { success: true, total };
    } catch (error) {
        console.error('AUTH: Retrieved Total Fetch Error:', error);
        return { success: false, total: 0 };
    }
}

/**
 * Create an Order
 * @param {Object} orderData - { clientId, caseId, packageId, email, phone }
 */
async function createOrder(orderData) {
    if (API_CONFIG.MOCK_MODE) {
        console.warn('AUTH: Mock Mode is ENABLED. No real order is being sent.');
        console.log('Mock Order Attempt:', orderData);
        return new Promise(resolve => setTimeout(() => resolve({ success: true, data: { status: 'mock_success', message: 'Order submitted successfully in mock mode.' } }), 1000));
    }

    const url = `${API_CONFIG.BASE_URL.replace(/\/$/, '')}${API_CONFIG.ENDPOINTS.ORDERS}`;
    console.log(`AUTH: Attempting to create order at ${url}`);

    try {
        const token = localStorage.getItem('auth_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(orderData)
        });

        let data = {};
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            data = await response.json();
        }

        if (!response.ok || data.status === 'error' || data.status === false || data.success === false || (data.statusCode && data.statusCode >= 400) || (data.code && data.code >= 400)) {
            console.error(`AUTH: API Error creating order`, data);
            
            let errorMessage = data.message || `Order failed (Status: ${response.status})`;
            if (data.error && Array.isArray(data.error.details)) {
                errorMessage += ': ' + data.error.details.map(d => d.message || d).join(', ');
            } else if (Array.isArray(data.message)) {
                errorMessage = data.message.join(', ');
            } else if (typeof data.error === 'string') {
                errorMessage = data.error;
            }

            throw new Error(errorMessage);
        }

        return { success: true, data };
    } catch (error) {
        console.error('Order Error:', error);
        return { success: false, message: error.message };
    }
}

// Export functions to global scope for use in HTML files
window.auth = {
    registerUser,
    loginUser,
    logoutUser,
    isAuthenticated,
    getServicePackages,
    getRetrievedTotal,
    createOrder
};
