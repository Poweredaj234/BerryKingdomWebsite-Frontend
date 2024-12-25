const userInfo = document.getElementById("user-info");
const baseURL = "http://127.0.0.1:8000/api/"; // Make sure this matches your backend base URL

// Function to fetch user info
async function fetchUserInfo() {
    const token = localStorage.getItem("access_token");

    if (!token) {
        console.warn("Token not found. Redirecting to login.");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`${baseURL}accounts/users/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log("User info fetched successfully:", data);

            // Update the UI with user info
            userInfo.textContent = `Balance: ${data.balance}, Nobility: ${data.nobility}, House: ${data.house}`;
        } else {
            console.error("Failed to fetch user info:", response.status);
            if (response.status === 401) {
                alert("Session expired. Please log in again.");
                logout();
            } else {
                alert("Failed to load user info. Please try again later.");
            }
        }
    } catch (error) {
        console.error("Error fetching user info:", error);
        alert("An error occurred while loading user info.");
    }
}

// Function to validate token
async function validateToken() {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
        console.warn("Access token not found. Redirecting to login.");
        window.location.href = "login.html";
        return false;
    }

    try {
        const response = await fetch(`${baseURL}accounts/validate-token/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            console.error("Token validation failed:", response.status);
            throw new Error("Invalid token");
        }

        const data = await response.json();
        console.log("Token is valid. User data:", data);

        return data; // Return user data if token is valid
    } catch (error) {
        console.error("Token validation error:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "login.html";
        return false;
    }
}

// Function to handle logout
function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "login.html";
}

// Initialize dashboard
document.addEventListener("DOMContentLoaded", async () => {
    const isValid = await validateToken();

    if (isValid) {
        fetchUserInfo();
    }
});
