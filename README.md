# 🎧 Superior Tab Mute - Chrome Extension

> **Advanced control over tab audio** - Mute all tabs except the one you're focused on, the first one that made sound, or a specific tab you choose.

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

## ✨ Features

### 🔘 **Four Intelligent Muting Modes**
- **🎯 Active Tab Mode** - Automatically unmutes your currently focused tab while muting all others
- **⏱️ First Sound Mode** - Remembers and keeps unmuted the first tab that played audio
- **⭐ Whitelist Mode** - Manually select which specific tab stays unmuted
- **🚫 Blacklist Mode** - Mute only a specific tab while keeping others unmuted

### 🛠️ **Advanced Controls**
- **⚡ Master Toggle** - Instantly enable/disable the entire extension
- **🔇 Mute All** - Emergency mute for all tabs at once
- **📋 Export/Import Lists** - Save and restore your whitelist/blacklist configurations
- **🔄 Smart Tab Management** - Automatically handles closed tabs and audio changes

### 🎨 **User Experience**
- **🌙 Dark Theme UI** - Modern, easy-on-the-eyes interface
- **⚡ Real-time Control** - Changes take effect immediately
- **🛡️ Graceful Error Handling** - Recovers automatically when tabs close or become unavailable
- **📱 Compact Design** - Minimal popup interface that doesn't clutter your browser

## 🛠️ Installation

### Method 1: Developer Mode (Recommended)
1. **Download** the extension files to your computer
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer Mode** - Toggle the switch in the top-right corner
4. **Click "Load unpacked"** and select the extension folder
5. **Pin the extension** to your toolbar for easy access

### Method 2: Chrome Web Store
*Coming Soon - Extension will be available on the Chrome Web Store*

## 🎮 How to Use

### Getting Started
1. **Click the extension icon** 🎧 in your browser toolbar
2. **Enable the Master Toggle** if it's not already on
3. **Choose your preferred muting mode** from the four available options

<details><summary>Mode Details</summary>

   ### Mode Details

#### 🎯 **Active Tab Mode**
- **Automatic operation** - No setup required
- **Behavior**: Only the currently focused tab plays audio
- **Use case**: Perfect for browsing while listening to music or videos

#### ⏱️ **First Sound Mode**
- **Smart detection** - Automatically remembers the first tab that plays audio
- **Manual override** - Use "Set Active Tab as Sound Source" to change the source
- **Use case**: Great for maintaining background music while browsing

#### ⭐ **Whitelist Mode**
- **Manual selection** - Choose any audible tab from the list
- **Visual feedback** - Selected tab is highlighted in blue
- **Use case**: Ideal when you want to control exactly which tab plays audio

#### 🚫 **Blacklist Mode**
- **Selective muting** - Mute only specific unwanted tabs
- **Flexible control** - All other tabs remain unmuted
- **Use case**: Perfect for silencing ads while keeping multiple audio sources

### Advanced Features

#### 🔇 **Emergency Controls**
- **Mute All Toggle** - Instantly silence all tabs regardless of mode
- **Master Toggle** - Completely disable the extension when needed

#### 📋 **Configuration Management**
- **Export Lists** - Save your whitelist/blacklist settings as a JSON file
- **Import Lists** - Restore previously saved configurations
- **Use case**: Backup settings or share configurations across devices

</details>

### Advanced Features

#### 🔇 **Emergency Controls**
- **Mute All Toggle** - Instantly silence all tabs regardless of mode
- **Master Toggle** - Completely disable the extension when needed

#### 📋 **Configuration Management**
- **Export Lists** - Save your whitelist/blacklist settings as a JSON file
- **Import Lists** - Restore previously saved configurations
- **Use case**: Backup settings or share configurations across devices

## 📂 File Structure

```
superior-tab-mute/
├── 📄 manifest.json          # Extension metadata and permissions
├── ⚙️ background.js          # Core logic for tab muting and event handling
├── 🎨 popup.html            # User interface structure
├── 🎨 popup.css             # Dark theme styling and layout
├── 🔧 popup.js              # UI interactivity and settings management
├── 📖 README.md             # This documentation file
└── 📁 icons/                # Extension icons
    ├── 🖼️ icon16.png        # Toolbar icon (16x16)
    ├── 🖼️ icon48.png        # Extension management icon (48x48)
    └── 🖼️ icon128.png       # Chrome Web Store icon (128x128)
```

### Core Components

- **`background.js`** - Service worker that handles all tab monitoring, muting logic, and storage management
- **`popup.html/css/js`** - The extension's user interface with dark theme and intuitive controls
- **`manifest.json`** - Defines extension capabilities, permissions (tabs, storage, downloads)

<details><summary>🔧 Technical Details</summary>

## 🔧 Technical Details

### Permissions Required
- **`tabs`** - Monitor and control tab audio states
- **`storage`** - Save user preferences and configurations
- **`downloads`** - Enable export functionality for lists

### Browser Compatibility
- **Chrome** - Fully supported (Manifest V3)
- **Chromium-based browsers** - Compatible (Edge, Brave, Opera, etc.)

### Performance
- **Lightweight** - Minimal memory footprint
- **Efficient** - Only processes audible tabs
- **Responsive** - Instant audio control with no delays

</details>

## 🐛 Troubleshooting

### Common Issues
- **Extension not working**: Check if it's enabled in `chrome://extensions/`
- **Tabs not muting**: Verify the Master Toggle is enabled
- **First Sound mode not working**: Try using "Set Active Tab as Sound Source" button
- **Import failing**: Ensure the JSON file is from a previous export

### Reset Extension
If you encounter issues, you can reset by:
1. Disabling and re-enabling the extension
2. Or removing and reinstalling the extension

<details><summary>🤝 Contributing</summary>

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Bug Reports
- Use GitHub Issues to report bugs
- Include your Chrome version and extension version
- Describe steps to reproduce the issue

### Feature Requests
- Suggest new muting modes or UI improvements
- Explain your use case and why it would be helpful

### Development
- Fork the repository
- Make your changes
- Test thoroughly
- Submit a pull request

</details>

## 📄 License

**MIT License**

Copyright (c) 2025 badrenton

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

<div align="center">

**🛠️ Built by [badrenton](https://github.com/badrenton) | ⚡ Keep your audio under control**

*If you find this extension helpful, please consider giving it a ⭐ star on GitHub!*

</div>
