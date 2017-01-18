chrome.webNavigation.onDOMContentLoaded.addListener(function(details) {
  if (details.url !== 'about:blank') {
    onNav(getHost(details.url));
  }
});

function onNav(openedHost) {
  chrome.storage.sync.get({
    hostLimits: []
  }, function({ hostLimits }) {
    enforceLimits(hostLimits, openedHost);
  });
}

function enforceLimits(hostLimits, openedHost) {
  const matchedHostLimits = hostLimits.filter(function(hostLimit) {
    return hostsMatch(openedHost, hostLimit.host);
  });

	if (matchedHostLimits.length < 1) {
    return;
  }

  matchedHostLimits.sort(function(hostLimit1, hostLimit2) {
    return hostLimit2.host.length - hostLimit1.host.length;
  });

  enforce(matchedHostLimits);
}

function enforce(hostLimits) {
  const hostLimit = hostLimits.shift();
  chrome.tabs.query(
      {
        url: '*://*.' + hostLimit.host + '/*'
      },
      function(result) {
        let removed = false;
        while (result.length > 0 && result.length > hostLimit.limit) {
          chrome.tabs.remove(result.shift().id);
					removed = true;
			  }

        if (hostLimits.length > 0 &&
            !removed &&
            hostLimits[0].limit > hostLimit.limit) {
					enforce(hostLimits);
        }
      });
}

function getHost(url) {
  const l = document.createElement("a");
  l.href = url;
  return l.hostname;
}

function hostsMatch(toMatch, matched) {
  const toMatchParts = toMatch.split('.');
  const matchedParts = matched.split('.');

  if (toMatchParts.length < matchedParts.length) {
    return false;
  }

  for (let i = 0; i < matchedParts.length; i++) {
		if (matchedParts[matchedParts.length - 1 - i] !=
        toMatchParts[toMatchParts.length - 1 - i]) {
      return false;
    }
  }

  return true;
}
