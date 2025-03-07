# AZ Helper Chrome Extension

## Overview
AZ Helper is a Chrome extension designed to enhance the user experience on coding problem platforms by providing an AI-powered chatbot assistant. The chatbot is injected into problem pages, allowing users to retrieve saved code snippets, discuss problems, and maintain conversation history.

## Features
- **Chat Overlay**: A user-friendly chat interface with a dark theme and modern UI.
- **Persistent Conversation History**: Stores chat history per problem in `localStorage`.
- **Retrieve Code Snippets**: Fetches saved code for a problem from `localStorage`.
- **Smart Chat Button**: Replaces the existing "Ask Doubt" button with "AZ Helper".
- **Clear Chat History**: Users can reset the chat conversation.
- **Close Chat Overlay**: Allows users to exit the chat interface.
- **Auto-Detect Problem ID**: Identifies the problem ID from the URL for context-aware assistance.

## Installation
1. Download the extension files.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer Mode** (toggle at the top-right corner).
4. Click **Load Unpacked** and select the extension folder.
5. The AZ Helper button will now be available on supported pages.

## How It Works
### **Chat Button Injection**
- The extension detects if the user is on a problem page.
- It clones the existing "Ask Doubt" button, renames it "AZ Helper," and adds an icon.
- Clicking the button opens the chat overlay.

### **Chat Overlay UI**
- **Header**: Displays the title and includes buttons to close or clear chat history.
- **Chat Body**: Shows conversation history and newly sent messages.
- **Footer**: Contains an input field and send button for messages.

### **Persistent Storage**
- **Chat History**: Stored in `localStorage` using `conversationHistory` with the problem ID as a key.
- **Code Snippets**: Retrieved using a key format `course_<userId>_<problemId>_<language>`.
- **Editor Language**: Extracted from `localStorage` to ensure relevant code snippets.

## How to Use
1. Navigate to a problem page.
2. Click the "AZ Helper" button.
3. Type messages to interact with the chatbot.
4. View and retrieve saved code snippets.
5. Click **Clear** to reset the conversation.
6. Click **X** to close the chat.

## Technologies Used
- **JavaScript** for injecting the chatbot UI and handling interactions.
- **localStorage** for persistent chat and code storage.
- **CSS** for a modern UI with a dark theme.
- **MutationObserver** for dynamically injecting the chat button.

## Future Enhancements
- **AI-powered responses** for problem-solving assistance.
- **Integration with external APIs** for code execution.
- **User Authentication** for personalized experiences.

## Troubleshooting
- If the button does not appear, refresh the page.
- Ensure `localStorage` is enabled in browser settings.
- If issues persist, try reloading the extension.

## License
This extension is open-source and available for modifications. Contributions are welcome!

