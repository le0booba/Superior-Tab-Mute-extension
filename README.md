# Superior Tab Mute
### Chrome extension

---

> Advanced control over tab audio in Chrome. Mute all tabs except the one you're focused on, the first one that made sound, or a specific tab you choose.

## ✨ Features

- 🎯 **Active Tab Mode**: Only the currently focused tab plays audio
- ⏱️ **First Sound Mode**: Remembers and keeps unmuted the first tab that played audio
- ⭐ **Whitelist Mode**: Manually select which specific tab stays unmuted
- ⚡ **Master Toggle**: Instantly enable/disable the extension
- 🔇 **Mute All**: Emergency mute for all tabs at once
- ⌨️ **Hotkeys**: Quick keyboard shortcuts for toggling extension and mute all
- 🌙 **Dark Theme UI**: Modern, easy-on-the-eyes interface

## 🛠️ Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable Developer Mode (top right)
4. Click **Load unpacked** and select the extension folder
5. Pin the extension for quick access

## 🎮 How to Use

- Click the extension icon in your browser toolbar
- Enable the **Master Toggle**
- Choose your preferred muting mode
- Use the **Mute All Tabs** switch for emergency silence
- Use hotkeys:
  - <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>S</kbd> — Toggle extension on/off
  - <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>M</kbd> — Toggle mute all tabs

> ⚠️ **Note:** If the default hotkeys do not work, open `chrome://extensions/shortcuts` and set them manually. Chrome may not assign them automatically if the combination is already in use or not supported by your OS.

## 📂 File Structure

```
superior-tab-mute/
├── manifest.json         # Extension metadata and permissions
├── background.js         # Core logic for tab muting and hotkey handling
├── popup.html            # User interface structure
├── popup.css             # Dark theme styling
├── popup.js              # UI interactivity and settings
└── icons/                # Extension icons
```

## 📄 License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.

---

<div align="center">

**Built by [badrenton](https://github.com/badrenton) | Made with ❤️ for productivity enthusiasts**
<br>
*If you find this extension helpful, please consider giving it a ⭐ star on GitHub!*

</div>
