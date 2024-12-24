const userInfo = document.getElementById("user-info");

async function fetchUserInfo() {
    const token = localStorage.getItem("authToken");
    if (!token) {
        window.location.href = "login.html"; // Redirect if not logged in
        return;
    }

    const response = await fetch(`${baseURL}accounts/users/`, {
        headers: {
            Authorization: `Token ${token}`,
        },
    });

    if (response.ok) {
        const data = await response.json();
        userInfo.textContent = `Balance: ${data.balance}, Nobility: ${data.nobility}, House: ${data.house}`;
    } else {
        alert("Failed to load user info.");
        logout();
    }
}

fetchUserInfo();
