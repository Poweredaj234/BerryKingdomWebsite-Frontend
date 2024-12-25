const userInfo = document.getElementById("user-info");
import { apibaseURL, baseURL } from "./config.js";
console.log("dashboard.js loaded successfully"); 

// Function to fetch user info
async function fetchUserInfo() {
    const token = localStorage.getItem("access_token");
    console.log("fetchUserInfo called");

    if (!token) {
        console.warn("Token not found. Redirecting to login.");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`${apibaseURL}accounts/users/`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error("Failed to fetch user info:", response.status);
            if (response.status === 401) {
                alert("Session expired. Please log in again.");
                logout();
            } else {
                alert("Failed to load user info. Please try again later.");
            }
            return;
        }

        const data = await response.json();
        if (data && data.length > 0) {
            const currentUser = data[0]; // Adjust based on backend response format
            console.log("User info fetched successfully:", currentUser);

            // Update the UI with user info
            const userInfoElement = document.getElementById("user-info");
            if (userInfoElement) {
                userInfoElement.textContent = `Balance: ${currentUser.balance || 0}, Nobility: ${currentUser.nobility || "Unknown"}, House: ${currentUser.house || "None"}`;
            } else {
                console.warn("#user-info element not found in the DOM.");
            }
        } else {
            console.warn("No user info found in the response.");
            alert("Failed to load user info.");
        }
    } catch (error) {
        console.error("Error fetching user info:", error.message, error.stack);
        alert("An error occurred while loading user info. Please try again later.");
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
        const response = await fetch(`${apibaseURL}accounts/validate-token/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            console.error("Token validation failed:", response.status);
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "login.html";
            return false;
        }

        const data = await response.json();
        console.log("Token is valid. User data:", data);

        return data; // Return user data if token is valid
    } catch (error) {
        console.error("Token validation error:", error.message, error.stack);
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
    console.log("DOM fully loaded and parsed.");
    const isValid = await validateToken(); // Assuming validateToken ensures token validity

    if (isValid) {
        console.log("Token validated. Fetching user info...");
        fetchUserInfo();
    } else {
        console.log("Invalid token. Redirecting to login.");
    }
});

// Register New Account button on login page
//document.addEventListener("DOMContentLoaded", () => {
//    const registerLink = document.getElementById("register-link");
//    if (registerLink) {
//        registerLink.href = `${baseURL}register.html`; // Dynamically set the href
//    }
//});