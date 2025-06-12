# Superior Tab Mute 🔇

**Superior Tab Mute** is a powerful Chrome extension designed to give you advanced control over tab audio. It allows you to mute all tabs except the one you’re focused on, the first tab that starts playing sound, or a specific tab of your choice. With an intuitive interface and customizable settings, it ensures a distraction-free browsing experience by managing tab audio effectively.


![Текст описания](https://swrxa0dme81ptwbk.public.blob.vercel-storage.com/Screenshot%202025-06-12%20175402_result_1.jpg)
------
![Текст описания](https://swrxa0dme81ptwbk.public.blob.vercel-storage.com/Screenshot%202025-06-12%20175438_result_1.jpg)


## ✨ Features

- **Three Muting Modes**:

  - 🔊 **Active Tab Mode**: Only the currently active tab plays sound; all others are muted.
  - 🎵 **First Sound Mode**: The first tab that plays audio remains unmuted, while others are muted.
  - ⭐ **Whitelist Mode**: Choose a specific tab to keep unmuted, muting all others.

- **Master Toggle**:

  - ✅ Enable or disable the extension with a single switch.

- **Dynamic Tab Management**:

  - 🖱️ Automatically updates muting based on tab changes, audio playback, or mode switches.
  - 🔄 Option to set the active tab as the sound source in First Sound Mode.

- **Customizable Settings**:

  - ⚙️ Configure advanced options like auto-enable on startup, preserving tab selections, instant muting, and notifications.
  - 💾 Export or import settings for easy backup and restore.

- **User-Friendly Interface**:

  - 🖼️ Clean popup with real-time feedback on the current sound source.
  - 📜 Scrollable list of audible tabs for easy selection in Whitelist Mode.

---

## 🚀 Installation

1. **Download the Extension**:

   - Clone or download this repository to your local machine.

2. **Load into Chrome**:

   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer mode** in the top-right corner.
   - Click **Load unpacked** and select the folder containing the extension files.

3. **Verify Installation**:

   - Look for the **Superior Tab Mute** icon in the Chrome toolbar.
   - Pin the extension for easy access.

---

## 🛠️ Usage

1. **Open the Popup**:

   - Click the **Superior Tab Mute** icon in the Chrome toolbar to open the popup.

2. **Choose a Muting Mode**:

   - Select one of the three modes:
     - **Mute all except active tab**: Only the currently active tab plays sound.
     - **Mute all except first tab with sound**: The first tab that plays audio stays unmuted.
     - **Mute all except a specific tab**: Choose a tab from the list of audible tabs to unmute.

3. **Manage Settings**:

   - Toggle the master switch to enable or disable the extension.
   - In **First Sound Mode**, click **Set Active Tab as Sound Source** to designate the current tab as the sound source.
   - In **Whitelist Mode**, select a tab from the list of audible tabs to keep unmuted.

4. **Access Advanced Settings**:

   - Right-click the extension icon and select **Options** to configure:
     - Auto-enable on browser startup.
     - Preserve tab selection across sessions.
     - Instant muting for immediate audio control.
     - Notifications for muting/unmuting events.
     - Backup or restore settings.

---

## 📂 File Structure

- `manifest.json`: Defines the extension's metadata, permissions, and resources.
- `background.js`: Handles core logic for muting tabs based on the selected mode.
- `popup.html`: The user interface for selecting modes and managing audible tabs.
- `popup.js`: JavaScript for popup interactivity and settings management.
- `popup.css`: Styles for the popup interface.
- `options.html`: Interface for advanced settings configuration.
- `icons/`: Contains extension icons (16x16, 48x48, 128x128).

---

## 🔐 Permissions

The extension requires the following permissions:

- **tabs**: To monitor and control tab audio states.
- **storage**: To save user preferences and settings.

---

## 🛠️ Development

To contribute or modify the extension:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/superior-tab-mute.git
   ```

2. **Make Changes**:

   - Edit the JavaScript, HTML, or CSS files as needed.
   - Ensure compatibility with Chrome’s Manifest V3.

3. **Test the Extension**:

4. Load the updated extension in Chrome using **Load unpacked** in `chrome://extensions/`.

   - Test all modes and settings to ensure functionality.

5. **Submit a Pull Request**:

   - Push your changes to a fork and submit a pull request for review.

---

## 📝 Notes

- The extension automatically saves settings, so no manual saving is required.
- If a selected tab is closed, the extension intelligently reassigns the sound source to another audible tab or the active tab.
- For issues or feature requests, please open an issue on the repository.

---

- 👤 Author

Developed by **badrenton**.

---

## 📜 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## 🙌 Acknowledgments

1. Built with ❤️ for Chrome users seeking better audio control.
2. Icons sourced from \[your-icon-source\] (update with actual source if applicable).


### File Structure

```
superior-tab-mute/
├── background.js
├── manifest.json
├── popup.css
├── popup.html
├── popup.js
├── README.md
└── icons/
    ├── icon16.png
    ├── icon48.png
    ├── icon128.png
