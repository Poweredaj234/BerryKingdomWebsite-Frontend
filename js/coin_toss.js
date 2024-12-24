async function playCoinToss() {
    const stake = document.getElementById("stake").value;
    const token = localStorage.getItem("authToken");

    const response = await fetch(`${baseURL}games/coin-toss/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ stake }),
    });

    const result = document.getElementById("result");

    if (response.ok) {
        const data = await response.json();
        result.textContent = `Result: ${data.result}, Earnings: ${data.earnings}`;
    } else {
        result.textContent = "An error occurred. Please try again.";
    }
}
