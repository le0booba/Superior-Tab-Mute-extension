# Superior Tab Mute

A Chrome extension for advanced audio control, allowing users to manage tab audio with precision by muting all tabs except the active tab, the first tab with sound, or a specific chosen tab.

<p align="center">
  <img src="https://img.shields.io/badge/Chrome-v100%2B-blue?logo=google-chrome&logoColor=white" alt="Chrome Version">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT">
  <img src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" alt="Maintained">
  <img src="https://img.shields.io/badge/version-1.5.4-orange" alt="Version 1.5.4">
</p>

---

## ✨ Features

- **Selective Muting**: Mute all tabs except the active tab, the first tab that plays sound, or a specific tab.
- **Blacklist/Whitelist Modes**: Mute or unmute tabs based on user-defined preferences.
- **Toggle Controls**: Enable/disable the extension or mute all tabs with hotkeys (`Alt+Shift+S`, `Alt+Shift+M`).
- **Dynamic UI**: Displays current sound source and allows tab selection in whitelist mode.
- **Icon Feedback**: Visual indication of extension status (enabled, disabled, or all muted).
- **Persistent Settings**: Uses Chrome’s `storage.sync` for saving user preferences.

---

## 🛠️ Installation

1. **Download the Extension**:
   - Clone the repository: `git clone https://github.com/badrenton/Superior_Tab_Mute.git`
   - Or download the ZIP file from the [GitHub releases page](https://github.com/le0booba/Superior_Tab_Mute/releases).

2. **Load in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer mode** (toggle in the top-right corner).
   - Click **Load unpacked** and select the folder containing the extension files.
   - The extension will appear in your Chrome toolbar.

3. **Verify**:
   - Click the extension icon to open the popup and confirm it’s installed.

---

## 📖 How to Use

1. **Open the Popup**:
   - Click the extension icon in the Chrome toolbar to access the control panel.
   - Use the **Master Toggle** to enable or disable the extension.

2. **Select Muting Mode**:
   - Choose from:
     - **Mute all except active tab**: Only the currently active tab plays sound.
     - **Mute all except first tab**: The first tab that plays sound remains unmuted.
     - **Mute all except a specific tab**: Select a specific tab to unmute (whitelist mode).

3. **Manage Audio**:
   - Use `Alt+Shift+M` to toggle muting all tabs.
   - In "first tab with sound" mode, click **Refresh** to set the active tab as the sound source.
   - In whitelist mode, select a tab from the list to unmute.

4. **Customize Shortcuts**:
   - Adjust shortcuts via `chrome://extensions/shortcuts`.

---

## ⚙️ Configuration & Options

<details>
<summary>Click to view available options</summary>

- **Master Toggle**: Enable or disable the extension entirely.
- **Mute All Tabs**: Mute or unmute all tabs with a single toggle.
- **Muting Modes**:
  - **Active Tab**: Only the active tab plays sound.
  - **First Tab with Sound**: The first tab that plays audio remains unmuted.
  - **Specific Tab (Whitelist)**: Choose a single tab to remain unmuted.
- **Show All Tabs**: In whitelist or first-sound mode, toggle to display all tabs (not just audible ones).
- **Shortcuts**:
  - `Alt+Shift+S`: Toggle extension on/off.
  - `Alt+Shift+M`: Toggle mute all tabs.
- **Dynamic Display**: View the current sound source in first-sound mode or select tabs in whitelist mode.

</details>

---

## 🔒 Privacy

- **Data Storage**: Settings and tab preferences are stored locally using Chrome’s `storage.sync` API.
- **No Tracking**: The extension does not collect or transmit any user data.
- **Permissions**:
  - `tabs`: To manage tab audio and query tab information.
  - `storage`: To save user settings and preferences.

---

## 🛠️ Troubleshooting

<details>
<summary>Click to view common issues and solutions</summary>

- **Extension doesn’t mute tabs**:
  - Ensure the extension is enabled via the Master Toggle.
  - Check if the correct muting mode is selected in the popup.
  - Verify that the page is not a Chrome internal page (`chrome://`), as these are restricted.

- **Shortcuts not working**:
  - Check for conflicts in `chrome://extensions/shortcuts`.
  - Reassign shortcuts if necessary.

- **No tabs listed in whitelist mode**:
  - Ensure there are audible tabs or enable the "Show all tabs" option.
  - Refresh the browser or reopen the popup.

- **Icon not updating**:
  - Ensure the extension has loaded correctly by reloading it in `chrome://extensions/`.
  - Check for conflicting extensions affecting the toolbar.

</details>

---

## 📂 File Structure

```
Superior_Tab_Mute/
├── background.js        # Service worker for audio management and event handling
├── manifest.json        # Extension configuration
├── popup.html           # Popup UI for user controls
├── popup.js             # Popup logic for UI interactions
├── popup.css            # Styles for the popup UI
├── icons/               # Extension icons (16px, 48px, 128px)
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
│   ├── icon16_off.png
│   ├── icon48_off.png
│   ├── icon128_off.png
│   ├── icon16_mute.png
│   ├── icon48_mute.png
│   └── icon128_mute.png
├── README.md            # Project documentation
└── LICENSE.md           # The MIT software license
```

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.

`` © 2025 badrenton ``

<p align="center">
<sup>⭐ Enjoying the extension? Consider giving it a star!</sup>
</p>
