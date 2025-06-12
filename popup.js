document.addEventListener('DOMContentLoaded', () => {
    // Get references to all UI elements
    const modeForm = document.getElementById('mode-form');
    const whitelistSection = document.getElementById('whitelist-section');
    const audibleTabsList = document.getElementById('audible-tabs-list');
    const firstSoundControls = document.getElementById('first-sound-controls');
    const refreshBtn = document.getElementById('refresh-first-sound-btn');
    const versionInfo = document.getElementById('version-info');
    const masterToggle = document.getElementById('master-toggle-switch');
    const controlsWrapper = document.getElementById('controls-wrapper');
    const currentSoundSourceDisplay = document.getElementById('current-sound-source-display');

    // Display Name and Version from Manifest
    const manifest = chrome.runtime.getManifest();
    versionInfo.textContent = `${manifest.name} v${manifest.version}`;

    // --- HELPER FUNCTIONS ---

    async function updateFirstSoundDisplay() {
        const { firstAudibleTabId } = await chrome.storage.sync.get('firstAudibleTabId');
        currentSoundSourceDisplay.classList.remove('active', 'error');

        if (firstAudibleTabId) {
            try {
                const tab = await chrome.tabs.get(firstAudibleTabId);
                currentSoundSourceDisplay.textContent = `Source: ${tab.title}`;
                currentSoundSourceDisplay.classList.add('active');
            } catch (error) {
                currentSoundSourceDisplay.textContent = 'Source tab has been closed.';
                currentSoundSourceDisplay.classList.add('error');
            }
        } else {
            currentSoundSourceDisplay.textContent = 'No sound source designated.';
        }
    }

    const updateUIVisibility = (mode) => {
        whitelistSection.classList.toggle('hidden', mode !== 'whitelist');
        firstSoundControls.classList.toggle('hidden', mode !== 'first-sound');
        
        if (mode === 'whitelist') {
            populateAudibleTabs();
        } else if (mode === 'first-sound') {
            updateFirstSoundDisplay();
        }
    };

    // 1. Load all saved settings
    chrome.storage.sync.get(['mode', 'whitelistedTabId', 'isExtensionEnabled'], (data) => {
        const isEnabled = data.isExtensionEnabled !== false;
        const mode = data.mode || 'active';
        
        masterToggle.checked = isEnabled;
        controlsWrapper.classList.toggle('disabled', !isEnabled);
        
        document.querySelector(`input[name="mode"][value="${mode}"]`).checked = true;
        
        updateUIVisibility(mode); 
        if (mode === 'whitelist') {
            populateAudibleTabs(data.whitelistedTabId);
        }
    });

    // 2. Listen for Master Toggle changes
    masterToggle.addEventListener('change', (event) => {
        const isEnabled = event.target.checked;
        chrome.storage.sync.set({ isExtensionEnabled: isEnabled });
        controlsWrapper.classList.toggle('disabled', !isEnabled);
    });

    // 3. Listen for Muting Mode changes
    modeForm.addEventListener('change', (event) => {
        const newMode = event.target.value;
        chrome.storage.sync.set({ mode: newMode });
        updateUIVisibility(newMode);
    });

    // 4. Listen for Refresh Button click
    refreshBtn.addEventListener('click', async () => {
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (activeTab) {
            await chrome.storage.sync.set({ firstAudibleTabId: activeTab.id });
            await updateFirstSoundDisplay(); // Update display immediately
        }
    });

    // 5. Populate the whitelist tab list
    async function populateAudibleTabs(selectedTabId) {
        const tabs = await chrome.tabs.query({ audible: true });
        audibleTabsList.innerHTML = '';

        if (tabs.length === 0) {
            audibleTabsList.innerHTML = '<li class="no-sound">No tabs are currently playing sound.</li>';
            return;
        }

        tabs.forEach(tab => {
            const listItem = document.createElement('li');
            listItem.textContent = tab.title;
            listItem.dataset.tabId = tab.id;
            if (tab.id === selectedTabId) {
                listItem.classList.add('selected');
            }

            listItem.addEventListener('click', () => {
                chrome.storage.sync.set({ whitelistedTabId: tab.id });
                document.querySelectorAll('#audible-tabs-list li').forEach(li => li.classList.remove('selected'));
                listItem.classList.add('selected');
            });
            audibleTabsList.appendChild(listItem);
        });
    }
});