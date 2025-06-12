# 🎧 Superior Tab Mute - Chrome Extension

![Текст описания](https://swrxa0dme81ptwbk.public.blob.vercel-storage.com/Screenshot%202025-06-12%20224450_result.jpg)

![Текст описания](https://swrxa0dme81ptwbk.public.blob.vercel-storage.com/Screenshot%202025-06-12%20224538_result.jpg)

![Текст описания](https://swrxa0dme81ptwbk.public.blob.vercel-storage.com/Screenshot%202025-06-12%20224424_result.jpg)

> **Advanced control over tab audio** - Mute all tabs except the one you're focused on, the first one that made sound, or a specific tab you choose.

## ✨ Features

- 🔘 **Three muting modes**:
  - 🔊 **Active Tab** - Automatically unmutes your currently focused tab
  - ⏱️ **First Sound** - Remembers the first tab that played audio
  - ⭐ **Whitelist** - Manually select which tab stays unmuted

- ⚡ **Real-time control** - Changes take effect immediately
- 🛡️ **Graceful error handling** - Recovers automatically when tabs close
- 🌙 **Dark theme UI** - Easy on the eyes

## 🛠️ Installation

1. Download the extension files
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked" and select the extension folder

## 🎮 How to Use

1. Click the extension icon in your toolbar
2. Choose your preferred mode:
   - **Active Tab**: Automatically works when you switch tabs
   - **First Sound**: 
     - The first tab that plays audio will stay unmuted
     - Use the "Set Active Tab" button to manually override
   - **Whitelist**:
     - Select any audible tab from the list
     - Only the selected tab will remain unmuted

3. Toggle the master switch to enable/disable the extension

## 📂 File Structure

```
superior-tab-mute/
├── background.js: Handles core logic for muting tabs based on the selected mode.
├── manifest.json: Defines the extension's metadata, permissions, and resources.
├── popup.css: Styles for the popup interface.
├── popup.html: The user interface for selecting modes and managing audible tabs.
├── popup.js: JavaScript for popup interactivity and settings management.
├── README.md
└── icons/: Contains extension icons (16x16, 48x48, 128x128).
    ├── icon16.png
    ├── icon48.png
    ├── icon128.png
```

## 📄 License

MIT License

---

🛠️ **by badrenton** | ⚡ **Keep your audio under control**
