# Superior Tab Mute

A Chrome extension for advanced tab audio control: mute all tabs except the active tab, the first tab with sound, or a specific tab you choose.

---

## ✨ Features

- **Selective Muting**: Mute all tabs except the active tab, the first tab that plays sound, or a chosen tab.
- **Whitelist/Blacklist Modes**: Unmute or mute tabs based on your preferences.
- **Quick Toggles**: Enable/disable the extension or mute all tabs with hotkeys (`Alt+Shift+S`, `Alt+Shift+M`).
- **Dynamic UI**: See and select the current sound source.
- **Icon Feedback**: Extension icon reflects status (enabled, disabled, all muted).
- **Persistent Settings**: Preferences saved with Chrome `storage.sync`.

---

## 🛠️ Installation

1. **Get the Extension**:
   - Clone: `git clone https://github.com/badrenton/Superior_Tab_Mute.git`
   - Or download ZIP from [GitHub Releases](https://github.com/le0booba/Superior_Tab_Mute/releases).

2. **Load in Chrome**:
   - Go to `chrome://extensions/`
   - Enable **Developer mode**.
   - Click **Load unpacked** and select the extension folder.

3. **Verify**:
   - Click the extension icon to open the popup.

---

## 📖 Usage

1. **Open the Popup**:
   - Click the extension icon in the Chrome toolbar.

2. **Choose Muting Mode**:
   - **Active Tab**: Only the current tab plays sound.
   - **First Tab with Sound**: The first tab that played audio remains unmuted.
   - **Whitelist**: Select a specific tab to unmute.

3. **Audio Controls**:
   - Use `Alt+Shift+M` to mute/unmute all tabs.
   - In "first tab with sound" mode, use **Refresh** to set the current tab as the source.
   - In whitelist mode, pick a tab from the list.

4. **Shortcuts**:
   - Change shortcuts at `chrome://extensions/shortcuts`.

---

## ⚙️ Options

- **Master Toggle**: Enable/disable the extension.
- **Mute All Tabs**: Mute/unmute all tabs at once.
- **Muting Modes**: Choose between active tab, first-sound, or whitelist.
- **Show All Tabs**: Optionally display all tabs for selection.
- **Shortcuts**: 
  - `Alt+Shift+S`: Toggle extension.
  - `Alt+Shift+M`: Toggle mute all.
- **Dynamic Display**: See the current sound source or select tabs.

---

## 🔒 Privacy

- **Data**: Settings are stored locally with `storage.sync`.
- **No Tracking**: No data is collected or sent.
- **Permissions**:
  - `tabs`: Manage tab audio.
  - `storage`: Save preferences.

---

## 🛠️ Troubleshooting

- **Not muting?**
  - Ensure the extension is enabled and the correct mode is selected.
  - Chrome internal pages (`chrome://`) can't be muted.

- **Shortcuts not working?**
  - Check for conflicts at `chrome://extensions/shortcuts`.

- **No tabs in whitelist?**
  - Enable "Show all tabs" or refresh the popup.

- **Icon not updating?**
  - Reload the extension in `chrome://extensions/`.

---

## 📂 File Structure

```
Superior-Tab-Mute-extension/
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
└── README.md            # Project documentation
```

---

<p align="center">
© 2025 badrenton
<br>
<sup>⭐ Enjoy the extension? Give it a star!</sup>
</p>
