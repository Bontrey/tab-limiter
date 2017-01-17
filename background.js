chrome.webNavigation.onDOMContentLoaded.addListener(function(details) {
  if (details.url !== 'about:blank') {
    console.log(details);
  }
});

