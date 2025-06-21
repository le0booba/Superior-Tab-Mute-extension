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
    const muteAllToggle = document.getElementById('mute-all-toggle-switch');
    const blacklistWhitelistToggle = document.getElementById('blacklist-whitelist-toggle');
    const exportBtn = document.getElementById('export-list-btn');
    const importInput = document.getElementById('import-list-input');

    // Display Name and Version from Manifest
    const manifest = chrome.runtime.getManifest();
    versionInfo.textContent = `${manifest.name} v${manifest.version}`;

    // --- HELPER FUNCTIONS ---
    function qs(sel) { return document.querySelector(sel); }
    function qsa(sel) { return document.querySelectorAll(sel); }

    async function getStorage(keys) {
        return new Promise(resolve => chrome.storage.sync.get(keys, resolve));
    }
    async function setStorage(obj) {
        return new Promise(resolve => chrome.storage.sync.set(obj, resolve));
    }

    async function updateFirstSoundDisplay() {
        const { firstAudibleTabId } = await getStorage('firstAudibleTabId');
        currentSoundSourceDisplay.classList.remove('active', 'error');
        if (firstAudibleTabId) {
            try {
                const tab = await chrome.tabs.get(firstAudibleTabId);
                currentSoundSourceDisplay.textContent = `Source: ${tab.title}`;
                currentSoundSourceDisplay.classList.add('active');
            } catch {
                currentSoundSourceDisplay.textContent = 'Source tab has been closed.';
                currentSoundSourceDisplay.classList.add('error');
            }
        } else {
            currentSoundSourceDisplay.textContent = 'No sound source designated.';
        }
    }

    const updateUIVisibility = async (mode) => {
        whitelistSection.classList.toggle('hidden', mode !== 'whitelist' && mode !== 'blacklist');
        firstSoundControls.classList.toggle('hidden', mode !== 'first-sound');
        if (mode === 'whitelist') {
            const { whitelistedTabId } = await getStorage('whitelistedTabId');
            populateAudibleTabs(whitelistedTabId, false);
        } else if (mode === 'blacklist') {
            const { blacklistedTabId } = await getStorage('blacklistedTabId');
            populateAudibleTabs(blacklistedTabId, true);
        } else if (mode === 'first-sound') {
            updateFirstSoundDisplay();
        }
    };

    // 1. Load all saved settings
    getStorage(['mode', 'whitelistedTabId', 'blacklistedTabId', 'isExtensionEnabled', 'isAllMuted']).then(data => {
        const isEnabled = data.isExtensionEnabled !== false;
        const mode = data.mode || 'active';
        masterToggle.checked = isEnabled;
        muteAllToggle.checked = data.isAllMuted || false;
        controlsWrapper.classList.toggle('disabled', !isEnabled);
        qs(`input[name="mode"][value="${mode}"]`).checked = true;
        updateUIVisibility(mode);
    });

    // 2. Master Toggle
    masterToggle.addEventListener('change', e => {
        setStorage({ isExtensionEnabled: e.target.checked });
        controlsWrapper.classList.toggle('disabled', !e.target.checked);
    });

    // 3. Muting Mode
    modeForm.addEventListener('change', e => {
        setStorage({ mode: e.target.value });
        updateUIVisibility(e.target.value);
    });

    // 4. Refresh Button
    refreshBtn.addEventListener('click', async () => {
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (activeTab) {
            await setStorage({ firstAudibleTabId: activeTab.id });
            await updateFirstSoundDisplay();
        }
    });

    // 5. Populate audible tabs
    async function populateAudibleTabs(selectedTabId, isBlacklist) {
        const tabs = await chrome.tabs.query({ audible: true });
        audibleTabsList.innerHTML = '';
        if (!tabs.length) {
            audibleTabsList.innerHTML = '<li class="no-sound">No tabs are currently playing sound.</li>';
            return;
        }
        tabs.forEach(tab => {
            const li = document.createElement('li');
            li.textContent = tab.title;
            li.dataset.tabId = tab.id;
            if (tab.id === selectedTabId) li.classList.add('selected');
            li.addEventListener('click', async () => {
                if (isBlacklist) {
                    await setStorage({ blacklistedTabId: tab.id });
                } else {
                    await setStorage({ whitelistedTabId: tab.id });
                }
                qsa('#audible-tabs-list li').forEach(li2 => li2.classList.remove('selected'));
                li.classList.add('selected');
            });
            audibleTabsList.appendChild(li);
        });
    }

    // 6. Mute All Toggle
    muteAllToggle.addEventListener('change', e => setStorage({ isAllMuted: e.target.checked }));

    // 8. Export
    exportBtn.addEventListener('click', async () => {
        const { whitelistedTabId, blacklistedTabId } = await getStorage(['whitelistedTabId', 'blacklistedTabId']);
        const blob = new Blob([JSON.stringify({ whitelistedTabId, blacklistedTabId })], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tab-mute-list.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    // 9. Import
    importInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async ev => {
                try {
                    const data = JSON.parse(ev.target.result);
                    await setStorage({ whitelistedTabId: data.whitelistedTabId, blacklistedTabId: data.blacklistedTabId });
                    const mode = qs('input[name="mode"]:checked').value;
                    if (mode === 'whitelist') {
                        populateAudibleTabs(data.whitelistedTabId, false);
                    } else if (mode === 'blacklist') {
                        populateAudibleTabs(data.blacklistedTabId, true);
                    }
                } catch {
                    alert('Invalid file format.');
                }
            };
            reader.readAsText(file);
        }
    });
});