function identifySoi() {
  "use strict";
  function makeFormIds(o) {

    var $$_MAILFORM = null;
    var $$_FINDFORM = null;
    var $$_MSGFORM = null;
    var $$_FULLROOMNAME = null;
    var $$_BLANKTAIL = null;
    var $$_RESETBUTTON = null;
    var __$$_ISSOI = null;

    function findResetButton() {
      if ($$_MSGFORM && $$_MSGFORM.elements) {
        var l = $$_MSGFORM.elements.length;
        var i;
        var resetCtl;
        var ctl;
        for (i = 0; i < l; i++) {
          ctl = $$_MSGFORM.elements[i];
          if (ctl && ctl.type && ctl.type.toLowerCase() === "reset") {
            resetCtl = ctl;
            break;
          }
        }
      }
      return resetCtl;
    }

    var forms;
    var form;
    var len;
    var i;
    var e;

    // Ok, this earns bonus points for weirdness ...
    // If I go through a local variable, everything works.
    // If I directly assign the variable, then it breaks down
    // with access denied errors trying to read to the global
    // var.
    var Z_TMP;

    var testE = function(ee, v) {
      if (!form.elements || !form.elements.namedItem) {
        return false;
      }
      var q = form.elements.namedItem(ee);
      if (q && q.value) {
        return (q.value.toLowerCase() === v.toLowerCase());
      }
    };

    $$_FINDFORM = document.querySelector("input[type=submit][value=Find]");
	if ($$_FINDFORM) {
	  $$_FINDFORM = $$_FINDFORM.form;
	}

    function getElByName(n) {
      var unk = document.getElementsByName("xyzzy")[0]; // does not exist
      var e = document.getElementsByName(n)[0];
      if (e !== unk) {
        return e;
      } else {
        return null;
      }
    }

    e = getElByName("vqvck");
    if (e) {
      e.parentNode.id = "mailForm";
      $$_MAILFORM = e.parentNode;
    }

    e = getElByName("vqvaj");
    if (e) {
      Z_TMP = e.parentNode;
    }
    $$_MSGFORM = Z_TMP;

    e = getElByName("vqxro");
    if (e) {
      $$_FULLROOMNAME = e.value;
    }

    e = getElByName("roomsite");
    if (e) {
      $$_BLANKTAIL = e.value;
    }

    $$_RESETBUTTON = findResetButton();

    o.formMail = $$_MAILFORM;
    o.formFind = $$_FINDFORM;
    o.formMsg = $$_MSGFORM;
    o.fullRoomName = $$_FULLROOMNAME;
    o.blankTail = $$_BLANKTAIL;
    o.resetButton = $$_RESETBUTTON;
  }



  // Look for any tell-tale signs that we are on a hyperchat page.
  var vqvakLength = getNumberOfElementsByName(document, "vqvak");
  var vqvajLength = getNumberOfElementsByName(document, "vqvaj");
  var DeleteMarkedMessagesLength = getNumberOfElementsByName(document, "DeleteMarkedMessages");
  var vqxqzLength = getNumberOfElementsByName(document, "vqxqz");
  var vqxcaLength = getNumberOfElementsByName(document, "vqxca");
  var avaurlLength = getNumberOfElementsByName(document, "avaurl");

  var vqxtoLength = getNumberOfElementsByName(document, "vqxto"); // "To:" field

  var isHot = vqvakLength === 3;
  var isChatRoom = (vqvajLength === 1) && (vqvakLength === 1);
  var isFtpRoom = vqxcaLength === 2;
  var isNickRoom = avaurlLength === 1;
  var isCork = vqxqzLength === 1 && vqxtoLength === 0;
  
  if (getLinkByText("[Top of Corkboard]")) {
    isCork = false;
  }

  var _$$_ISSOI = (isHot || isChatRoom);
  _$$_ISSOI = _$$_ISSOI || isFtpRoom;
  _$$_ISSOI = _$$_ISSOI || isNickRoom;
  _$$_ISSOI = _$$_ISSOI || isCork;


  var o = {
    isHot: isHot,
    isChatRoom: isChatRoom,
    isFtpRoom: isFtpRoom,
    isNickRoom: isNickRoom,
    isCork: isCork,
    isSoi: _$$_ISSOI
  };


  if (o.isSoi) {
    makeFormIds(o);
  }

  return o;
}


function runAll(document, isHta, pwindow) {
  soiDetails = identifySoi();
  if (!soiDetails.isSoi) {
    return;
  }
  
  if (isHta) {
    userWindow = window;
    chatPlusLocal = true;
  } else {
    unsafeWindow;
    userWindow = unsafeWindow ? unsafeWindow : window;
    chatPlusLocal = !!userWindow.chatPlusLocal;
  }

  var homeUrl = "http://soiroom.hyperchat.com/chatplus/";
  //homeUrl = "http://127.0.0.1/chatplus/";
  myStats = {
    "sname": "ChatPlus",
    "updateUrl": homeUrl + "update.html",
    "version": "###VERSION### (build ###BUILD###)",
    "ver": +"###VERSION###"
  };


  function injectScript(src) {
    var headID = document.getElementsByTagName("head")[0];
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    //newScript.onload=scriptLoaded;
    newScript.src = src;
    headID.appendChild(newScript);
  }


  getOptionValue = (function() {
    if (document.documentElement) {
      if (document.documentElement.hasAttribute) {
        return function(o) {
          return o.hasAttribute('value') ? o.value : o.text;
        };
      }
      if (document.documentElement.attributes) {
        return function(o) {
          return (o.attributes.value && o.attributes.value.specified) ? o.value : o.text;
        };
      }
    }
  }());


  // Weird IE bug that sometimes causes ChatPlus to run twice.
  // Seems to be related to the MultiLoc code.
  if (document.getElementById("istouched")) {
    soiDetails.isSoi = false;
  }

  function doVersionCheck() {
    var ezz;
    var now = new Date().getTime();
    var msecsInADay = 86400000;

    var verCheckTime = gmGetValue("verCheckTime", now);
    if (now >= verCheckTime) {
      gmSetValue("verCheckTime", now + msecsInADay)
        // Embed the version number
      ezz = document.createElement("div");
      ezz.id = 'cp_version';
      ezz.className = "_" + myStats.ver;
      document.body.appendChild(ezz);

      ezz = document.createElement("div");
      ezz.id = 'cp_updateurl';
      ezz.className = myStats.updateUrl;
      document.body.appendChild(ezz);

      injectScript(homeUrl + "checkversion.js");
    }
  }


  if (soiDetails.isSoi) {
    var ezz;
    doVersionCheck()
    testo();
    userWindow.hchatVersion = myStats.version;
    userWindow.isTouched = true;

    // Set a flag saying we've run once on this page.
    ezz = document.createElement("div");
    ezz.id = "istouched";
    document.body.appendChild(ezz);
  }
}

function testo() {

  nameList = {}; // What names were found in the document.
  elementIndex = {};
  elementIndex.element = [];
  elementIndex.name = [];

  
   realmList = getRealmList();
    var master = realmList[":masterSettings:"];

    prepToolbar();
    setStyles(master);

  if (soiDetails.isHot) {
    addEvent(window, "ready", function(event) {
      fixmyList(realmList);
      fixmyList(newRealm);
    });
  }

  if (soiDetails.isHot) {
    addEvent(window, "ready", function(event) {
      upgrade_hotlist();
    });
  }


  if (soiDetails.isNickRoom) {
    addEvent(window, "ready", function(event) {
      upgradeNickRoom();
    });
  }

  if (soiDetails.isFtpRoom) {
    addEvent(window, "ready", function(event) {
      upgradeFtpRoom();
    });
  }

  if (soiDetails.isChatRoom) {
    addEvent(window, "ready", function(event) {
      upgradeChat();
    });
  }

  if (soiDetails.isCork) {
    addEvent(window, "ready", function(event) {
      upgradeCork();
    });
  }


}

//End of testo
if (typeof GM_setValue === "function") {
  if (document.querySelector("#qunit-fixture") === null) {
    runAll(document, false, window);
  }
}