
upgrades.mailroom = (function() {

  var makeExtendedMailRoom = function() {
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

      window.soiDetails.formMail.elements.namedItem("vqxha")
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
          n = normalizeToSoiShortNick(a[0]);
          if (a[1]) {
            n += "@" + normalizeToSoiShortNick(a[1]);
          } else {
            n += "@" + window.soiDetails.blankTail;
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

        action = fixFormAction(window.soiDetails.formMail);

        var o = {
          method: "POST",
          url: action,
          data: fullData.join("&"),
          onreadystatechange: sendNextMessage,
          onerror: sendError
        };

        //alert(o.toJSON());
        //setBulkMailStatus(action);
        GM_xmlhttpRequest(o); //jshint ignore: line
      }

      ccList = ccElem.value.split(",");
      bccList = bccElem.value.split(",");
      inError = false;

      /* Handle blank lines */
      if (ccList[0].trim() === "") {
        ccList = [];
      }
      if (bccList[0].trim() === "") {
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

      data = serializeFormUrlencoded(window.soiDetails.formMail);
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
    myDom.insertAfter(statusBar, window.soiDetails.formMail.elements.namedItem("vqxsp"));
    setBulkMailStatus("");


    rBut = myDom.createATag("#", "Turn on mass mailer");
    rBut.id = "chatplus-mass-mail";

    span.appendChild(rBut);
    myDom.insertAfter(span, target);
    rBut.title = "Click here to enable the mass mailer functions";
    addEvent(rBut, 'click', function() {
      setBulkMailStatusWait("Checking identify");

      var nickInfo = {
        nick: window.soiDetails.formMail.elements.namedItem("vqxha").value.split("@")[0],
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
      var data = serializeFormUrlencoded(window.soiDetails.formMail);
      data.vqxha = urlencode(nick);

      makeIframe();
    }

    function checkForMsgSend() {
      var hash = userWindow.location && userWindow.location.hash;
      var n;
      hash = fakeHash || hash;
      if (hash.indexOf("#msg_") === 0) {
        n = hash.split("_")[1];
        window.soiDetails.formMail.elements.namedItem("vqxto")
          .value = n;
      }
    }
    checkForMsgSend();

  }; //makeExtendedMailRoom


  function handleReplyClick(_from, _to, domain) {
    return function(/*event*/) {
      var i;
      var select, options;
      var val;
      var domainGood = false;

      if (domain) {
        select = window.soiDetails.formMail.elements.namedItem("vqvck");
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

      window.soiDetails.formMail.elements.namedItem("vqxha").value = _from;
      window.soiDetails.formMail.elements.namedItem("vqxto").value = _to;
      userWindow.location.hash = "chatmark";
      window.soiDetails.formMail.elements.namedItem("vqxsp").focus();
    };
  }


  var makeReplyButton = function(result, actionLink) {
    var domain;
    var e = result.from.element;
    var elem = result.from.element;
    var toText = result.to.fullSoiStyleName;
    var fromText = result.from.fullSoiStyleName;


    var msgSpan;
    var i;

    if (!document.getElementById("nameSetupPrompt")) {
      msgSpan = myDom.createTag("div", myDom.createTag("strong", "To make reply work, goto " + "[ChatPlus Controls] [Master Controls]"));
      msgSpan.id = "nameSetupPrompt";
      myDom.insertAfter(msgSpan, window.soiDetails.formMail.elements.namedItem("vqxsp"));
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
      } else {}
    }


    // The nickname wasn't found -- maybe it is email
    if (!isKnownNick) {
      e = elem;
      for (i = 0; i < 9; i++) {
        if (e.textContent === "**EMAIL**") {
          domain = fromText.split("@")[1];
          buttonText = "Email again";
          myFrom = fromText.split("@")[0];
          myTo = toText;
          isKnownNick = true;
          break;
        }
        e = e.previousSibling;
        if (!e) {
          break;
        }
      }
    }

    function fixDomainName(n) {
      n = n.replace(/\(/g, "");
      n = n.replace(/\)/g, "");
      n = n.replace(/:/g, "");
      n = n.replace(/\ /g, "");
      return n;
    }


	/*
    if (!isKnownNick && result.sep === 'EMAILEDx') {
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
      domain = fixDomainName(domain);
    }
    */

    if (!isKnownNick) {
      return;
    }

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

    myDom.insertAfter(rBut, actionLink);
  };

  return {
    makeReplyButton: makeReplyButton,
    makeExtendedMailRoom: makeExtendedMailRoom
  };
}());