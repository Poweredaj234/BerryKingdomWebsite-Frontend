import { apibaseURL } from "./config.js";

export async function playCoinToss(stake) {
    const token = localStorage.getItem("access_token");
    const resultElement = document.getElementById("result");

    if (!stake || stake <= 0) {
        resultElement.textContent = "Please enter a valid stake amount.";
        return;
    }

    try {
        const response = await fetch(`${apibaseURL}games/coin-toss/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ stake }),
        });

        if (response.ok) {
            const data = await response.json();
            resultElement.textContent = `Result: ${data.result}, Earnings: ${data.earnings}`;
        } else if (response.status === 401) {
            resultElement.textContent = "Unauthorized. Please log in.";
        } else {
            const errorData = await response.json();
            resultElement.textContent = `Error: ${errorData.detail || "An unknown error occurred."}`;
        }
    } catch (error) {
        console.error("Error playing Coin Toss:", error);
        resultElement.textContent = "A network error occurred. Please try again.";
    }
}

// Attach event listener
document.addEventListener("DOMContentLoaded", () => {
    const playButton = document.getElementById("play-game");
    if (playButton) {
        playButton.addEventListener("click", async () => {
            const stake = parseFloat(document.getElementById("stake").value);
            await playCoinToss(stake);
        });
    }
});
