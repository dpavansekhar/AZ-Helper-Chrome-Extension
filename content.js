// --- Inject Updated CSS for Full-Page Chat Overlay ---
const style = document.createElement('style');
style.textContent = `
   .chat-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(31, 42, 59, 0.8); /* Semi-transparent dark overlay */
    backdrop-filter: blur(10px); /* Background blur effect */
    z-index: 1001;
    display: flex;
    justify-content: center;
    align-items: center;
}

.chat-container {
    background: #1F2A3B;
    width: 80%;
    height: 90%;
    display: flex;
    flex-direction: column;
    font-family: 'Poppins', sans-serif;
    box-shadow: none;
    border: none;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
}

/* Small line at the top */
.chat-container::before {
    content: "";
    width: 50px;
    height: 4px;
    background: #88A2C2;
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 2px;
}

.chat-header {
    background: linear-gradient(45deg, #2D3C51, #557486);
    color: white;
    padding: 16px;
    font-size: 22px;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 12px 12px 0 0;
}

.chat-header button {
    background: transparent;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
}

.chat-body {
    padding: 16px;
    overflow-y: auto;
    flex-grow: 1;
    background: #222B39;
    color: white;
}

.chat-footer {
    display: flex;
    padding: 12px;
    background: #2D3C51;
    border-radius: 0 0 12px 12px;
}

.chat-input {
    flex-grow: 1;
    border: none;
    padding: 12px;
    font-size: 16px;
    background: #1F2A3B;
    border-radius: 8px;
    color: white;
}

.chat-send {
    background: #557486;
    color: white;
    border: none;
    padding: 12px 18px;
    margin-left: 12px;
    border-radius: 8px;
    cursor: pointer;
}

.chat-message {
    margin: 8px 0;
    padding: 10px 14px;
    border-radius: 6px;
    font-size: 1.1em;
    max-width: 80%;
    word-wrap: break-word;
}

.chat-message.user {
    background: #557486;
    color: #000;
}

.chat-message.bot {
    background: #2D3C51;
    color: white;
}
`;
document.head.appendChild(style);

// --- Unload Detection ---
let isUnloading = false;
window.addEventListener("beforeunload", () => {
  isUnloading = true;
});

// --- Utility Functions ---
// Extract current problem ID from URL (assumes URL like /problems/<problemId>)
function getProblemId() {
  const path = window.location.pathname;
  if (path.startsWith("/problems/")) {
    return path.substring("/problems/".length);
  }
  return "default";
}
const currentProblemId = getProblemId();

// --- Retrieve Code from localStorage ---
// Assumes keys in localStorage follow the format: "course_40398_<problemId>_<language>"
// Note: "40398" is treated here as a unique user ID.
function getCodeFromLocalStorage(problemId, userId = "40398") {
  const editorLanguage = localStorage.getItem("editor-language") || "Java";
  const key = `course_${userId}_${problemId}_${editorLanguage}`;
  const code = localStorage.getItem(key) || "// Write your code here";
  return { editorLanguage, code };
}

// --- Conversation History using localStorage ---
// Chat history is stored under "conversationHistory" as a JSON‑serialized object keyed by problem ID.
function loadConversationHistory() {
  const stored = localStorage.getItem("conversationHistory");
  if (stored) {
    const chatHistories = JSON.parse(stored);
    return chatHistories[currentProblemId] || [];
  }
  return [];
}

function saveConversationHistory(history) {
  const stored = localStorage.getItem("conversationHistory");
  const chatHistories = stored ? JSON.parse(stored) : {};
  chatHistories[currentProblemId] = history;
  localStorage.setItem("conversationHistory", JSON.stringify(chatHistories));
}

let conversationHistory = [];

// --- Helper Function to Check for Greetings ---
function isGreeting(text) {
  const greetings = ["hi", "hello", "hey", "greetings"];
  return greetings.includes(text.trim().toLowerCase());
}


// --- Chat Button Injection ---
function addChatBotButton() {
  if (!onProblemsPage() || document.getElementById("chat-bot-button")) return;

  // Select the original button
  const originalButton = document.querySelector('.ant-btn.css-19gw05y.ant-btn-default.Button_gradient_light_button__ZDAR_.coding_ask_doubt_button__FjwXJ.gap-1.py-2.px-3.overflow-hidden');

  if (!originalButton) {
      console.error("❌ Original button NOT found! Check if the page has fully loaded.");
      return;
  }

  console.log("✅ Original button found!");

  // Clone the button
  const newButton = originalButton.cloneNode(true);
  newButton.id = "chat-bot-button"; // Set a unique ID

  // Change the button text
  const spanElement = newButton.querySelector('span');
  if (spanElement) {
      spanElement.textContent = "AZ Helper"; // New text
  }

  // Remove existing SVG icon if present
  const existingIcon = newButton.querySelector("svg");
  if (existingIcon) {
      existingIcon.remove();
  }

  // Create a new image element for the icon
  const newIcon = document.createElement("img");
  newIcon.src = "https://img.freepik.com/free-vector/cartoon-style-robot-vectorart_78370-4103.jpg?t=st=1741352355~exp=1741355955~hmac=64d0f6e65504a29ce36d741eeb2c218bb76bae623943cad298edd6691d669954&w=900"; // Local asset
  newIcon.alt = "AZ Helper"; // Alt text
  newIcon.style.width = "20px"; // Set width
  newIcon.style.height = "20px"; // Set height
  newIcon.style.marginRight = "5px"; // Add spacing

  // Insert the new image at the beginning of the button
  newButton.insertBefore(newIcon, newButton.firstChild);

  // Insert the new button after the original one
  originalButton.parentNode.insertBefore(newButton, originalButton.nextSibling);

  // Add event listener to open chatbot
  newButton.addEventListener("click", openChatBot);
}

function onProblemsPage() {
  return window.location.pathname.startsWith("/problems/");
}

function getProblemDetails() {
  return document.body.innerText.trim();
}

// Observe DOM changes to inject the chat button.
const observer = new MutationObserver(() => {
  addChatBotButton();
});
observer.observe(document.body, { childList: true, subtree: true });
addChatBotButton();

// --- Open Chat Overlay ---
function openChatBot() {
  const extractedText = getProblemDetails();
  conversationHistory = loadConversationHistory();

  // Retrieve code snippet and editor language for current problem.
  const { editorLanguage, code } = getCodeFromLocalStorage(currentProblemId);

  // Create overlay and container.
  const overlay = document.createElement("div");
  overlay.id = "chatBotOverlay";
  overlay.className = "chat-overlay";

  const chatContainer = document.createElement("div");
  chatContainer.className = "chat-container";

  // Header with title and control buttons.
  const header = document.createElement("div");
  header.className = "chat-header";
  const title = document.createElement("span");
  title.innerText = "AZ Helper 🤖";
  header.appendChild(title);

  const headerControls = document.createElement("div");

  const clearButton = document.createElement("button");
  clearButton.innerText = "Clear";
  clearButton.addEventListener("click", () => {
    conversationHistory = [];
    saveConversationHistory(conversationHistory);
    chatBody.innerHTML = "";
  });
  headerControls.appendChild(clearButton);

  const closeButton = document.createElement("button");
  closeButton.innerText = "X";
  closeButton.addEventListener("click", () => {
    document.body.removeChild(overlay);
  });
  headerControls.appendChild(closeButton);
  header.appendChild(headerControls);
  chatContainer.appendChild(header);

  // Chat body for messages.
  const chatBody = document.createElement("div");
  chatBody.className = "chat-body";
  chatContainer.appendChild(chatBody);

  // Display previous conversation messages.
  conversationHistory.forEach(msg => {
    appendMessage(msg.sender, msg.text);
  });

  // Footer with input field and send button.
  const footer = document.createElement("div");
  footer.className = "chat-footer";
  const chatInput = document.createElement("input");
  chatInput.type = "text";
  chatInput.placeholder = "Type your message...";
  chatInput.className = "chat-input";
  footer.appendChild(chatInput);
  const sendButton = document.createElement("button");
  sendButton.innerText = "Send";
  sendButton.className = "chat-send";
  footer.appendChild(sendButton);
  chatContainer.appendChild(footer);

  overlay.appendChild(chatContainer);
  document.body.appendChild(overlay);

  // Helper function to append messages.
  function appendMessage(sender, text) {
    const messageElem = document.createElement("div");
    messageElem.className = "chat-message " + (sender === "User" ? "user" : "bot");
    messageElem.innerText = sender + ": " + text;
    chatBody.appendChild(messageElem);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  // Send message on button click or Enter key.
  sendButton.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

function sendMessage() {
    const userQuery = chatInput.value.trim();
    if (!userQuery) return;
    
    // Save the user's message.
    conversationHistory.push({ sender: "User", text: userQuery });
    saveConversationHistory(conversationHistory);
    appendMessage("User", userQuery);
    chatInput.value = "";

    // --- Intercept query for first non-greeting question ---
    if (userQuery.toLowerCase().includes("what is the first question i asked")) {
      const firstUserMsg = conversationHistory.find(
        msg => msg.sender === "User" && !isGreeting(msg.text)
      );
      let reply = firstUserMsg ? "You asked: " + firstUserMsg.text : "No valid question found.";
      appendMessage("Bot", reply);
      conversationHistory.push({ sender: "Bot", text: reply });
      saveConversationHistory(conversationHistory);
      return;
    }
    // --- End interception for first question ---

    // --- Intercept query for code retrieval ---
    if (
      userQuery.toLowerCase().includes("what is the code that i have written") ||
      userQuery.toLowerCase().includes("give me code that i have written") ||
      userQuery.toLowerCase().includes("what is the code in the code editor") ||
      userQuery.toLowerCase().includes("give me the code")
    ) {
      const placeholder = "// Write your code here";
      let reply = "";
      if (code.trim() === placeholder.trim() || code.trim() === "") {
        reply = "I can't see any code written by you.";
      } else {
        reply = `Here is the code you have written for problem ${currentProblemId} in ${editorLanguage}:\n\n\`\`\`${editorLanguage.toLowerCase()}\n${code}\n\`\`\``;
      }
      appendMessage("Bot", reply);
      conversationHistory.push({ sender: "Bot", text: reply });
      saveConversationHistory(conversationHistory);
      return;
    }
    // --- End interception for code retrieval ---

    // Build the conversation text for the Gemini API query.
    const conversationText = conversationHistory
      .map(msg => `${msg.sender}: ${msg.text}`)
      .join("\n");

    const finalQuery = 
      "Talk normally if it is general talk like hi, who are you, and tell that I am a problem helper if and only if the user talks that way, that's it. " +
      "You are a AZ Helper that helps with the coding problem present in the extracted text. " +
      extractedText +
      "\n\nAdditionally, here is the code for problem " + currentProblemId +
      " in " + editorLanguage + ":\n" + code +
      "\n\nBased strictly on the above content, provide a clear, step-by-step solution or explanation for the following query in plain sentences. " +
      "\nConversation History:\n" + conversationText +
      "\nUser Query: " + userQuery;

    chrome.runtime.sendMessage({ type: "processQuery", query: finalQuery }, (response) => {
      if (chrome.runtime.lastError || isUnloading) {
        console.error("Runtime error or page unloading:", chrome.runtime.lastError);
        return;
      }
      if (response && response.answer) {
        appendMessage("Bot", response.answer);
        conversationHistory.push({ sender: "Bot", text: response.answer });
        saveConversationHistory(conversationHistory);
      } else {
        appendMessage("Bot", "Sorry, something went wrong.");
        conversationHistory.push({ sender: "Bot", text: "Sorry, something went wrong." });
        saveConversationHistory(conversationHistory);
      }
    });
  }
}

function closeChatOnPageChange() {
  window.addEventListener("beforeunload", () => {
      const chatOverlay = document.getElementById("chatBotOverlay");
      if (chatOverlay) {
          document.body.removeChild(chatOverlay);
      }
  });
}

// Initialize function
closeChatOnPageChange();
