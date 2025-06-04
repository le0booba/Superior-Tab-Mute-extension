// Superior Tab Mute - Background Script

let currentMode = 'disabled'; // disabled, active, first_sound, manual
let firstSoundTabId = null;
let manualSelectedTabId = null;
let isProcessing = false;
let onFirstSoundTabClose = 'do_nothing'; // do_nothing, next_sound_tab

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ 
    mode: 'disabled',
    onFirstSoundTabClose: 'do_nothing'
  });
});

// Load settings on startup
chrome.storage.sync.get(['mode', 'firstSoundTabId', 'manualSelectedTabId', 'onFirstSoundTabClose'], (result) => {
  currentMode = result.mode || 'disabled';
  firstSoundTabId = result.firstSoundTabId || null;
  manualSelectedTabId = result.manualSelectedTabId || null;
  onFirstSoundTabClose = result.onFirstSoundTabClose || 'do_nothing';
  if (currentMode !== 'disabled') {
    initializeMode();
  }
});

// Listen for tab activation changes
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  if (isProcessing || currentMode === 'disabled') return;
  
  if (currentMode === 'active') {
    await handleActiveTabMode(activeInfo.tabId);
  }
});

// Listen for tab updates (including audio changes)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (isProcessing || currentMode === 'disabled') return;
  
  // Handle first sound detection
  if (currentMode === 'first_sound' && changeInfo.audible === true && !firstSoundTabId) {
    firstSoundTabId = tabId;
    // Save to storage
    await chrome.storage.sync.set({ firstSoundTabId });
    await handleFirstSoundMode();
  }
  
  // Handle audio changes for all active modes
  if (changeInfo.audible !== undefined) {
    await handleAudioChange(tabId, tab);
  }
});

// Listen for tab removal
chrome.tabs.onRemoved.addListener(async (tabId) => {
  if (tabId === firstSoundTabId) {
    // Handle first sound tab closure based on user preference
    if (currentMode === 'first_sound' && onFirstSoundTabClose === 'next_sound_tab') {
      await handleFirstSoundTabClosure();
    } else {
      // Default behavior: just clear the first sound tab
      firstSoundTabId = null;
      await chrome.storage.sync.remove('firstSoundTabId');
    }
  }
  if (tabId === manualSelectedTabId) {
    manualSelectedTabId = null;
    await chrome.storage.sync.remove('manualSelectedTabId');
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  handleMessage(request, sendResponse);
  return true; // Keep message channel open for async response
});

async function handleMessage(request, sendResponse) {
  try {
    switch (request.action) {
      case 'setMode':
        await setMode(request.mode);
        sendResponse({ success: true });
        break;
        
      case 'getStatus':
        const status = await getStatus();
        sendResponse(status);
        break;
        
      case 'selectTab':
        await selectManualTab(request.tabId);
        sendResponse({ success: true });
        break;
        
      case 'getTabs':
        const tabs = await getAllTabs();
        sendResponse({ tabs });
        break;
        
      case 'setFirstSoundTabCloseOption':
        await setFirstSoundTabCloseOption(request.option);
        sendResponse({ success: true });
        break;
        
      case 'getFirstSoundTabCloseOption':
        sendResponse({ option: onFirstSoundTabClose });
        break;
        
      default:
        sendResponse({ error: 'Unknown action' });
    }
  } catch (error) {
    console.error('Error handling message:', error);
    sendResponse({ error: error.message });
  }
}

async function setMode(mode) {
  currentMode = mode;
  await chrome.storage.sync.set({ mode });
  
  // Reset state when changing modes, but don't clear storage for current mode
  if (mode !== 'first_sound') {
    firstSoundTabId = null;
    await chrome.storage.sync.remove('firstSoundTabId');
  }
  if (mode !== 'manual') {
    manualSelectedTabId = null;
    await chrome.storage.sync.remove('manualSelectedTabId');
  }
  
  if (mode === 'disabled') {
    await unmuteAllTabs();
  } else {
    await initializeMode();
  }
}

async function setFirstSoundTabCloseOption(option) {
  onFirstSoundTabClose = option;
  await chrome.storage.sync.set({ onFirstSoundTabClose: option });
}

async function handleFirstSoundTabClosure() {
  // Clear the current first sound tab
  firstSoundTabId = null;
  await chrome.storage.sync.remove('firstSoundTabId');
  
  // Find the next audible tab to become the new first sound tab
  const audibleTabs = await chrome.tabs.query({ audible: true });
  
  if (audibleTabs.length > 0) {
    // Select the first available audible tab as the new first sound tab
    firstSoundTabId = audibleTabs[0].id;
    await chrome.storage.sync.set({ firstSoundTabId });
    
    // Apply first sound mode logic with the new tab
    await handleFirstSoundMode();
  }
  // If no audible tabs remain, firstSoundTabId stays null
}

async function initializeMode() {
  isProcessing = true;
  
  try {
    switch (currentMode) {
      case 'active':
        const activeTab = await getCurrentActiveTab();
        if (activeTab) {
          await handleActiveTabMode(activeTab.id);
        }
        break;
        
      case 'first_sound':
        await handleFirstSoundMode();
        break;
        
      case 'manual':
        if (manualSelectedTabId) {
          await handleManualMode();
        }
        break;
    }
  } finally {
    isProcessing = false;
  }
}

async function handleActiveTabMode(activeTabId) {
  const tabs = await chrome.tabs.query({});
  
  for (const tab of tabs) {
    if (tab.id === activeTabId) {
      await chrome.tabs.update(tab.id, { muted: false });
    } else if (tab.audible) {
      await chrome.tabs.update(tab.id, { muted: true });
    }
  }
}

async function handleFirstSoundMode() {
  if (!firstSoundTabId) {
    // Find the first audible tab
    const tabs = await chrome.tabs.query({ audible: true });
    if (tabs.length > 0) {
      firstSoundTabId = tabs[0].id;
      // Save to storage
      await chrome.storage.sync.set({ firstSoundTabId });
    }
  }
  
  if (firstSoundTabId) {
    const tabs = await chrome.tabs.query({});
    
    for (const tab of tabs) {
      if (tab.id === firstSoundTabId) {
        await chrome.tabs.update(tab.id, { muted: false });
      } else if (tab.audible) {
        await chrome.tabs.update(tab.id, { muted: true });
      }
    }
  }
}

async function handleManualMode() {
  if (manualSelectedTabId) {
    const tabs = await chrome.tabs.query({});
    
    for (const tab of tabs) {
      if (tab.id === manualSelectedTabId) {
        await chrome.tabs.update(tab.id, { muted: false });
      } else if (tab.audible) {
        await chrome.tabs.update(tab.id, { muted: true });
      }
    }
  }
}

async function handleAudioChange(tabId, tab) {
  // Re-apply current mode logic when audio state changes
  await initializeMode();
}

async function selectManualTab(tabId) {
  manualSelectedTabId = tabId;
  // Save to storage
  await chrome.storage.sync.set({ manualSelectedTabId });
  if (currentMode === 'manual') {
    await handleManualMode();
  }
}

async function unmuteAllTabs() {
  const tabs = await chrome.tabs.query({ muted: true });
  
  for (const tab of tabs) {
    await chrome.tabs.update(tab.id, { muted: false });
  }
}

async function getCurrentActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0] || null;
}

async function getAllTabs() {
  return await chrome.tabs.query({});
}

async function getStatus() {
  const activeTab = await getCurrentActiveTab();
  const allTabs = await getAllTabs();
  const audibleTabs = allTabs.filter(tab => tab.audible);
  const mutedTabs = allTabs.filter(tab => tab.mutedInfo && tab.mutedInfo.muted);
  
  return {
    mode: currentMode,
    activeTabId: activeTab?.id,
    firstSoundTabId,
    manualSelectedTabId,
    totalTabs: allTabs.length,
    audibleTabs: audibleTabs.length,
    mutedTabs: mutedTabs.length,
    onFirstSoundTabClose
  };
}
