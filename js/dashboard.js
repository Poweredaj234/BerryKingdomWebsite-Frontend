const userInfo = document.getElementById("user-info");
import { apibaseURL, baseURL, DEBUG } from "./config.js";
//console.log("dashboard.js loaded successfully"); 

//fetch user info
async function fetchUserInfo() {
    const token = localStorage.getItem("access_token");
    //console.log("fetchUserInfo called");

    if (!token) {
        if(DEBUG==1){console.warn("Access token not found. Redirecting to login.");}
        else{console.log(`${new Date().toISOString()} | AccessToken . %cFAIL`, "color:rgb(255, 60, 60); font-weight: bold;");}
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

        //console.log("API response status:", response.status);
        if (response.status == 200) {console.log(`${new Date().toISOString()} | API . . . . . %cOK`, "color: #2bff00; font-weight: bold;");}
        else{console.log(`${new Date().toISOString()} | API . . . . . %cFAIL`, "color:rgb(255, 60, 60); font-weight: bold;");}

        if (!response.ok) {
            //console.error("Failed to fetch user info:", response.status);
            if (response.status === 401) {
                alert("Session expired. Please log in again.");
                logout();
            } else {
                alert("Failed to load user info. Please try again later.");
            }
            return;
        }

        const data = await response.json();
        if(DEBUG==1){console.log("API response data:", data);}

        if (Array.isArray(data) && data.length > 0) {
            
            const tokenUser = localStorage.getItem("username");
            const currentUser = data.find(user => user.username === tokenUser);
            if(DEBUG==1){console.log("Matched user:", currentUser);console.log("Stored username:", tokenUser);}

            if (currentUser) {
                const userInfoElement = document.getElementById("user-info");
                if (userInfoElement) {
                    const nobilityTitles = {
                        0: 'King',
                        1: 'Archduke',
                        2: 'Prince',
                        3: 'Duke',
                        4: 'Marquess',
                        5: 'Count',
                        6: 'Viscount',
                        7: 'Baron',
                        8: 'Citizen',
                        9: 'Stateless',
                    };
                    const nobilityTitle = nobilityTitles[currentUser.nobility] || "Unknown";
                    userInfoElement.textContent = `Balance: $${currentUser.balance || 0}, Nobility: ${nobilityTitle || "Unknown"}, House: ${currentUser.house || "None"}`;
                } else {
                    console.warn("#user-info element not found in the DOM.");
                }
            } else {
                console.warn("Authenticated user not found in the response.");
                alert("Failed to load your user info.");
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
        if(DEBUG==1){console.warn("Access token not found. Redirecting to login.");}
        else{console.log(`${new Date().toISOString()} | AccessToken . %cFAIL`, "color:rgb(255, 60, 60); font-weight: bold;");}
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
            if(DEBUG==1){console.error("Token validation failed:", response.status)}
            else{console.log(`${new Date().toISOString()} | TokenValid. . %cFAIL`, "color:rgb(255, 60, 60); font-weight: bold;");}

            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("username");
            window.location.href = "login.html";
            return false;
        }

        const data = await response.json();
        if(DEBUG==1){console.log("Token is valid. User data:", data);}
        else{console.log(`${new Date().toISOString()} | TokenValid. . %cOK`, "color: #2bff00; font-weight: bold;");}


        // Store the username in localStorage
        localStorage.setItem("username", data.username);

        return data; // Return user data if token is valid
    } catch (error) {
        if(DEBUG==1){console.error("Token validation error:", error.message, error.stack);}
        else{console.log(`${new Date().toISOString()} | TokenValid. . %cFAIL`, "color:rgb(255, 60, 60); font-weight: bold;");}
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("username");
        window.location.href = "login.html";
        return false;
    }
}

// Function to handle logout
function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    window.location.href = "login.html";
}

async function fetchLeaderboard() {
    const token = localStorage.getItem("access_token");
    if (!token) {
        if (DEBUG == 1) {console.error("Access token not found");} 
        else {console.log(`${new Date().toISOString()} | AccessToken . %cFAIL`, "color:rgb(255, 60, 60); font-weight: bold;");}
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/api/accounts/leaderboard/", {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const leaderboardData = await response.json();
            const leaderboardContainer = document.getElementById("leaderboard");

            leaderboardContainer.innerHTML = leaderboardData
                .map((user, index) => `<p>${index + 1}. ${user.username} - Balance: $${user.balance}</p>`)
                .join("");
            console.log(`${new Date().toISOString()} | Leaderboard . %cOK`, "color: #2bff00; font-weight: bold;");  
        } else {
            if (DEBUG==1){console.error("Failed to load leaderboard:", response.status);}
            else{console.log(`${new Date().toISOString()} | LoadLBoard. . %cWARN`, "color:rgb(255, 155, 25); font-weight: bold;");}
        }
    } catch (error) {
        if (DEBUG==1){console.error("Error fetching leaderboard:", error);}
        else{console.log(`${new Date().toISOString()} | FetchLBoard . %cWARN`, "color:rgb(255, 155, 25); font-weight: bold;");}
    }
}

// Initialize dashboard
document.addEventListener("DOMContentLoaded", async () => {
    //console.log("DOM fully loaded and parsed.");
    console.log(
        `${new Date().toISOString()} | DomLoaded . . %cOK`, 
        "color: #2bff00; font-weight: bold;"
    );
    const isValid = await validateToken(); // Assuming validateToken ensures token validity

    if (isValid) {
        if (DEBUG==1) {console.log("Token validated. Fetching user info...");}
        else {console.log(
            `${new Date().toISOString()} | TokenValid. . %cOK`,
            "color: #2bff00; font-weight: bold;"
        );}
        fetchUserInfo();
        fetchLeaderboard();
    } else {
        if (DEBUG==1) {console.log("Invalid token. Redirecting to login.");}
        else {console.log(
            `${new Date().toISOString()} | TokenValid. . %cFAIL`, 
            "color:rgb(255, 60, 60); font-weight: bold;"
        );}
    }
});
// Register New Account button on login page
//document.addEventListener("DOMContentLoaded", () => {
//    const registerLink = document.getElementById("register-link");
//    if (registerLink) {
//        registerLink.href = `${baseURL}register.html`; // Dynamically set the href
//    }
//});