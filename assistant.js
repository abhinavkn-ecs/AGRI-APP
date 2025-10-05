// Get references to DOM elements
const inputBox = document.getElementById("input");
const outputBox = document.getElementById("output");

// Function to send user input to the API
async function send() {
    const userText = inputBox.value.trim();
    if (!userText) return;

    appendMessage("You", userText);   // Show user message
    inputBox.value = "";
    outputBox.innerHTML = "Loading...";

    try {
        const response = await fetch("http://127.0.0.1:8000/generate/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: userText })
        });

        const data = await response.json();
        appendMessage("Assistant", data.output || "No response");
    } catch (err) {
        appendMessage("Assistant", "Error: " + err);
    } finally {
        outputBox.innerHTML = ""; // clear loading if needed
    }
}

// Helper function to display messages
function appendMessage(sender, message) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", sender.toLowerCase());
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    outputBox.appendChild(msgDiv);
    outputBox.scrollTop = outputBox.scrollHeight;
}

// Optional: send message on Enter key
inputBox.addEventListener("keydown", function(e) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        send();
    }
});
