// Background service worker for WoltFlow Token Reviewer
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('WoltFlow Token Reviewer extension installed');
  }
});
