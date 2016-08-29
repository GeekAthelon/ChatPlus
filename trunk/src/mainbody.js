function addGlobalListeners() {
  document.body.removeEventListener('click', handleNicknameClick, false);
  document.body.addEventListener('click', handleNicknameClick, false);

  document.body.removeEventListener('click', handleRealmAddRemove, false);
  document.body.addEventListener('click', handleRealmAddRemove, false);

  modalWindow.create();
}

function testo() {
  "use strict";
  window.soiDetails = identifySoi();

  realmList = getRealmList();
  fixmyList(realmList);
  fixmyList(newRealm);

  var master = realmList[":masterSettings:"];

  prepToolbar();
  setStyles(master);
  addGlobalListeners();

  if (window.soiDetails.isHot) {
    upgrades.hotlist.upgrade();
  }

  if (window.soiDetails.isNickRoom) {
    upgrades.control_nicknames.upgrade();
  }

  if (window.soiDetails.isFtpRoom) {
    upgrades.control_ftp_files.upgrade();
  }

  if (window.soiDetails.isChatRoom) {
    upgrades.chatroom.upgrade();
  }

  if (window.soiDetails.isCork) {
    upgrades.cork.upgrade();
  }
}


function identifySoi() {
  "use strict";

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


  function makeFormIds(o) {

    var $$_MAILFORM = null;
    var $$_FINDFORM = null;
    var $$_MSGFORM = null;
    var $$_FULLROOMNAME = null;
    var $$_BLANKTAIL = null;

    var e;

    // Ok, this earns bonus points for weirdness ...
    // If I go through a local variable, everything works.
    // If I directly assign the variable, then it breaks down
    // with access denied errors trying to read to the global
    // var.
    var Z_TMP;

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

    var lastLink = null;

    if ($$_MSGFORM) {
      var links =  $$_MSGFORM.querySelectorAll("a");
       lastLink = links[links.length -1];
    }

    o.formMail = $$_MAILFORM;
    o.formFind = $$_FINDFORM;
    o.formMsg = $$_MSGFORM;
    o.fullRoomName = $$_FULLROOMNAME;
    o.blankTail = $$_BLANKTAIL;
    o.lastLink = lastLink;
  }



  // Look for any tell-tale signs that we are on a hyperchat page.
  var vqvakLength = getNumberOfElementsByName(document, "vqvak");
  var vqvajLength = getNumberOfElementsByName(document, "vqvaj");
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


function runAll(document) {
  "use strict";

  window.soiDetails = identifySoi();

  function injectScript(src) {
    var headID = document.getElementsByTagName("head")[0];
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    //newScript.onload=scriptLoaded;
    newScript.src = src;
    headID.appendChild(newScript);
  }

  function doVersionCheck() {
    var ezz;
    var now = new Date().getTime();
    var msecsInADay = 86400000;

    var verCheckTime = gmGetValue("verCheckTime", now);
    if (now >= verCheckTime) {
      gmSetValue("verCheckTime", now + msecsInADay);
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


  if (!window.soiDetails.isSoi) {
    return;
  }

  userWindow = unsafeWindow ? unsafeWindow : window;

  var homeUrl = "http://soiroom.hyperchat.com/chatplus/";
  //homeUrl = "http://127.0.0.1/chatplus/";
  myStats = {
    "sname": "ChatPlus",
    "updateUrl": homeUrl + "update.html",
    "version": "###VERSION### (build ###BUILD###)",
    "ver": +"###VERSION###"
  };

  // Weird IE bug that sometimes causes ChatPlus to run twice.
  // Seems to be related to the MultiLoc code.
  if (document.getElementById("istouched")) {
    window.soiDetails.isSoi = false;
  }

  if (window.soiDetails.isSoi) {
    var ezz;
    doVersionCheck();
    testo();
    userWindow.hchatVersion = myStats.version;
    userWindow.isTouched = true;

    // Set a flag saying we've run once on this page.
    ezz = document.createElement("div");
    ezz.id = "istouched";
    document.body.appendChild(ezz);
  }
}


if (document.querySelector("#qunit-fixture") === null) {
  runAll(document);
}
