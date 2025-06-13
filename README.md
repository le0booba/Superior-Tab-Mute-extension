# Superior Tab Mute 🛠️

<p align="center">
  <div style="display: flex; justify-content: center; align-items: center; gap: 15px;">
      <img src="https://swrxa0dme81ptwbk.public.blob.vercel-storage.com/Screenshot%202025-06-12%20224424_result.jpg" width="243" alt="Описание 1">
    </a>
      <img src="https://swrxa0dme81ptwbk.public.blob.vercel-storage.com/Screenshot%202025-06-12%20224538_result.jpg" width="200" alt="Описание 2">
    </a>
      <img src="https://swrxa0dme81ptwbk.public.blob.vercel-storage.com/Screenshot%202025-06-12%20224450_result.jpg" width="200" alt="Описание 3">
    </a>
  </div>
</p>

## Brief Description 📖

Superior Tab Mute is a Chrome extension designed to provide advanced control over tab audio. It allows users to mute all tabs except specific ones based on various modes, such as the active tab, the first tab with sound, or user-defined whitelisted/blacklisted tabs and domains. With features like notifications, domain management, and export/import capabilities, it offers a robust solution for managing audio in Chrome.

## Features ✨

- 🎚️ **Multiple Muting Modes**:
  - Mute all tabs except the active tab.
  - Mute all tabs except the first tab that plays sound.
  - Whitelist mode: Mute all tabs except specific tabs or domains.
  - Blacklist mode: Mute only specific tabs or domains.
- 🔇 **Mute/Unmute All Tabs**: Toggle between muting and unmuting all tabs with a single button.
- 🌐 **Domain-Based Blacklist/Whitelist**: Add or remove domains to control audio based on website domains.
- 📥 **Export/Import Lists**: Save and load blacklist/whitelist settings (tabs and domains) as JSON files.
- 🔔 **Notifications**: Optional notifications for mute/unmute events.
- 🔄 **Start New Tabs Muted**: Option to automatically mute all new tabs.
- 💾 **Persistent Settings**: Tab and domain selections are saved across browser sessions.

## Installation 📦

1. **Clone or Download the Repository**:
   ```bash
   git clone https://github.com/your-username/superior-tab-mute.git
   ```
   Alternatively, download the ZIP file from GitHub and extract it.

2. **Load the Extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer mode** (toggle in the top-right corner).
   - Click **Load unpacked** and select the folder containing the extension files.
   - The extension should now appear in your extensions list and be ready to use.

3. **Verify Permissions**:
   - The extension requires `tabs`, `storage`, `notifications`, and `downloads` permissions to function correctly.

## How to Use 🚀

1. **Open the Extension**:
   - Click the extension icon in the Chrome toolbar to open the popup.

2. **Configure Settings**:
   - **Master Toggle**: Enable or disable the extension (📴 off by default).
   - **Notifications**: Toggle notifications for mute/unmute events (🔔 on by default).
   - **Mute New Tabs**: Enable to start all new tabs muted (🔇 off by default).
   - **Muting Mode**: Select a mode (active, first-sound, whitelist, or blacklist) via radio buttons.
   - **Mute/Unmute All Tabs**: Click to toggle muting/unmuting all tabs.
   - **First Sound Mode**: Set the active tab as the sound source with the "Set Active Tab as Sound Source" button.
   - **Whitelist/Blacklist**:
     - Select tabs from the audible tabs list to whitelist (unmute) or blacklist (mute).
     - Add domains (e.g., `example.com`) to the whitelist or blacklist using the domain input field.
     - Remove domains by clicking them in the domain list.
   - **Export/Import**: Export tab/domain lists to a JSON file or import them from a saved file.

3. **Manage Audio**:
   - The extension automatically applies muting rules based on the selected mode and settings.
   - Notifications (if enabled) will inform you when tabs are muted or unmuted.

## File Structure 📂

```
superior-tab-mute/
├── background.js        # Service worker handling muting logic and event listeners
├── popup.js             # Popup script for UI interactions and settings management
├── popup.html           # Popup UI structure
├── popup.css            # Styles for the popup UI
├── manifest.json        # Extension manifest with metadata and permissions
├── icons/               # Icon assets for the extension
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md            # This file
```

## License & Author Info 📜

**License**: MIT License  
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

**Author**: badrenton  
For questions or contributions, please open an issue or pull request on [GitHub](https://github.com/your-username/superior-tab-mute).
