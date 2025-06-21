// --- INITIALIZATION ---
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
        mode: 'active',
        isExtensionEnabled: true,
        isAllMuted: false,
        isBlacklistMode: false
    });
});

// --- HELPERS ---
const getSettings = () => chrome.storage.sync.get({
    mode: 'active',
    firstAudibleTabId: null,
    whitelistedTabId: null,
    blacklistedTabId: null,
    isExtensionEnabled: true,
    isAllMuted: false,
    isBlacklistMode: false
});
const setMute = (tabs, mute) => Promise.all(tabs.map(tab => (tab.mutedInfo && tab.mutedInfo.muted !== mute) ? chrome.tabs.update(tab.id, { muted: mute }).catch(()=>{}) : null));
const getTabs = q => chrome.tabs.query(q);

async function unmuteAllTabs() { await setMute(await getTabs({}), false); }
async function muteAllTabs() { await setMute(await getTabs({}), true); }

// --- CORE LOGIC ---
async function applyMutingRules() {
    const s = await getSettings();
    if (!s.isExtensionEnabled) return unmuteAllTabs();
    if (s.isAllMuted) return muteAllTabs();
    const audibleTabs = await getTabs({ audible: true });
    const [activeTab] = await getTabs({ active: true, currentWindow: true });
    let tabToUnmuteId = null, tabToMuteId = null;
    switch (s.mode) {
        case 'active': tabToUnmuteId = activeTab && activeTab.id; break;
        case 'first-sound': {
            const isFirstTabAudible = s.firstAudibleTabId && audibleTabs.some(t => t.id === s.firstAudibleTabId);
            if (isFirstTabAudible) tabToUnmuteId = s.firstAudibleTabId;
            else if (activeTab) {
                tabToUnmuteId = activeTab.id;
                await chrome.storage.sync.set({ firstAudibleTabId: activeTab.id });
            }
            break;
        }
        case 'whitelist': tabToUnmuteId = s.whitelistedTabId; break;
        case 'blacklist': tabToMuteId = s.blacklistedTabId; break;
    }
    for (const tab of audibleTabs) {
        const shouldMute = s.mode === 'blacklist' ? (tab.id === tabToMuteId) : (tab.id !== tabToUnmuteId);
        if (tab.mutedInfo.muted !== shouldMute) {
            try { await chrome.tabs.update(tab.id, { muted: shouldMute }); } catch {}
        }
    }
}

// --- EVENTS ---
chrome.tabs.onActivated.addListener(applyMutingRules);
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
    if (changeInfo.audible === true) {
        const { mode, firstAudibleTabId, isExtensionEnabled } = await chrome.storage.sync.get(['mode', 'firstAudibleTabId', 'isExtensionEnabled']);
        if (isExtensionEnabled && mode === 'first-sound' && !firstAudibleTabId) {
            await chrome.storage.sync.set({ firstAudibleTabId: tabId });
        }
    }
    if ('audible' in changeInfo) applyMutingRules();
});
chrome.tabs.onRemoved.addListener(async (tabId) => {
    const s = await chrome.storage.sync.get(['mode', 'firstAudibleTabId', 'whitelistedTabId', 'blacklistedTabId', 'isExtensionEnabled']);
    if (!s.isExtensionEnabled) return;
    const audibleTabs = await getTabs({ audible: true });
    const [activeTab] = await getTabs({ active: true, currentWindow: true });
    if (s.mode === 'first-sound' && tabId === s.firstAudibleTabId) {
        await chrome.storage.sync.remove('firstAudibleTabId');
        if (audibleTabs.length) {
            await chrome.tabs.update(audibleTabs[0].id, { muted: false });
            await chrome.storage.sync.set({ firstAudibleTabId: audibleTabs[0].id });
        } else if (activeTab) {
            await chrome.tabs.update(activeTab.id, { muted: false });
            await chrome.storage.sync.set({ firstAudibleTabId: activeTab.id });
        }
    } else if (s.mode === 'whitelist' && tabId === s.whitelistedTabId) {
        await chrome.storage.sync.remove('whitelistedTabId');
        if (audibleTabs.length) {
            await chrome.tabs.update(audibleTabs[0].id, { muted: false });
            await chrome.storage.sync.set({ whitelistedTabId: audibleTabs[0].id });
        } else if (activeTab) {
            await chrome.tabs.update(activeTab.id, { muted: false });
        }
    } else if (s.mode === 'blacklist' && tabId === s.blacklistedTabId) {
        await chrome.storage.sync.remove('blacklistedTabId');
        if (audibleTabs.length) {
            await chrome.tabs.update(audibleTabs[0].id, { muted: true });
            await chrome.storage.sync.set({ blacklistedTabId: audibleTabs[0].id });
        }
    }
    applyMutingRules();
});
chrome.storage.onChanged.addListener(applyMutingRules);

// --- ICON ---
function updateExtensionIcon(isEnabled, isAllMuted) {
    let path;
    if (!isEnabled) {
        path = {
            16: 'icons/icon16_off.png',
            48: 'icons/icon48_off.png',
            128: 'icons/icon128_off.png'
        };
    } else if (isAllMuted) {
        path = {
            16: 'icons/icon16_mute.png',
            48: 'icons/icon48_mute.png',
            128: 'icons/icon128_mute.png'
        };
    } else {
        path = {
            16: 'icons/icon16.png',
            48: 'icons/icon48.png',
            128: 'icons/icon128.png'
        };
    }
    chrome.action.setIcon({ path });
}

chrome.storage.sync.get(['isExtensionEnabled', 'isAllMuted'], ({ isExtensionEnabled, isAllMuted }) => {
    updateExtensionIcon(isExtensionEnabled !== false, isAllMuted === true);
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && (changes.isExtensionEnabled || changes.isAllMuted)) {
        chrome.storage.sync.get(['isExtensionEnabled', 'isAllMuted'], ({ isExtensionEnabled, isAllMuted }) => {
            updateExtensionIcon(isExtensionEnabled !== false, isAllMuted === true);
        });
    }
});

// --- HOTKEYS ---
chrome.commands && chrome.commands.onCommand.addListener(async (command) => {
    if (command === 'toggle-extension') {
        const { isExtensionEnabled } = await chrome.storage.sync.get('isExtensionEnabled');
        await chrome.storage.sync.set({ isExtensionEnabled: !isExtensionEnabled });
    } else if (command === 'toggle-mute-all') {
        const { isAllMuted } = await chrome.storage.sync.get('isAllMuted');
        await chrome.storage.sync.set({ isAllMuted: !isAllMuted });
    }
});