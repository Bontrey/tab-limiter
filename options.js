function save_options() {
  const hostEntries = document.getElementsByClassName('host-entry');
  const hostLimits = [];
  for (const entry of hostEntries) {
    const inputs = entry.getElementsByTagName('input');
    const host = inputs[0].value;
    const limit = Number(inputs[1].value);
    if (host.length > 0 && limit > 0) {
      hostLimits.push({
        host,
        limit
      });
    }
  };

  chrome.storage.sync.set({
    hostLimits
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restore_options() {
  chrome.storage.sync.get({
    hostLimits: []
  }, function({ hostLimits }) {
    for (const hostLimit of hostLimits) {
      const [hostInput, limitInput] = addHostRow();
      hostInput.value = hostLimit.host;
      limitInput.value = hostLimit.limit;
    }
  });
}

function addHostRow() {
  const hostList = document.getElementById('host-list');
  const wrap = document.createElement('div');
  wrap.className = 'host-entry';

  const host = createInput('host', 'text');
  wrap.appendChild(host);

  wrap.appendChild(createInput('limit', 'number'));

  const deleteButton = document.createElement('div');
  deleteButton.innerHTML = '&#10005;';
  deleteButton.style = 'display:inline;padding:5px 2px 5px 3px;';
  deleteButton.addEventListener('click', () => {
    wrap.parentNode.removeChild(wrap);
  });
  wrap.appendChild(deleteButton);

  hostList.append(wrap);
  return wrap.getElementsByTagName('input');
}

function createInput(labelText, type) {
  const label = document.createElement('label');
  label.appendChild(document.createTextNode(labelText));
  const input = document.createElement('input');
  input.type = type;
  label.appendChild(input);
  return label;
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('add-button').addEventListener('click', addHostRow);
document.getElementById('save').addEventListener('click',
    save_options);
