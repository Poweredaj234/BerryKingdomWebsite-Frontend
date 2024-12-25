import { apibaseURL, baseURL } from "./config.js";

// Function to login
export async function login(username, password) {
    try {
        const response = await fetch(`${apibaseURL}accounts/token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);

        //alert('Login successful!');
        // Redirect to the desired page (e.g., dashboard.html)
        window.location.href = `${baseURL}index.html`;
    } catch (error) {
        console.error(error);
        alert('Login failed. Check your credentials.');
    }
}

async function fetchProtectedData() {
    const accessToken = localStorage.getItem('access_token');

    const response = await fetch(`${apibaseURL}some-protected-endpoint/`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (response.status === 401) {
        alert('Unauthorized. Please log in again.');
    } else {
        const data = await response.json();
        console.log(data);
    }
}

async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refresh_token');

    const response = await fetch(`${apibaseURL}accounts/token/refresh/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        return data.access;
    } else {
        alert('Session expired. Please log in again.');
        return null;
    }
}

// Logout Function
export function logout() {
    if (confirm('Are you sure you want to log out?')) {
        // Clear tokens from localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        // Redirect to login page
        window.location.href = '/login.html';
    }
}

// Function to check authentication
function isAuthenticated() {
    return !!localStorage.getItem("authToken");
}
