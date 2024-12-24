const baseURL = "http://127.0.0.1:8000/api/"; // Update this to your backend's base URL

// Function to login
async function login(username, password) {
    const response = await fetch(`${baseURL}accounts/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.token);
        window.location.href = "index.html"; // Redirect to dashboard
    } else {
        alert("Login failed!");
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
