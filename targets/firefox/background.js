const catalystUrl = browser.runtime.getURL("index.html");

browser.action.onClicked.addListener(() => {
  browser.tabs.create({ url: catalystUrl });
});
