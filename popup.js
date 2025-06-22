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
    const showAllTabsFirstSound = document.getElementById('show-all-tabs-first-sound');
    let whitelistSection = null, audibleTabsList = null, whitelistShowAllCheckbox = null;
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
                currentSoundSourceDisplay.textContent = `SOURCE: ${tab.title}`;
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
            whitelistShowAllCheckbox = document.createElement('label');
            whitelistShowAllCheckbox.style.fontSize = '13px';
            whitelistShowAllCheckbox.style.display = 'block';
            whitelistShowAllCheckbox.style.marginTop = '8px'; // Добавлен отступ сверху
            whitelistShowAllCheckbox.innerHTML = `<input type="checkbox" id="show-all-tabs-whitelist"> Show all tabs`;
            whitelistSection.append(h4, audibleTabsList, whitelistShowAllCheckbox);
            controlsWrapper.appendChild(whitelistSection);
            const { whitelistedTabId } = await getStorage('whitelistedTabId');
            const showAll = localStorage.getItem('showAllTabsWhitelist') === 'true';
            whitelistShowAllCheckbox.querySelector('input').checked = showAll;
            populateAudibleTabs(whitelistedTabId, showAll);
            whitelistShowAllCheckbox.querySelector('input').onchange = (e) => {
                localStorage.setItem('showAllTabsWhitelist', e.target.checked);
                populateAudibleTabs(whitelistedTabId, e.target.checked);
            };
        } else if (mode === 'first-sound') {
            const showAll = localStorage.getItem('showAllTabsFirstSound') === 'true';
            showAllTabsFirstSound.checked = showAll;
            updateFirstSoundDisplay();
            populateFirstSoundTabs(showAll);
            showAllTabsFirstSound.onchange = (e) => {
                localStorage.setItem('showAllTabsFirstSound', e.target.checked);
                populateFirstSoundTabs(e.target.checked);
            };
        }
    }
    async function populateAudibleTabs(selectedTabId, showAll = false) {
        if (!audibleTabsList) return;
        const tabs = showAll
            ? await chrome.tabs.query({})
            : await chrome.tabs.query({ audible: true });
        audibleTabsList.innerHTML = tabs.length ? '' : '<li class="no-sound">No tabs found.</li>';
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
    async function populateFirstSoundTabs(showAll = false) {
        let list = document.getElementById('first-sound-tabs-list');
        if (!list) {
            list = document.createElement('ul');
            list.id = 'first-sound-tabs-list';
            // Стилизация списка вкладок как в whitelist
            list.style.marginTop = '8px';
            list.style.listStyle = 'none';
            list.style.padding = '0';
            list.style.maxHeight = '120px';
            list.style.overflowY = 'auto';
            list.style.border = '1px solid #34495e';
            list.style.borderRadius = '4px';
            currentSoundSourceDisplay.parentNode.insertBefore(list, currentSoundSourceDisplay.nextSibling);
        }
        const { firstAudibleTabId } = await getStorage('firstAudibleTabId');
        const tabs = showAll
            ? await chrome.tabs.query({})
            : await chrome.tabs.query({ audible: true });
        list.innerHTML = tabs.length ? '' : '<li class="no-sound">No tabs found.</li>';
        tabs.forEach((tab, idx) => {
            const li = document.createElement('li');
            li.textContent = tab.title;
            li.dataset.tabId = tab.id;
            // Стилизация элементов списка как в whitelist
            li.style.padding = '8px 12px';
            li.style.cursor = 'pointer';
            li.style.whiteSpace = 'nowrap';
            li.style.overflow = 'hidden';
            li.style.textOverflow = 'ellipsis';
            li.style.transition = 'background 0.2s, color 0.2s';
            li.style.borderBottom = '1px solid #34495e';
            if (idx === tabs.length - 1) li.style.borderBottom = 'none';
            if (tab.id === firstAudibleTabId) {
                li.style.background = '#3498db';
                li.style.fontWeight = 'bold';
                li.style.color = '#fff';
            }
            li.onclick = async () => {
                await setStorage({ firstAudibleTabId: tab.id });
                populateFirstSoundTabs(showAll);
                updateFirstSoundDisplay();
            };
            list.appendChild(li);
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
            if (showAllTabsFirstSound.checked) populateFirstSoundTabs(true);
        }
    };
    muteAllToggle.onchange = e => setStorage({ isAllMuted: e.target.checked });
});