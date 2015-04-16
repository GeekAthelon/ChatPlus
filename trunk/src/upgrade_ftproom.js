var upgrades = upgrades || {};

upgrades.control_ftp_files = (function() {
  "use strict";

  var imageExts = ["gif", "jpg", "png"];
  var editableExts = ["css", "js", "txt", "html"];

  var soiDetails = identifySoi(); //jshint ignore:line
  var maxEditSize = 20000;

  var newalist = {}; // Build a list that shows just the things that exist.
  
  function currentNick() {
    var el = document.getElementsByName("vqvat");
    if (!el || el.length === 0) {
      return null;
    }
    return el[0].value;
  }
  
  function getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1].toLowerCase();
  }

  function upgradeSaveButton() {
    function checkSize(event) {
      var size = +document.getElementsByName("vqxsp")[0].value.length;
      var hsize = humanFileSize(size);

      if (size > maxEditSize) {
        event.preventDefault();
        alert("This text is too big to save.  Max size is " + maxEditSize + "." +
          " The current file size = " + size + " (" + hsize + ")");
      }
    }

    var saveButton = document.querySelector("[value=Save]");
    if (!saveButton) {
      return;
    }

    addEvent(saveButton, "click", checkSize);
  }

  function upgradeEditButton(link) {
    function doEdit(/*event*/) {
      if (size > maxEditSize) {
        alert("This file is too large to edit.  SOI truncates files over " + maxEditSize + " bytes in length.");
        return;
      }

      var name = link.textContent;

      var editButton = document.querySelector('input[type="submit"][name="GOJUNK"][value="Edit"]');
      var box = editButton.parentNode.querySelector("[name=vqxca]");
      box.value = name;
      editButton.click();
    }

    var size;
    var editButtonLocation = myDom.nextElementSibling(link.parentNode);
    size = parseInt(editButtonLocation.textContent, 10);
    editButtonLocation = myDom.nextElementSibling(editButtonLocation);
    editButtonLocation = myDom.nextElementSibling(editButtonLocation);
    editButtonLocation = myDom.nextElementSibling(editButtonLocation);

    var ext = getExtension(link.href);

	var tag;
    if (editableExts.indexOf(ext) !== -1) {
      tag = myDom.createATag("#", "Edit");
      tag.className += " chatplus-edit-button";
      editButtonLocation.innerHTML = "";
      addEvent(tag, "click", doEdit);
    } else {
      tag = myDom.createTag("span", "");
    }
    editButtonLocation.appendChild(tag);
  }

  function upgradeFileSize(link) {
    var sizeEl = myDom.nextElementSibling(link.parentNode);
    var size = +sizeEl.textContent;
    var hsize = humanFileSize(size);

    var tNode = document.createTextNode(" (" + hsize + ")");
    var el = document.createElement("i");
    el.className = "chatplus-file-size";
    el.appendChild(tNode);

    sizeEl.appendChild(el);
  }

  function upgradeImageDetails(link) {
  
    // Get the Avatar List
    var aalist = realmList[":avatars:"];
    if (aalist[currentNick] === undefined) {
      aalist[currentNick] = {};
    }

    var alist = aalist[currentNick]; // All avatars - may include ones that have been deleted
    
    function makeAddOrRemove(elem, _mode) {
      return function(event) {
        var url = elem.href;
        var m = _mode ? "remove" : "add";

        var data = {
          fname: url,
          nick: currentNick,
          sname: elem.textContent
        };

        if (m === "add") {
          controlPanel.addAvatar(event, data);
        }
        if (m === "remove") {
          controlPanel.removeAvatar(event, data);
        }
      };
    }

    var ext = getExtension(link.href);
    var tag;
    if (imageExts.indexOf(ext) !== -1) { // If that is a picture extension
      var sname = myDom.urlEncode(link.textContent);
      var mode = (!!alist[sname]);

      // If the avatar is already on file, re-file it.
      // This will clean out "stale" avatar data.
      if (mode) {
        newalist[sname] = alist[sname];
      }

      tag = myDom.createATag("#", mode ? "Remove_Ava" : "Add_Ava");
      tag.className += " chatplus-add-ava";
      addEvent(tag, "click", makeAddOrRemove(link, mode));
    } else {
      tag = myDom.createTag("span", "");
    }

    var p = link.parentNode;
    myDom.insertAfter(myDom.createTag("td", tag), p.nextSibling);
  }

  function updateAvatarList() {
    var actionLinks = document.querySelectorAll("table a");

    for (var i = 0; i < actionLinks.length; i++) {
      var link = actionLinks[i];

      upgradeImageDetails(link);
      upgradeFileSize(link);
      upgradeEditButton(link);

    }
    realmList[":avatars:"][currentNick] = newalist;

    upgradeSaveButton();
    saveRealmList();
  }

  function upgrade() {
    updateAvatarList();
  }
    
  var internals = {
    getExtension: getExtension,
	currentNick: currentNick
  };

  return {
    upgrade: upgrade,
    internals: internals
  };
}());