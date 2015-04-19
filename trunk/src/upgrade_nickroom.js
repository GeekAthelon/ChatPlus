var upgrades = upgrades || {};

upgrades.control_nicknames = (function() {
  "use strict";

  window.soiDetails = identifySoi(); //jshint ignore:line

  function addNickPreview() {
    var nickDiv = document.createElement("span");
    var nickBox = document.getElementsByName("vqvcl")[0];
    var tag = myDom.createATag("#", "Preview Nickname ===> ");
    tag.id = "chatplus-previewnick";

    function showNick() {
      nickDiv.innerHTML = nickBox.value;
    }

    nickDiv.id = "nickDiv";
    nickDiv.innerHTML = nickBox.value;

    myDom.insertAfter(document.createElement("br"), nickBox);
    myDom.insertAfter(nickDiv, nickBox);
    myDom.insertAfter(tag, nickBox);
    myDom.insertAfter(document.createElement("br"), nickBox);

    addEvent(tag, "click", function(/*event*/) {
      showNick();
    });
    showNick();
  }


  function addAvatarButtons() {
    var sel;
    var dest;
    var nick = document.getElementsByName("vqvbf")[0].value;
    var div = document.createElement("div");
    var form;
    var e;
    var key;
    var opt;

    div.appendChild(document.createElement("hr"));
    div.appendChild(myDom.createTag("h3", "Or Choose Avatar from List."));

    div.appendChild(myDom.createTag("i", "Goto FTP_FILES to add avatars to " + "this list, or to clean out ghosts."));

    //div.appendChild(document.createElement("hr"));
    var avalist = realmList[":avatars:"][nick];

    form = document.getElementsByName("avaurl")[0];
    while (form.tagName.toLowerCase() !== "form") {
      form = form.parentNode;
    }

    dest = form.elements.namedItem("vqvaj");

    sel = document.createElement("select");
    sel.id = "chatplus-select-avatar";

    opt = new Option("***** Choose one *****", "");
    sel.options.add(opt);

    for (key in avalist) {
      if (avalist.hasOwnProperty(key)) {
        opt = new Option(key, key);
        sel.options.add(opt);
      }
    }

    div.appendChild(document.createElement("br"));
    div.appendChild(sel);

    e = document.createElement("img");
    e.src = "http://soiroom.hyperchat.com/chatplus/question_mark.jpg";

    div.appendChild(e);
    myDom.insertAfter(div, dest);

    addEvent(sel, "change", function(/*event*/) {
      var val = sel[sel.selectedIndex].value;
      if (val === "") {
        return;
      }

      var ava = realmList[":avatars:"][nick][val];
      var d = form.elements;

      e.src = ava.url;
      // Fx handles this on its own.
      // IE didn't, but there isn't any harm
      // in doing it "just because."
      e.width = ava.width;
      e.height = ava.height;

      d.namedItem("avawidth").value = ava.width;
      d.namedItem("avaheight").value = ava.height;
      d.namedItem("avaurl").value = val;
    });
  }

  function upgrade() {
    addAvatarButtons();
    addNickPreview();
  }

  var internals = {
    addAvatarButtons: addAvatarButtons,
    addNickPreview: addNickPreview
  };

  return {
    upgrade: upgrade,
    internals: internals
  };
}());