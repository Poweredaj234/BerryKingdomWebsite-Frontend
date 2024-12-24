const baseSocketURL = `ws://${window.location.host}/ws/chat/`;
let chatSocket;

document.addEventListener("DOMContentLoaded", () => {
    const chatLog = document.getElementById("chat-log");
    const messageInput = document.getElementById("chat-message-input");
    const sendButton = document.getElementById("chat-send-button");

    // Initialize WebSocket connection
    chatSocket = new WebSocket(baseSocketURL);

    // Handle incoming messages
    chatSocket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        const messageElement = document.createElement("div");
        messageElement.textContent = `${data.user}: ${data.message}`;
        chatLog.appendChild(messageElement);
        chatLog.scrollTop = chatLog.scrollHeight; // Auto-scroll
    };

    // Handle WebSocket closure
    chatSocket.onclose = function (e) {
        console.error("Chat socket closed unexpectedly");
        alert("Connection to the chat server was lost.");
    };

    // Send message on button click
    sendButton.onclick = function () {
        const message = messageInput.value;
        if (message.trim() === "") {
            alert("Message cannot be empty");
            return;
        }

        chatSocket.send(
            JSON.stringify({
                message: message,
            })
        );
        messageInput.value = "";
    };

    // Send message on Enter key
    messageInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            sendButton.click();
        }
    });
});
