document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKeyInput');
  const editButton = document.getElementById('editButton');
  const saveButton = document.getElementById('saveButton');
  const deleteButton = document.getElementById('deleteButton');
  const statusMessage = document.getElementById('statusMessage');

  // Load API Key from storage
  chrome.storage.local.get('geminiApiKey', (data) => {
      if (data.geminiApiKey) {
          apiKeyInput.value = data.geminiApiKey;
          apiKeyInput.setAttribute('readonly', true);
          statusMessage.innerText = 'API Key loaded.';
          statusMessage.className = 'success';
      } else {
          statusMessage.innerText = 'No API key found. Please enter one.';
          statusMessage.className = 'warning';
      }
  });

  // Edit button functionality
  editButton.addEventListener('click', () => {
      apiKeyInput.removeAttribute('readonly');
      apiKeyInput.style.display = 'block';  // Show input field
      saveButton.style.display = 'inline-block'; // Show save button
      apiKeyInput.focus();
      statusMessage.innerText = 'You can now edit your API key.';
      statusMessage.className = 'warning';
  });

  // Save button functionality
  saveButton.addEventListener('click', () => {
      const apiKey = apiKeyInput.value.trim();
      if (apiKey) {
          chrome.storage.local.set({ geminiApiKey: apiKey }, () => {
              apiKeyInput.setAttribute('readonly', true);
              saveButton.style.display = 'none'; // Hide save button
              statusMessage.innerText = 'API Key saved successfully!';
              statusMessage.className = 'success';
          });
      } else {
          statusMessage.innerText = 'Please enter a valid API key.';
          statusMessage.className = 'warning';
      }
  });

  // Delete button functionality
  deleteButton.addEventListener('click', () => {
      chrome.storage.local.remove('geminiApiKey', () => {
          apiKeyInput.value = '';
          apiKeyInput.style.display = 'none'; // Hide input field
          saveButton.style.display = 'none'; // Hide save button
          statusMessage.innerText = 'API Key deleted.';
          statusMessage.className = 'warning';
      });
  });
});
