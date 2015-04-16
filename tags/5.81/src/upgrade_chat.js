window.qunit = window.qunit || {};
window.qunit.chat = {};
window.qunit.chat.namesList = [];

var upgradeChat = function(callback, doRun) {
  "use strict";

  window.qunit.chat.namesList = [];
  
  var seps = ["said to", "said", "whispered to", "EMAILEDx"];
  var sepI, sep, sepL;

  var sepL = seps.length;

  var fromText = ""; // Who the message is from
  var toText = ""; // Who the message is to
  var msgType = "";
  var hasRealmButton = false;
  var toFullSoiStyleName;
  var fromFullSoiStyleName;

  var specialBox; // The popup box for special options
  var specialButton;

  function triggerNicksUpgradeComplete() {
    if (typeof callback === "function") {
      callback();
    }
  }


  var citizenTest = function(elem) {
    var e = elem;
    var i;
    var s;

    for (i = 0; i < 15; i++) {
      if (e && e.tagName && e.tagName.toLowerCase() === "a") {
        s = myDom.getText(e);
        if (s === "~") {
          return true;
        } else if (s === "*") {
          return false;
        }
      }
      e = myDom.prevNode(e);
      if (!e) {
        break;
      }
    }
    return false;
  };

  function handleReplyClick(_from, _to, domain) {
    return function(event) {
      var i;
      var select, options;
      var val;
      var domainGood = false;

      if (domain) {
        select = soiDetails.formMail.elements.namedItem("vqvck");
        if (select && select.options && select.options.length) {
          options = select.options;
          for (i = 0; i < options.length; i++) {
            val = getOptionValue(options[i])
              .toLowerCase();
            //alert([val, domain.toLowerCase()]);
            if (val === domain.toLowerCase()) {
              select.selectedIndex = i;
              domainGood = true;
              break;
            }
          }
        }

        if (!domainGood) {
          userWindow.alert("Couldn't find specified domain in drop down list.");
        }
      }

      soiDetails.formMail.elements.namedItem("vqxha").value = _from;
      soiDetails.formMail.elements.namedItem("vqxto").value = _to;
      userWindow.location.hash = "chatmark";
      soiDetails.formMail.elements.namedItem("vqxsp").focus();
    };
  }

  var makeReplyButton = function(elem) {
    var domain;
    var e = elem;
    var msgSpan;
    var i;

    if (!document.getElementById("nameSetupPrompt")) {
      msgSpan = myDom.createTag("div", myDom.createTag("strong", "To make reply work, goto " + "[ChatPlus Controls] [Master Controls]"));
      msgSpan.id = "nameSetupPrompt";
      myDom.insertAfter(msgSpan, soiDetails.formMail.elements.namedItem("vqxsp"));
    }

    // If the user has name list setup, then make sure the "to" name is
    // on the list...
    var a = realmList[":masterSettings:"].userNames;
    var myFrom = toText;
    var myTo = fromText;
    var buttonText;
    var tmp;
    var isKnownNick = false;

    buttonText = "Reply";
    myFrom = toFullSoiStyleName;
    myTo = fromFullSoiStyleName;

    if (a.indexOf(myFrom) !== -1) {
      isKnownNick = true;
    } else { // The name isn't on "ournames" list
      // See if the user send this message
      tmp = myFrom;
      myFrom = myTo;
      myTo = tmp;
      buttonText = "MSG again";

      if (a.indexOf(myFrom) !== -1) {
        isKnownNick = true;
      }
    }

    // The nickname wasn't found -- maybe it is email
    if (!isKnownNick) {
      e = elem;
      for (i = 0; i < 9; i++) {
        if (myDom.getText(e) === "**EMAIL**") {
          domain = fromText.split("@")[1];
          buttonText = "Email again";
          myFrom = fromText.split("@")[0];
          myTo = toText;
          isKnownNick = true;
          break;
        }
        e = myDom.prevNode(e);
        if (!e) {
          break;
        }
      }
    }

    function fixName(n) {
      n = n.replace(/\(/g, "");
      n = n.replace(/\)/g, "");
      n = n.replace(/:/g, "");
      n = n.replace(/\ /g, "");
      return n;
    }


    if (!isKnownNick && msgType === 'EMAILEDx') {
      toText = fixName(toText);
      fromText = fixName(fromText);

      buttonText = "Email Reply";
      myTo = toText.split("@")[0];
      domain = toText.split("@")[1];
      myFrom = fromText;

      tmp = myFrom;
      myFrom = myTo;
      myTo = tmp;

      isKnownNick = true;
      domain = fixName(domain);
    }

    if (!isKnownNick) {
      return;
    }

    e = elem; // Restore the value
    for (i = 0; i < 9; i++) {
      if (e && e.tagName && e.tagName.toLowerCase() === "input" && e.type === "checkbox") {

        var rBut = myDom.createATag("#", buttonText);
	    rBut.className += " chatplus-mass-mail";
		rBut.setAttribute("data-chatplus-mode", buttonText);
        rBut.setAttribute("data-chatplus-from", myFrom);
		rBut.setAttribute("data-chatplus-to", myTo);
		
        if (domain) {
          rBut.title = "Send Email to " + myTo + " as " + myFrom + "@" + domain;
        } else {
          rBut.title = "Send MSG to " + myTo + " as " + myFrom;
        }
        addEvent(rBut, 'click', handleReplyClick(myFrom, myTo, domain));
        myDom.insertAfter(rBut, e);
        break;
      }
      e = myDom.prevNode(e);
      if (!e) {
        break;
      }
    }
    return false;
  };


  var parseNames = function(
    e, // The element to take names from
    divide, // The element that splits "from" and "to:"
    separator // The text seperator to use
  ) {

    var fromElement = myDom.createTag("span", "*from*");
    var toElement = myDom.createTag("span", "*to*");
    var dest;
    var nodeCopy;
    var end;
    //NUKE var master = realmList[":masterSettings:"];
    var i, l;
    var defaultTail = document.getElementsByName("roomsite")[0].value;
    var ops;
    var isCitizen = false;
    var f = e.firstChild;
    var fromNinfo;
    var toNinfo;

    dest = myDom.createTag("span");

    // Rewrote this code to loop through childNodes rather
    // than using nextSibling.  IE and its pain-in-the-ass
    // empty text nodes was killing nextSibling.
    l = e.childNodes.length;
    for (i = 0; i < l; i++) {
      f = e.childNodes[i];
      nodeCopy = f.cloneNode(true);
      if (myDom.getText(f) === separator) {
        fromElement = dest;
        dest = myDom.createTag("span");
      } else {
        dest.appendChild(nodeCopy);
      }
    }
    toElement = dest;

    if (soiDetails.formMail) {
      isCitizen = citizenTest(e);
    }

    end = myDom.createTag("b");
    end.appendChild(fromElement);

    // Remove that annoying space from the end of names
    homeFree: while (true) {
      dest = fromElement.lastChild;

      if (!dest) {
        break;
      }

      while (dest.nodeType !== 3) {
        // Empty text nodes seemed to screw up lastChild
        // Handle folks like Imperius who have a weird "<i/>" tag in their
        // name by some magic.  It isn't valid and shouldn't even be
        // possible, but it happens anyways, at least under IE.
        // (Non-container type tags, like <br> and <hr> aren't valid
        // in names, but this code would catch those too
        if (dest.childNodes.length === 0) {
          break homeFree;
        }

        dest = dest.childNodes[dest.childNodes.length - 1];
      }

      // Some folks have extra trailing spaces/nodes on the end.
      if (dest.nodeType === 3 && (dest.nodeValue === "" || dest.nodeValue === " ")) {
        dest.parentNode.removeChild(dest);
        continue;
      }

      // Clean up any left over spaces.
      dest.nodeValue = dest.nodeValue.replace(/ *$/g, "");
      break;
    }

    // Get rid of the trailing colon.
    dest = toElement.lastChild;
    if (myDom.getText(dest) === ":") {
      toElement.removeChild(dest);
    }

    end.appendChild(myDom.createTag("i", " " + separator + " "));
    end.appendChild(toElement);
    end.appendChild(document.createTextNode(":"));


    msgType = separator;
    fromNinfo = extractNameInfo(fromElement, defaultTail);
    fromText = fromNinfo.decoratedName;
    fromFullSoiStyleName = fromNinfo.fullSoiStyleName;

    toNinfo = extractNameInfo(toElement, defaultTail);
    toText = toNinfo.decoratedName;
    toFullSoiStyleName = toNinfo.fullSoiStyleName;

    ops = " [Click for options]";

    fromElement.title = nameList[fromText].decoratedName + ops;
    fromElement.className = "chatPlus_nick";

    toElement.title = nameList[toText].decoratedName + ops;
    toElement.className = "chatPlus_nick";

    if (isCitizen && soiDetails.formMail) {
      makeReplyButton(e);
    }

    return end;
  };


  // Debugging code.
  function showResponse(response) {
    var msg = "";
    var i;
    if (response) {
      for (i in response) {
        if (response.hasOwnProperty(i)) {
          msg += [i, response[i]] + "\r\n";
        }
      }
      alert("showResponse " + msg);
    }
  }

  var makeExtendedMailRoom = function(elem) {
    var tmp;
    var frag;
    var ccLabel;
    var bccLabel;
    var ccElem;
    var bccElem;
    var s;
    var toBoxName = 'vqxto';
    var toList;
    var statusBar;
    var rBut;
    var ccList;
    var bccList;
    var inError;
    var messageIdx;


    function setBulkMailStatus(msg) {
      document.title = msg;
      if (msg.length !== 0) {
        statusBar.innerHTML = "<br>" + msg;
      } else {
        statusBar.innerHTML = "";
      }
    }

    function setBulkMailStatusWait(msg) {
      setBulkMailStatus(msg + "<br>Please wait.");
    }

    function setDisabled(mode) {
      ccElem.disabled = mode;
      bccElem.disabled = mode;

      soiDetails.formMail.elements.namedItem("vqxha")
        .readOnly = !mode;
    }

    function sendMassMail() {
      var data;

      function cleanupAndVerify(toList) {
        var i, l = toList.length;
        var a;
        var names = {};
        var err = [];
        var n;

        for (i = 0; i < l; i++) {
          a = toList[i].split("@");
          n = normalizeName(a[0]);
          if (a[1]) {
            n += "@" + normalizeName(a[1]);
          } else {
            n += "@" + soiDetails.blankTail;
          }
          if (names[n]) {
            err.push("Duplicate name `" + n + "'");
          }
          names[n] = true;
          toList[i] = n;
        }

        if (err.length) {
          userWindow.alert("Sendmail errors: " + err.join("\r\n"));
          return false;
        } else {
          return true;
        }
      }

      function sendError(err) {
        userWindow.alert("Error!" + JSON.stringify(err) + err);
      }

      function sendNextMessage(response) {
        var dest;
        var fullData = [];
        var msg;
        var action;

        if (response && response.readyState !== 4) {
          return;
        }

        if (messageIdx === toList.length) {
          setBulkMailStatusWait("Sent all messages");
          userWindow.location.href = getLinkHrefByText("Mail");
          return;
        }

        dest = toList[messageIdx];
        data.vqxto = urlencode(dest);
        messageIdx++;

        msg = "Sending message to: " + dest + " (" + messageIdx + " of " + toList.length + ")";
        setBulkMailStatusWait(msg);
        fullData = objectToUrlArray(data);

        action = fixFormAction(soiDetails.formMail);

        var o = {
          method: "POST",
          url: action,
          data: fullData.join("&"),
          onreadystatechange: sendNextMessage,
          onerror: sendError
        };

        //alert(o.toJSON());
        //setBulkMailStatus(action);
        GM_xmlhttpRequest(o);
      }

      ccList = ccElem.value.split(",");
      bccList = bccElem.value.split(",");
      inError = false;

      /* Handle blank lines */
      if (trim(ccList[0]) === "") {
        ccList = [];
      }
      if (trim(bccList[0]) === "") {
        bccList = [];
      }

      if (ccList.length === 0 && bccList.length === 0) {
        userWindow.alert("There must be at least one name specified.");
        inError = true;
      }

      if (ccList.length > 0 && bccList.length > 0) {
        userWindow.alert("You can only use one at a time.  'CC' or 'BCC' but not both.");
        inError = true;
      }

      if (inError) {
        return;
      }

      data = serializeFormUrlencoded(soiDetails.formMail);
      data.vqvaj = urlencode("Talk/Listen"); // Force in the button press.
      if (ccList.length) {
        toList = ccList;
        if (!cleanupAndVerify(toList)) {
          return;
        }
        // Update the message:
        data.vqxsp = urlencode("<font size='-1' color='green'>Bulk message sent to:<br>" + toList.join(", ")
          .split("")
          .join("<b></b>") + "</font><br>") + data.vqxsp;
      } else {
        toList = bccList;
        if (!cleanupAndVerify(toList)) {
          return;
        }
      }

      setDisabled(true);

      messageIdx = 0;
      sendNextMessage();
    }

    function prepSendBulk() {
      var talkListen = document.getElementsByName("vqvaj")[0];
      var toBox = document.getElementsByName(toBoxName)[0];
      var span;

      var newTalk = myDom.createATag("#", "Send Mass Email");

      addEvent(newTalk, 'click', sendMassMail);

      myDom.insertAfter(newTalk, talkListen);
      talkListen.style.display = "none"; //parentNode.removeChild(talkListen);
      rBut.style.display = "none";
      frag.style.display = "";

      myDom.insertAfter(newTalk, talkListen);

      span = document.createElement("span");
      span.appendChild(document.createTextNode(" Disabled "));
      span.className = "chatplus_replace";

      myDom.insertAfter(span, toBox);
      toBox.style.display = "none";

      setDisabled(false);
    }

    function makeTextArea(label, id) {
      var l = document.createElement("fieldset");
      var ta = document.createElement("textarea");
      var legend = document.createElement("legend");

      ta.id = id;
      ta.name = id;
      ta.rows = 4;
      ta.cols = 55;

      legend.appendChild(document.createTextNode(label));
      l.appendChild(legend);
      l.appendChild(document.createElement("br"));
      l.appendChild(ta);
      return l;
    }

    frag = document.createElement("fieldset");
    tmp = document.createElement("legend");
    tmp.appendChild(document.createTextNode("Extended Mail Features"));
    frag.appendChild(tmp);
    frag.className = "hchat_mail";

    var target = document.getElementsByName("vqxby")[0];

    ccLabel = makeTextArea("CC: These names will be seen by everyone who receives the mail message.", "mail_cc");
    bccLabel = makeTextArea("BCC: These names will NOT be seen.", "mail_bcc");

    ccElem = ccLabel.getElementsByTagName("textarea")[0];
    bccElem = bccLabel.getElementsByTagName("textarea")[0];

    s = "Names should be separated by commas. If there is a comma in the nickname, " + "simply leave it out.  \"Bond, James Bond\" would become \"Bond James Bond\"." + " In addition, the character '@' should be used as part of tail and not part of " + "the regular name.  \"lm@o\" would become \"lmo\".";

    frag.appendChild(document.createTextNode(s));
    frag.appendChild(document.createElement("br"));

    frag.appendChild(ccLabel);
    frag.appendChild(document.createElement("br"));
    frag.appendChild(bccLabel);
    myDom.insertAfter(frag, target);
    frag.style.display = "none";
    setDisabled(true);


    var span = document.createElement("span");
    span.appendChild(document.createElement("br"));

    statusBar = document.createElement("span");
    statusBar.className = "chatplus_replace";
    myDom.insertAfter(statusBar, soiDetails.formMail.elements.namedItem("vqxsp"));
    setBulkMailStatus("");


    rBut = myDom.createATag("#", "Turn on mass mailer");
	rBut.id = "chatplus-mass-mail";

    span.appendChild(rBut);
    myDom.insertAfter(span, target);
    rBut.title = "Click here to enable the mass mailer functions";
    addEvent(rBut, 'click', function() {
      setBulkMailStatusWait("Checking identify");

      var nickInfo = {
        nick: soiDetails.formMail.elements.namedItem("vqxha").value.split("@")[0],
        onsuccess: function() {
          setBulkMailStatus("");
          prepSendBulk();
        },
        onfailure: function() {
          setBulkMailStatus("That nickname doesn't seem to be part of this account.");
        }
      };

      processNick(nickInfo);
    });


    function processNick(nickInfo) {

      function getIframeDoc(iframe) {
        var doc = iframe.document;
        if (iframe.contentDocument) {
          doc = iframe.contentDocument; // For NS6
        } else if (iframe.contentWindow) {
          doc = iframe.contentWindow.document; // For IE5.5 and IE6
        }
        return doc;
      }

      function makeIframe() {
        var iframe = document.createElement("iframe");
        iframe.src = getLinkHrefByText("Mail");
        iframe.onload = function() {
          nickCheck(iframe);
        };
        document.getElementsByTagName("body")[0].appendChild(iframe);
        return iframe;
      }

      function nickCheck(iframe) {

        function getValue(elname) {
          var el = doc.getElementsByName(elname);
          if (el && el.length) {
            return el[0].value;
          } else {
            return undefined;
          }
        }


        var doc = getIframeDoc(iframe);
        var name1, name2;

        name1 = getValue("vqxha") + "@" + getValue("roomsite");
        name2 = getValue("vqxus");

        document.body.removeChild(iframe);

        if (name1 === name2) {
          nickInfo.onsuccess();
        } else {
          nickInfo.onfailure();
        }
      }

      var nick = nickInfo.nick;
      var data = serializeFormUrlencoded(soiDetails.formMail);
      data.vqxha = urlencode(nick);
      var fullData = objectToUrlArray(data);
      var action = fixFormAction(soiDetails.formFind);

      function xmlhttpRequestError(err) {
        alert("xmlhttpRequestError");
        alert(JSON.stringify(err));
      }

      makeIframe();
      /*
var o = {
method: "POST",
		headers:    {
			"Content-Type": "application/x-www-form-urlencoded"
		},
url: action,
data: fullData.join("&"),
onreadystatechange: nickCheck,
onerror: xmlhttpRequestError,
onabort: xmlhttpRequestError
};

	  GM_xmlhttpRequest(o);
	  */
    }

    function checkForMsgSend() {
      var iframe;
      var hash = userWindow.location && userWindow.location.hash;
      var n;
      hash = fakeHash || hash;
      if (hash.indexOf("#msg_") === 0) {
        n = hash.split("_")[1];
        soiDetails.formMail.elements.namedItem("vqxto")
          .value = n;
      }
    }
    checkForMsgSend();

  }; //makeExtendedMailRoom

  
  function parseOneNameInner(testElement) {

    function saveName(n) {
      n = n.trim();
      n = n.replace(/:+$/, "");
      window.qunit.chat.namesList.push(n);
    }

    var action;
    var cNode;
    var nameParent;

    // If the tag doesn't have a child next node, skip it.
    cNode = testElement.firstChild;

    if (!cNode) {
      return;
    }
    if (cNode.nodeType !== 3) {
      return;
    }

    // And look at its parent
    nameParent = testElement.parentNode;

    // The elements we want are in 'B' or tags
    if (nameParent.tagName.toLowerCase() !== "b") {
      return;
    }

    // So far, so good.
    //action = myDom.getText(nameParent);
    action = myDom.getText(testElement);

    // Look at our separators
    for (sepI = 0; sepI < sepL; sepI++) {
      sep = seps[sepI];
      if (cNode.nodeValue !== sep) {
        continue;
      }

      var newNameElement = parseNames(nameParent, testElement, sep);

      var els = newNameElement.querySelectorAll(".chatPlus_nick");

      saveName(myDom.getText(els[0]));
      saveName(myDom.getText(els[1]));

      myDom.emptyNode(nameParent);
      nameParent.appendChild(newNameElement);
      break;
    }
  }

  var init = function() {
    var hrArray = document.getElementsByTagName("i");
    var hrIndex, hrLen;

    function parseOneName() {
      var el = hrArray[hrIndex];
      parseOneNameInner(el);

      hrIndex++;

      if (hrIndex < hrLen) {
        setTimeout(parseOneName, 1);
      } else {
        triggerNicksUpgradeComplete();
      }
    }

    hrLen = hrArray.length;
    hrIndex = 0;
    parseOneName();
  };

  var makeRealmButton = function(s, type) {
    var thisRoom = document.getElementsByName("vqxro")[0].value;
    var realmFound = false;
    hasRealmButton = true;

    if (s.indexOf(thisRoom) === -1) {
      s.push(thisRoom); // The control room *should* be on the list, regardless
    }

    var butString = "Realm";
    var key, realm;
    for (key in realmList) {
      if (realmList.hasOwnProperty(key)) {
        realm = realmList[key];
        if (realm.controlRoom === undefined) {
          continue;
        }
        if (realm.controlRoom === thisRoom) {
          realm.lastVisited = new Date().toLocaleDateString();
          realm.roomList = s;
          saveRealmList();
          realmFound = true;
          break;
        }
      }
    }

    if (realmFound) {
      butString = "**REALM**";
    }

    var rBut = myDom.createATag("#", butString);
    rBut.title = "Realm of type: " + type;
	rBut.id = "chatplus-realm";
    rBut.setAttribute("data-realm-type", type);
	
    var fButton = soiDetails.formFind.elements.namedItem("vqvak");
    myDom.insertAfter(rBut, fButton);

    addEvent(rBut, "click", function(event) {
      if (realmFound) {
        userWindow.alert("This is the control room of realm " + key + "," + " and updates itself.");
        return;
      }

      var editDetails = {
        mode: "prompt",
        mode2: "add2",
        controlRoom: thisRoom,
        roomList: s,
        event: event
      };

      setTimeout(function() {
        controlPanel.realmEdit2(editDetails);
      }, 1);
    });
    return rBut;
  };

  var detectRealmList3 = function() {
    // This covers the case for when they re-name the realm controls.
    // We'll do it cruder and brute-force.
    function makeFrom(arr) {
      var i, l;
      var roomList = [];
      var s;

      l = arr.length;
      for (i = 0; i < l; i++) {
        s = arr[i].value;
        if (!s) {
          continue;
        }
        if (s.indexOf("@") > 0) {
          roomList.push(s);
        }
      }
      makeRealmButton(roomList, "3");
    }

    var opts = document.getElementsByTagName("option");
    var opt;
    var i, l = opts.length;
    var parent;
    for (i = 0; i < l; i++) {
      opt = opts[i];
      if (opt.value.indexOf("@") > 0) {
        parent = opt.parentNode;

        // Skip the spirit list.
        if (parent.name.toLowerCase() === "vqvdy") {
          continue;
        }

        // Folks love to put weird characters in the MultiLoc select box.
        // I should enforce that more.
        if (parent.id === "roomselect") {
          continue;
        }

        opts = parent.getElementsByTagName("option");
        //alert([parent.name, parent.id, opt.value]);
        makeFrom(opts);
        break;
      }
    }
  };

  var detectRealmList2 = function() {
    // Find one kind of realm --
    // Where they create an addressArray that is filled with the rooms
    // to go to.  Pilfer the array.
    if (!userWindow.addressArray) {
      return;
    }

    var i, l;
    var roomList = [];
    var arr = userWindow.addressArray;
    var s;

    l = arr.length;
    for (i = 0; i < l; i++) {
      s = arr[i];
      if (!s) {
        continue;
      }
      if (s.indexOf("!!!") === 0) {
        roomList.push(s.replace("!!!", ""));
      }
    }

    if (roomList.length !== 0) {
      makeRealmButton(roomList, "2");
    }
  };

  var detectRealmList = function() {
    // Find one kind of realm -- where the room names are kept in a
    // select list named "room".   Uses a
    // <form action =http://soi.hyperchat.com/cgi-bin/soi.cgi method=GET>
    // to change rooms.
    var selectArray = document.getElementsByTagName("select");
    var sel;
    var i, l;
    var roomList = [];
    var foundFlag = false;
    var option;
    var tail;
    var v;

    l = selectArray.length;
    for (i = 0; i < l; i++) {
      sel = selectArray[i];
      if (sel.name === "room") {
        foundFlag = true;
        break;
      }
    }

    if (!foundFlag) {
      return;
    }

    //Derek Bryan's script (see detectRealmList1)
    // uses the same name for the select box,
    // but is nice enough to give the form a name.
    if (sel.parentNode && sel.parentNode.name) {
      if (sel.parentNode.name.toLowerCase() === "myform") {
        foundFlag = false;
      }
    }

    if (foundFlag) {
      l = sel.options.length;
      for (i = 0; i < l; i++) {
        option = sel.options[i];
        v = option.value;
        tail = getTail(v);
        v = v.split("@")[0] + "@" + tail;
        roomList.push(v);
      }
      makeRealmButton(roomList, "1");
    }
  };

  //if (soiDetails.formMsg && soiDetails.formMsg.elements.namedItem(ee)) {}
  function processRefreshRooms() {
    var rBut;
    var resetTimerBut;
    var resetTimerDiv;

    var roomWatchDiv;
    var status;

    var lastTimeStamp;
    var askKey;
    var makeStartButton;
    var makeStopButton;
    var allStampData = {};
    var roomStampData = {};

    function findPosts(firstOnly) {
      var hrs = document.getElementsByTagName("hr");
      var hr, next;
      var i, l = hrs.length;
      var str;
      var re = /^[A-Za-z]{3}\s[A-Za-z]{3}\s\d\d\s\d\d:\d\d:\d\d$/;
      var m;
      var posts = [];

      for (i = 0; i < l; i++) {
        hr = hrs[i];
        next = myDom.nextNode(hr);
        while (next && next.tagName && next.tagName.toLowerCase() !== "i") {
          next = myDom.nextNode(next);
        }
        str = myDom.getText(next);
        m = !!str.match(re);
        if (m) {
          posts.push(next);
          if (firstOnly) {
            break;
          }
        }
        //alert([next, str, m]);
      }
      return posts;
    }

    function saveValues() {
      gmSetValue(askKey, allStampData);
    }


    function findLastTimeDateStamp() {
      var p = findPosts(true);
      if (!p.length) {
        return "Never";
      } else {
        return myDom.getText(p[0]);
      }
    }

    function makeButtonChoice() {
      if (roomStampData.alertMode) {
        makeStopButton();
      } else {
        makeStartButton();
      }
    }

    function setMode(mode) {
      status.innerHTML = "";
      rBut.parentNode.removeChild(rBut);
      roomStampData.alertMode = mode;
      makeButtonChoice();
      saveValues();
    }

    function saveLastTimeStamp() {
      roomStampData.lastStampOnRecord = findLastTimeDateStamp();
      allStampData[soiDetails.fullRoomName] = roomStampData;
      saveValues();
    }

    makeStartButton = function() {
      setRefreshStatus();
      rBut = myDom.createATag("#", "Current mode: Room watcher turned off.");
      rBut.title = "Click to turn feature on";
      addEvent(rBut, 'click', function() {
        saveLastTimeStamp();
        setMode(!roomStampData.alertMode);
      });
      roomWatchDiv.appendChild(rBut);
    };

    makeStopButton = function() {
      setRefreshStatus("");
      rBut = myDom.createATag("#", "Current Mode: Room watcher turned on.");
      rBut.title = "Click to turn feature off";
      addEvent(rBut, 'click', function() {
        setMode(!roomStampData.alertMode);
      });
      roomWatchDiv.appendChild(rBut);
    };

    function setRefreshStatus() {
      if (roomStampData.alertMode) {
        status.innerHTML = "Looking for posts newer than " + roomStampData.lastStampOnRecord;
      } else {
        status.innerHTML = "";
      }
    }

    // Wrap the span in a roomWatchDiv tag to fix an IE rendering issue.
    roomWatchDiv = document.createElement("div");
    status = document.createElement("div");
    roomWatchDiv.appendChild(status);

    soiDetails.formMsg.parentNode.appendChild(roomWatchDiv);
    askKey = "cp_refresh_alert2"; // Invalidate the old alerts by changing name.
    allStampData = gmGetValue(askKey, {});
    roomStampData = allStampData[soiDetails.fullRoomName];

    if (!roomStampData) {
      roomStampData = {
        lastStampOnRecord: "never",
        alertMode: false
      };
    }

    if (soiDetails.formMsg && getRefreshMeta()) {
      makeButtonChoice();

      if (roomStampData.alertMode) {
        setRefreshStatus();
        lastTimeStamp = findLastTimeDateStamp();
        if (lastTimeStamp !== roomStampData.lastStampOnRecord) {
          document.title = "@@@" + document.title;

          resetTimerDiv = document.createElement("div");
          resetTimerBut = myDom.createATag("#", "Clear alert and wait for next message");
          rBut.title = "Clear the alert and wait for the next message";

          addEvent(resetTimerBut, 'click', function() {
            resetTimerDiv.parentNode.removeChild(resetTimerDiv);
            saveLastTimeStamp();
            setMode(!roomStampData.alertMode);
            setMode(!roomStampData.alertMode);
            document.title = document.title.replace(/^@@@/, "");
            setRefreshStatus();
          });
          resetTimerDiv.appendChild(resetTimerBut);
          roomWatchDiv.appendChild(resetTimerDiv);

        }
      }
    } else {
      saveLastTimeStamp();
    }
  }

    function convertToCode() {
      var txt = soiDetails.formMsg.elements.namedItem("vqxsp").value;

      var n, o;
      var re;
      var i;
      var table = ["&", "&amp;", "<", "&lt;", ">", "&gt;", "\r\n", "\r", "\r", "<br>", "\n", "<br>", "\ ", " "];

      txt = txt.split("").join("!==dummy==!");

      for (i = 0; i < table.length; i += 2) {
        o = table[i];
        n = table[i + 1];
        re = new RegExp(o, "gi");
        txt = txt.replace(re, n);
        //alert([re, txt]);
      }

      txt = txt.replace(/!==dummy==!/g, "<b></b>");

      txt = "<pre>" + txt + "</pre>";

      if (txt.length > 11000) {
        window.alert("Converted length too long.");
      } else {
        soiDetails.formMsg.elements.namedItem("vqxsp")
          .value = txt;
      }
    }
  
  
  function upgradeResetButton() {
    if (soiDetails.resetButton) {
      var newReset = myDom.createATag("#", "Reset");
      newReset.id = "chatplus-reset";

      myDom.insertAfter(newReset, soiDetails.resetButton);
      soiDetails.resetButton.style.display = "none";
      soiDetails.resetButton.disabled = "true";

      addEvent(newReset, 'click', function() {
        return function(e) {
          var answer = userWindow.confirm("Are you you sure you want to reset?");

          if (answer) {
            soiDetails.formMsg.reset();
          }

        };
      }());
    }

    var oldUndo = getLinkByText("[Undo]");
    if (oldUndo) {
      oldUndo.style.display = "none";
    }

    if (soiDetails.formMsg && oldUndo && newReset) {
      var newUndo = myDom.createATag("#", "Undo");
      newUndo.id = "chatplus-undo";

      myDom.insertAfter(document.createTextNode(" "), newReset);
      myDom.insertAfter(newUndo, newReset);
      myDom.insertAfter(document.createTextNode(" "), newReset);

      addEvent(newUndo, 'click', function() {
        return function(e) {
          var answer = userWindow.confirm("Are you you sure you want to undo the last post?");

          if (answer) {
            userWindow.location.href = oldUndo.href;
          }

        };
      }());
    }
  }

  function enableExtendedOptions() {
    function hideSpecialBox() {
      specialBox.style.display = "none";
      var p = myDom.getElementPosition(specialButton);
      specialBox.style.left = p[0] + "px";
      var top = p[1];
      //top += (specialButton.clientHeight + specialBox.clientHeight) *2;
      specialBox.style.top = top + "px";
    }

    function showSpecialBox() {
      specialBox.style.display = "";
    }

    function makeOption(txt, f) {
      var el = myDom.createATag("#", txt);
      el.className += " fullButton";
      addEvent(el, 'click', function() {
        f();
        hideSpecialBox();
      });
      return el;
    }
	
	
    function insertMacroButtons() {
      function insertButton(m) {
        if (!m || !m.name || m.name === "") {
          return;
        }

        var f = (function(_key, _name, _value) {
          return function(event) {
            var el = document.getElementsByName("vqxsp")[0];
            el.value += _value;
          };
        }(m.key, m.name, m.value));

        specialBox.appendChild(makeOption(m.key + " : " + m.name, f));

        var s = "Ctrl+Shift+" + m.key;
        shortcut.add(s, f);
      }


      var macro_list = realmList[":macros:"];
      var m_details;
      var i, l = $$_MACRO_KEY_LIST.length;
      var key;
      var idx;

      for (i = 0; i < l; i++) {
        idx = l - i - 1;
        key = $$_MACRO_KEY_LIST[idx];
        m_details = macro_list[key];
        insertButton(m_details);
      }
    }

    if (soiDetails.resetButton) {
      specialButton = myDom.createATag("#", "Special ...");
      specialButton.className += " chatPlus_popupok";
      specialButton.id = "chatplus-special";

      soiDetails.resetButton.parentNode.insertBefore(specialButton, soiDetails.resetButton);
      soiDetails.resetButton.parentNode.insertBefore(document.createTextNode(" "), soiDetails.resetButton);

      // This is the box that will hold our specialButton buttons
      specialBox = myDom.createTag("div");
      specialBox.className = "popup2";
      specialBox.style.position = 'absolute';

      specialBox.appendChild(makeOption("Close", hideSpecialBox));
      document.getElementsByTagName("body")[0].appendChild(specialBox);

      specialBox.appendChild(makeOption("Convert to postable code", convertToCode));
      insertMacroButtons();
      hideSpecialBox();

      addEvent(specialButton, 'click', function() {
        return function(e) {
          showSpecialBox();
        };
      }());
    }
  }


  function addNewAutoButton() {
    function handleAutoOn() {
      setTimeout(function() {
        userWindow.location.href = url;
      }, 1000 * 45);

      var el;
      el = document.getElementsByName("vqxsp");
      if (el) {
        el[0].style.display = "none";
      }

      soiDetails.resetButton.scrollIntoView(true);
    }

    function setMode() {
      gmSetValue(keyName, !mode);
      userWindow.location.href = url;
    }

    var url = getRoomUrlLink();
    var keyName = "cp_auto_room_" + soiDetails.fullRoomName;
    var mode = gmGetValue(keyName, false)
    var txt;
    var button;
    var autoLink = getLinkByText("Auto");

    if (!autoLink) {
      return;
    }

    if (mode) {
      txt = "stop auto2";
      handleAutoOn()
    } else {
      txt = "auto2";
    }

    button = myDom.createATag("#", txt);
    button.id = "chatplus-auto2";
    addEvent(button, 'click', setMode);

    autoLink.parentNode.insertBefore(button, autoLink);
  }

  if (doRun !== false) {
    init();
    addNewAutoButton();
    processRefreshRooms();
    upgradeResetButton();

    enableExtendedOptions();
    if (soiDetails.formMail) {
      makeExtendedMailRoom();
    }

    finishBuddyPopup(document.body, undefined);

    //alert(nameList.toSource());
    // The order matters here.
    if (!hasRealmButton) {
      detectRealmList2();
    } // From the array, !!! style
    if (!hasRealmButton) {
      detectRealmList3();
    }
    if (!hasRealmButton) {
      detectRealmList();
    }
  }
  
  window.qunit.chat.citizenTest = citizenTest;
  window.qunit.chat.makeReplyButton = makeReplyButton;
  window.qunit.chat.init = init;
  window.qunit.chat.parseNames = parseNames;
  window.qunit.chat.parseOneNameInner = parseOneNameInner;
  window.qunit.chat.makeRealmButton = makeRealmButton;
  window.qunit.chat.upgradeResetButton = upgradeResetButton;
  window.qunit.chat.addNewAutoButton = addNewAutoButton;
  window.qunit.chat.convertToCode = convertToCode;
};