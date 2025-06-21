document.addEventListener('DOMContentLoaded', () => {
    const qs = sel => document.querySelector(sel);
    const modeForm = qs('#mode-form');
    const firstSoundControls = qs('#first-sound-controls');
    const refreshBtn = qs('#refresh-first-sound-btn');
    const versionInfo = qs('#version-info');
    const masterToggle = qs('#master-toggle-switch');
    const controlsWrapper = qs('#controls-wrapper');
    const currentSoundSourceDisplay = qs('#current-sound-source-display');
    const muteAllToggle = qs('#mute-all-toggle-switch');
    let whitelistSection = null, audibleTabsList = null;
    const manifest = chrome.runtime.getManifest();
    versionInfo.textContent = `${manifest.name} v${manifest.version}`;
    const getStorage = keys => new Promise(r => chrome.storage.sync.get(keys, r));
    const setStorage = obj => new Promise(r => chrome.storage.sync.set(obj, r));
    async function updateFirstSoundDisplay() {
        const { firstAudibleTabId } = await getStorage('firstAudibleTabId');
        currentSoundSourceDisplay.className = '';
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
    async function updateUIVisibility(mode) {
        if (whitelistSection && whitelistSection.parentNode) whitelistSection.remove();
        whitelistSection = audibleTabsList = null;
        firstSoundControls.classList.toggle('hidden', mode !== 'first-sound');
        if (mode === 'whitelist') {
            whitelistSection = document.createElement('div');
            whitelistSection.id = 'whitelist-section';
            const h4 = document.createElement('h4');
            h4.textContent = 'Select a Tab to Unmute:';
            audibleTabsList = document.createElement('ul');
            audibleTabsList.id = 'audible-tabs-list';
            whitelistSection.append(h4, audibleTabsList);
            controlsWrapper.appendChild(whitelistSection);
            const { whitelistedTabId } = await getStorage('whitelistedTabId');
            populateAudibleTabs(whitelistedTabId);
        } else if (mode === 'first-sound') updateFirstSoundDisplay();
    }
    async function populateAudibleTabs(selectedTabId) {
        if (!audibleTabsList) return;
        const tabs = await chrome.tabs.query({ audible: true });
        audibleTabsList.innerHTML = tabs.length ? '' : '<li class="no-sound">No tabs are currently playing sound.</li>';
        tabs.forEach(tab => {
            const li = document.createElement('li');
            li.textContent = tab.title;
            li.dataset.tabId = tab.id;
            if (tab.id === selectedTabId) li.classList.add('selected');
            li.onclick = async () => {
                await setStorage({ whitelistedTabId: tab.id });
                audibleTabsList.querySelectorAll('li').forEach(li2 => li2.classList.remove('selected'));
                li.classList.add('selected');
            };
            audibleTabsList.appendChild(li);
        });
    }
    getStorage(['mode', 'whitelistedTabId', 'isExtensionEnabled', 'isAllMuted']).then(data => {
        const isEnabled = data.isExtensionEnabled !== false;
        let mode = data.mode || 'active';
        if (mode === 'blacklist') mode = 'active';
        masterToggle.checked = isEnabled;
        muteAllToggle.checked = data.isAllMuted || false;
        controlsWrapper.classList.toggle('disabled', !isEnabled);
        qs(`input[name="mode"][value="${mode}"]`).checked = true;
        updateUIVisibility(mode);
    });
    masterToggle.onchange = e => {
        setStorage({ isExtensionEnabled: e.target.checked });
        controlsWrapper.classList.toggle('disabled', !e.target.checked);
    };
    modeForm.onchange = e => {
        setStorage({ mode: e.target.value });
        updateUIVisibility(e.target.value);
    };
    refreshBtn.onclick = async () => {
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (activeTab) {
            await setStorage({ firstAudibleTabId: activeTab.id });
            await updateFirstSoundDisplay();
        }
    };
    muteAllToggle.onchange = e => setStorage({ isAllMuted: e.target.checked });
});