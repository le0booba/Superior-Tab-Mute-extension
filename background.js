// --- INITIALIZATION ---
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ 
        mode: 'active',
        isExtensionEnabled: true,
        isAllMuted: false,
        isBlacklistMode: false
    });
});

// --- HELPER FUNCTIONS ---
async function setMuteForTabs(tabs, mute) {
    for (const tab of tabs) {
        if (tab.mutedInfo && tab.mutedInfo.muted !== mute) {
            try {
                await chrome.tabs.update(tab.id, { muted: mute });
            } catch {}
        }
    }
}

async function unmuteAllTabs() {
    const allTabs = await chrome.tabs.query({});
    await setMuteForTabs(allTabs, false);
}

async function muteAllTabs() {
    const allTabs = await chrome.tabs.query({});
    await setMuteForTabs(allTabs, true);
}

// --- CORE LOGIC ---
async function applyMutingRules() {
    const settings = await chrome.storage.sync.get({
        mode: 'active',
        firstAudibleTabId: null,
        whitelistedTabId: null,
        blacklistedTabId: null,
        isExtensionEnabled: true,
        isAllMuted: false,
        isBlacklistMode: false
    });
    if (!settings.isExtensionEnabled) return unmuteAllTabs();
    if (settings.isAllMuted) return muteAllTabs();

    const audibleTabs = await chrome.tabs.query({ audible: true });
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let tabToUnmuteId = null, tabToMuteId = null;
    switch (settings.mode) {
        case 'active':
            tabToUnmuteId = activeTab && activeTab.id;
            break;
        case 'first-sound': {
            const isFirstTabStillAudible = settings.firstAudibleTabId && audibleTabs.some(t => t.id === settings.firstAudibleTabId);
            if (isFirstTabStillAudible) tabToUnmuteId = settings.firstAudibleTabId;
            else if (activeTab) {
                tabToUnmuteId = activeTab.id;
                await chrome.storage.sync.set({ firstAudibleTabId: activeTab.id });
            }
            break;
        }
        case 'whitelist':
            tabToUnmuteId = settings.whitelistedTabId;
            break;
        case 'blacklist':
            tabToMuteId = settings.blacklistedTabId;
            break;
    }
    for (const tab of audibleTabs) {
        const shouldMute = settings.mode === 'blacklist' ? (tab.id === tabToMuteId) : (tab.id !== tabToUnmuteId);
        if (tab.mutedInfo.muted !== shouldMute) {
            try { await chrome.tabs.update(tab.id, { muted: shouldMute }); } catch {}
        }
    }
}

// --- EVENT LISTENERS ---
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
    const { mode, firstAudibleTabId, whitelistedTabId, blacklistedTabId, isExtensionEnabled } = await chrome.storage.sync.get(['mode', 'firstAudibleTabId', 'whitelistedTabId', 'blacklistedTabId', 'isExtensionEnabled']);
    if (!isExtensionEnabled) return;
    const audibleTabs = await chrome.tabs.query({ audible: true });
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (mode === 'first-sound' && tabId === firstAudibleTabId) {
        await chrome.storage.sync.remove('firstAudibleTabId');
        if (audibleTabs.length > 0) {
            await chrome.tabs.update(audibleTabs[0].id, { muted: false });
            await chrome.storage.sync.set({ firstAudibleTabId: audibleTabs[0].id });
        } else if (activeTab) {
            await chrome.tabs.update(activeTab.id, { muted: false });
            await chrome.storage.sync.set({ firstAudibleTabId: activeTab.id });
        }
    } else if (mode === 'whitelist' && tabId === whitelistedTabId) {
        await chrome.storage.sync.remove('whitelistedTabId');
        if (audibleTabs.length > 0) {
            await chrome.tabs.update(audibleTabs[0].id, { muted: false });
            await chrome.storage.sync.set({ whitelistedTabId: audibleTabs[0].id });
        } else if (activeTab) {
            await chrome.tabs.update(activeTab.id, { muted: false });
        }
    } else if (mode === 'blacklist' && tabId === blacklistedTabId) {
        await chrome.storage.sync.remove('blacklistedTabId');
        if (audibleTabs.length > 0) {
            await chrome.tabs.update(audibleTabs[0].id, { muted: true });
            await chrome.storage.sync.set({ blacklistedTabId: audibleTabs[0].id });
        }
    }
    applyMutingRules();
});

chrome.storage.onChanged.addListener(applyMutingRules);