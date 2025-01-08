import { redisURL, DEBUG } from "./config.js"
const baseSocketURL = `ws:${redisURL}ws/chat/`;
let chatSocket;

document.addEventListener("DOMContentLoaded", () => {
    const chatLog = document.getElementById("chat-log");
    const messageInput = document.getElementById("chat-message-input");
    const sendButton = document.getElementById("chat-send-button");

    try {
        // Initialize WebSocket connection
        chatSocket = new WebSocket(baseSocketURL);
        console.log(`${new Date().toISOString()} | Chat. . . . . %cOK`, "color: #2bff00; font-weight: bold;");  

        // Handle incoming messages
        chatSocket.onmessage = function (e) {
            const data = JSON.parse(e.data);
            const messageElement = document.createElement("div");
            messageElement.textContent = `${data.user}: ${data.message}`;
            chatLog.appendChild(messageElement);
            chatLog.scrollTop = chatLog.scrollHeight; // Auto-scroll
        };

        chatSocket.onerror = function (e) {
            //console.error("WebSocket error:", e);
            console.log(`${new Date().toISOString()} | Chat. . . . . %cWARN`, "color:rgb(255, 155, 25); font-weight: bold;");
        };

        // Handle WebSocket closure
        chatSocket.onclose = function (e) {
            //console.error("Chat socket closed unexpectedly");
            console.log(`${new Date().toISOString()} | ChatClosed. . %cWARN`, "color:rgb(255, 155, 25); font-weight: bold;");
            //alert("Connection to the chat server was lost.");
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
        }
    catch (error) {
        if(DEBUG==1){console.error(error)}
        else{console.log(`${new Date().toISOString()} | ChatE . . . . %cWARN`, "color:rgb(255, 155, 25); font-weight: bold;");}
    }

    
});
