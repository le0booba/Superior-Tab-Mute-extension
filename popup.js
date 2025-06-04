// Superior Tab Mute - Popup Script

class TabMuterPopup {
    constructor() {
        this.currentStatus = null;
        this.tabs = [];
        this.firstSoundTabCloseOption = 'do_nothing';
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadStatus();
        await this.loadTabs();
        await this.loadFirstSoundTabCloseOption();
        this.updateUI();
    }

    bindEvents() {
        // Mode selection
        document.querySelectorAll('input[name="mode"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.handleModeChange(e.target.value);
            });
        });

        // First sound tab close option
        document.querySelectorAll('input[name="first-sound-close"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.handleFirstSoundCloseOptionChange(e.target.value);
            });
        });

        // Refresh button
        document.getElementById('refresh-btn').addEventListener('click', () => {
            this.refresh();
        });

        // Tab dropdown selection
        const tabDropdown = document.getElementById('tab-dropdown');
        if (tabDropdown) {
            tabDropdown.addEventListener('change', (e) => {
                const selectedTabId = parseInt(e.target.value);
                if (selectedTabId) {
                    this.selectTab(selectedTabId);
                }
            });
        }
    }

    async loadStatus() {
        try {
            this.currentStatus = await this.sendMessage({ action: 'getStatus' });
        } catch (error) {
            console.error('Failed to load status:', error);
            this.currentStatus = {
                mode: 'disabled',
                totalTabs: 0,
                audibleTabs: 0,
                mutedTabs: 0
            };
        }
    }

    async loadTabs() {
        try {
            const response = await this.sendMessage({ action: 'getTabs' });
            this.tabs = response.tabs || [];
        } catch (error) {
            console.error('Failed to load tabs:', error);
            this.tabs = [];
        }
    }

    async loadFirstSoundTabCloseOption() {
        try {
            const response = await this.sendMessage({ action: 'getFirstSoundTabCloseOption' });
            this.firstSoundTabCloseOption = response.option || 'do_nothing';
        } catch (error) {
            console.error('Failed to load first sound tab close option:', error);
            this.firstSoundTabCloseOption = 'do_nothing';
        }
    }

    updateUI() {
        this.updateStatus();
        this.updateModeSelection();
        this.updateTabSelection();
        this.updateInfoPanel();
        this.updateFirstSoundOptions();
    }

    updateStatus() {
        const statusElement = document.getElementById('status');
        const mode = this.currentStatus?.mode || 'disabled';
        
        const statusTexts = {
            disabled: 'All tabs active',
            active: 'Active tab only',
            first_sound: 'First sound tab',
            manual: 'Manual selection'
        };

        statusElement.textContent = statusTexts[mode] || 'Unknown mode';
    }

    updateModeSelection() {
        const mode = this.currentStatus?.mode || 'disabled';
        
        // Map mode values to HTML element IDs
        const modeToElementId = {
            'disabled': 'mode-disabled',
            'active': 'mode-active',
            'first_sound': 'mode-first-sound',
            'manual': 'mode-manual'
        };
        
        // Clear all radio selections first
        document.querySelectorAll('input[name="mode"]').forEach(radio => {
            radio.checked = false;
        });
        
        // Set the correct radio selection
        const elementId = modeToElementId[mode];
        const radio = document.getElementById(elementId);
        if (radio) {
            radio.checked = true;
        }

        // Show/hide manual tab selection dropdown
        const tabSelection = document.getElementById('tab-selection');
        if (mode === 'manual') {
            tabSelection.style.display = 'block';
            this.renderTabDropdown();
        } else {
            tabSelection.style.display = 'none';
        }

        // Show/hide first sound options
        const firstSoundOptions = document.getElementById('first-sound-options');
        if (firstSoundOptions) {
            if (mode === 'first_sound') {
                firstSoundOptions.style.display = 'block';
            } else {
                firstSoundOptions.style.display = 'none';
            }
        }
    }

    updateFirstSoundOptions() {
        // Clear all radio selections first
        document.querySelectorAll('input[name="first-sound-close"]').forEach(radio => {
            radio.checked = false;
        });

        // Set the correct radio selection
        const optionToElementId = {
            'do_nothing': 'close-do-nothing',
            'next_sound_tab': 'close-next-sound'
        };

        const elementId = optionToElementId[this.firstSoundTabCloseOption];
        const radio = document.getElementById(elementId);
        if (radio) {
            radio.checked = true;
        }
    }

    updateTabSelection() {
        if (this.currentStatus?.mode === 'manual') {
            this.renderTabDropdown();
        }
    }

    updateInfoPanel() {
        const status = this.currentStatus || {};
        
        document.getElementById('total-tabs').textContent = status.totalTabs || 0;
        document.getElementById('audible-tabs').textContent = status.audibleTabs || 0;
        document.getElementById('muted-tabs').textContent = status.mutedTabs || 0;

        // Update first sound tab info if available
        const firstSoundInfo = document.getElementById('first-sound-info');
        if (firstSoundInfo && status.mode === 'first_sound') {
            if (status.firstSoundTabId) {
                const firstSoundTab = this.tabs.find(tab => tab.id === status.firstSoundTabId);
                if (firstSoundTab) {
                    const title = this.truncateText(firstSoundTab.title || 'Untitled', 30);
                    const domain = this.getDomainFromUrl(firstSoundTab.url);
                    firstSoundInfo.textContent = `Current: ${title} (${domain})`;
                    firstSoundInfo.style.display = 'block';
                } else {
                    firstSoundInfo.textContent = 'Current: Tab not found';
                    firstSoundInfo.style.display = 'block';
                }
            } else {
                firstSoundInfo.textContent = 'No first sound tab selected';
                firstSoundInfo.style.display = 'block';
            }
        } else if (firstSoundInfo) {
            firstSoundInfo.style.display = 'none';
        }
    }

    renderTabDropdown() {
        const tabDropdown = document.getElementById('tab-dropdown');
        
        // Clear existing options
        tabDropdown.innerHTML = '';

        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select a tab to keep unmuted...';
        defaultOption.disabled = true;
        tabDropdown.appendChild(defaultOption);

        // Filter out muted tabs and add non-muted tabs to dropdown
        const nonMutedTabs = this.tabs.filter(tab => !tab.mutedInfo?.muted);
        
        if (nonMutedTabs.length === 0) {
            const noTabsOption = document.createElement('option');
            noTabsOption.value = '';
            noTabsOption.textContent = 'No non-muted tabs available';
            noTabsOption.disabled = true;
            tabDropdown.appendChild(noTabsOption);
        } else {
            nonMutedTabs.forEach(tab => {
                const option = document.createElement('option');
                option.value = tab.id;
                
                // Create option text with audio indicator
                const audioIndicator = tab.audible ? '🔊 ' : '';
                const title = this.truncateText(tab.title || 'Untitled', 40);
                const domain = this.getDomainFromUrl(tab.url);
                
                option.textContent = `${audioIndicator}${title} (${domain})`;
                option.title = `${tab.title}\n${tab.url}`;
                
                // Mark as selected if this is the currently selected tab
                if (tab.id === this.currentStatus?.manualSelectedTabId) {
                    option.selected = true;
                }
                
                tabDropdown.appendChild(option);
            });
        }

        // If no tab is currently selected, select the default option
        if (!this.currentStatus?.manualSelectedTabId) {
            tabDropdown.selectedIndex = 0;
        }
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }

    getDomainFromUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch {
            return url;
        }
    }

    async handleModeChange(mode) {
        try {
            await this.sendMessage({ action: 'setMode', mode });
            await this.loadStatus();
            this.updateUI();
        } catch (error) {
            console.error('Failed to change mode:', error);
        }
    }

    async handleFirstSoundCloseOptionChange(option) {
        try {
            await this.sendMessage({ action: 'setFirstSoundTabCloseOption', option });
            this.firstSoundTabCloseOption = option;
            this.updateFirstSoundOptions();
        } catch (error) {
            console.error('Failed to change first sound close option:', error);
        }
    }

    async selectTab(tabId) {
        try {
            await this.sendMessage({ action: 'selectTab', tabId });
            await this.loadStatus();
            this.updateTabSelection();
        } catch (error) {
            console.error('Failed to select tab:', error);
        }
    }

    async refresh() {
        const refreshBtn = document.getElementById('refresh-btn');
        const originalText = refreshBtn.textContent;
        
        refreshBtn.textContent = '⟳ Refreshing...';
        refreshBtn.disabled = true;

        try {
            await this.loadStatus();
            await this.loadTabs();
            await this.loadFirstSoundTabCloseOption();
            this.updateUI();
        } catch (error) {
            console.error('Failed to refresh:', error);
        } finally {
            refreshBtn.textContent = originalText;
            refreshBtn.disabled = false;
        }
    }

    sendMessage(message) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(message, (response) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else if (response?.error) {
                    reject(new Error(response.error));
                } else {
                    resolve(response);
                }
            });
        });
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TabMuterPopup();
});
