// --- INITIALIZATION ---
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ 
        mode: 'active',
        isExtensionEnabled: true
    });
});

// --- HELPER FUNCTION ---
async function unmuteAllTabs() {
    const allTabs = await chrome.tabs.query({});
    for (const tab of allTabs) {
        if (tab.mutedInfo && tab.mutedInfo.muted) {
            try {
                await chrome.tabs.update(tab.id, { muted: false });
            } catch (error) {
                // Ignore errors for tabs that might have closed during the loop
            }
        }
    }
}

// --- CORE LOGIC ---
async function applyMutingRules() {
    const settings = await chrome.storage.sync.get({
        mode: 'active',
        firstAudibleTabId: null,
        whitelistedTabId: null,
        isExtensionEnabled: true
    });

    if (!settings.isExtensionEnabled) {
        await unmuteAllTabs();
        return;
    }

    const audibleTabs = await chrome.tabs.query({ audible: true });
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });

    let tabToUnmuteId = null;

    switch (settings.mode) {
        case 'active':
            if (activeTab) tabToUnmuteId = activeTab.id;
            break;

        case 'first-sound':
            const isFirstTabStillAudible = settings.firstAudibleTabId && audibleTabs.some(t => t.id === settings.firstAudibleTabId);
            if (isFirstTabStillAudible) {
                tabToUnmuteId = settings.firstAudibleTabId;
            } else {
                if (activeTab) {
                    tabToUnmuteId = activeTab.id;
                    await chrome.storage.sync.set({ firstAudibleTabId: activeTab.id });
                }
            }
            break;

        case 'whitelist':
            tabToUnmuteId = settings.whitelistedTabId;
            break;
    }

    for (const tab of audibleTabs) {
        const shouldMute = (tab.id !== tabToUnmuteId);
        if (tab.mutedInfo.muted !== shouldMute) {
            try {
                await chrome.tabs.update(tab.id, { muted: shouldMute });
            } catch (error) {
                // Ignore errors for tabs that might have closed
            }
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
    if (changeInfo.hasOwnProperty('audible')) {
       applyMutingRules();
    }
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
    const { mode, firstAudibleTabId, whitelistedTabId, isExtensionEnabled } = await chrome.storage.sync.get(['mode', 'firstAudibleTabId', 'whitelistedTabId', 'isExtensionEnabled']);
    if (!isExtensionEnabled) return;

    if (mode === 'first-sound' && tabId === firstAudibleTabId) {
        await chrome.storage.sync.remove('firstAudibleTabId');
        const otherAudibleTabs = await chrome.tabs.query({ audible: true });
        if (otherAudibleTabs.length > 0) {
            const newSource = otherAudibleTabs[0];
            await chrome.tabs.update(newSource.id, { muted: false });
            await chrome.storage.sync.set({ firstAudibleTabId: newSource.id });
        } else {
            const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (activeTab) {
                await chrome.tabs.update(activeTab.id, { muted: false });
                await chrome.storage.sync.set({ firstAudibleTabId: activeTab.id });
            }
        }
    } 
    else if (mode === 'whitelist' && tabId === whitelistedTabId) {
        await chrome.storage.sync.remove('whitelistedTabId');
        const otherAudibleTabs = await chrome.tabs.query({ audible: true });
        if (otherAudibleTabs.length > 0) {
            const newWhitelistedTab = otherAudibleTabs[0];
            await chrome.tabs.update(newWhitelistedTab.id, { muted: false });
            await chrome.storage.sync.set({ whitelistedTabId: newWhitelistedTab.id });
        } else {
            const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (activeTab) {
                await chrome.tabs.update(activeTab.id, { muted: false });
            }
        }
    }
    
    applyMutingRules();
});

chrome.storage.onChanged.addListener(applyMutingRules);