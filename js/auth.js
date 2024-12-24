const baseURL = "http://127.0.0.1:8000/api/"; // Update this to your backend's base URL

// Function to login
async function login(username, password) {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/accounts/token/', {
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
        alert('Login successful!');
        return data;
    } catch (error) {
        console.error(error);
        alert('Error during login.');
    }
}

// Function to logout
function logout() {
    localStorage.removeItem("authToken");
    window.location.href = "login.html";
}

// Function to check authentication
function isAuthenticated() {
    return !!localStorage.getItem("authToken");
}
