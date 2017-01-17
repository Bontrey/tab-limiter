// Saves options to chrome.storage.sync.
function save_options() {
  var color = document.getElementById('color').value;
  var likesColor = document.getElementById('like').checked;
  chrome.storage.sync.set({
    favoriteColor: color,
    likesColor: likesColor
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    favoriteColor: 'red',
    likesColor: true
  }, function(items) {
    document.getElementById('color').value = items.favoriteColor;
    document.getElementById('like').checked = items.likesColor;
  });
}

function addHost() {
  const hostList = document.getElementById('host-list');
  const wrap = document.createElement('div');
  wrap.appendChild(createInput('host', 'text'));
  wrap.appendChild(createInput('limit', 'number'));
  hostList.append(wrap);
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
document.getElementById('add-button').addEventListener('click', addHost);
document.getElementById('save').addEventListener('click',
    save_options);
