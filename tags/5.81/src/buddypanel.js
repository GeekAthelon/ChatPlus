//link = makeMessagePlayerAction(ninfo.soiStyleName, ninfo.tail);

// This is a really crude work around to allow us to "snap" the popup from
// one nickname to another.
var noClosePopup = false;

function sendMailToUser(fullSoiStyleName) {
  "use strict";
  // Hack up the soiDetails.formFind to send us to a modified URL.
  var action = soiDetails.formFind.action;
  var hash = "#msg" + "_" + fullSoiStyleName;
  fakeHash = hash;
  action = action.replace("#newtalk", hash);
  
  soiDetails.formFind.setAttribute("action", action);  
  // The mail room is called 'm'
  soiDetails.formFind.elements.namedItem('vqxfi').value = 'm';
  soiDetails.formFind.submit();
}

function makeMessagePlayerAction(ninfo) {  
  "use strict";
  var tag = myDom.createATag("#", "Send a MSG");  
  addEvent(tag, 'click', (function (event) {  sendMailToUser(ninfo.fullSoiStyleName)}));
  return tag;
}


var finishBuddyPopupCloseEventAdded = false;
function finishBuddyPopup(holder, proxy) {
  "use strict";
  function nameClick(e, target) {    
    var div;
    var div2;
    var tag;
    var buddylist;
    var mode;
    var idx;
    var ninfo;
    var link;
    var name;

    name = "???";
    for (idx = 0; idx < elementIndex.element.length; idx++) {
      if (elementIndex.element[idx] == target) {
        ninfo = nameList[elementIndex.name[idx]];
        name = ninfo.fullSoiStyleName;
        break;
      }
    }

    buddylist = realmList[":masterSettings:"].buddyList;

    div = myDom.displayPopupDiv(e);
    div2 = document.createElement("div");
    //div2.appendChild(document.createTextNode("Buddy Watcher for:"));
    div2.appendChild(myDom.createTag("b", name));
    div2.appendChild(document.createElement("hr"));

    link = makePlayerHomePageUrl(ninfo.soiStyleName, ninfo.tail);
	link.style.width = "100%";
    div2.appendChild(link);
    div2.appendChild(document.createElement("hr"));

    link = makeMessagePlayerAction(ninfo);
	link.style.width = "100%";
    div2.appendChild(link);
    div2.appendChild(document.createElement("hr"));
	
    if (proxy) {
      proxy(name, div2);
      div2.appendChild(document.createElement("hr"));
    }

    if (buddylist.indexOf(name) === -1) {
      tag = myDom.createATag("#", "Add to buddy list");
      mode = "add";
    } else {
      tag = myDom.createATag("#", "Remove from buddy list");
      mode = "remove";
    }
    tag.setAttribute("data-cp-popup-buddy-mode", mode);

    div2.appendChild(tag);

    addEvent(tag, 'click', (function (_name, _mode) {
      return function (event) {
        var i;
        if (_mode === "add") {
          buddylist.push(_name);
        } else {
          i = buddylist.indexOf(_name);
          buddylist.splice(i, 1);
        }
        saveRealmList();
        updateBuddyPanel();
        myDom.hidePopupDiv();
      };
    }(name, mode)));

	
	if (!finishBuddyPopupCloseEventAdded) {
      addEvent(holder, "click", closeNickPopup);
	  finishBuddyPopupCloseEventAdded = true;
	}
	
    div.appendChild(div2);	
  }

  function showNickPopup(e) {
    e = e || userWindow.event;
    var target = e.target || e.srcElement;
    var cn;

    while (target) {
      cn = "NANA";

      if (target && target.className) {
        cn = target.className;
      }

      if (cn.indexOf("chatPlus_nick") !== -1) {
        nameClick(e, target);
        e.cancelBubble = true;
        if (e.stopPropagation) {
		  //e.stopPropagation();
		}
		noClosePopup = true; //Hold open for one event
        break;
      }

      target = target.parentNode;
    }
  }

  function closeNickPopup(e) {
    if (!noClosePopup) {
      removeEvent(holder, "click", closeNickPopup);
      myDom.hidePopupDiv();
	}
	noClosePopup = false;
  }

  addEvent(holder, "click", showNickPopup);
}

function updateBuddyPanel() {
  "use strict";
  if (!soiDetails.isHot) {
    return;
  }

  var d = document.getElementById("buddypanel");
  var buddylist = realmList[":masterSettings:"]["buddyList"];
  var defaultTail = document.getElementsByName("roomsite")[0].value;

  var i, j, buddy, online;
  var onLine;
  var offLine;
  var e;
  var eTr;
  var eTd;
  var eTable;
  var eTbody;
  var div;
  var labelDiv;
  var hasOnline = false;

  if (!d) {
    d = document.createElement("div");
  }
  //document.body.insertBefore(d, document.body.firstChild);
  myDom.insertAfter(d, document.getElementById("realmDiv"));
  myDom.emptyNode(d);

  onLine = document.createDocumentFragment(); // document.createElement("div");
  offLine = document.createDocumentFragment(); //document.createElement("div");
  d.id = 'buddypanel';

  d.appendChild(myDom.createTag("h3", "Buddy List"));
  d.appendChild(document.createTextNode("Click on a name anywhere on the screen to add or remove names from the buddy list."));

  for (i = 0; i < buddylist.length; i++) {
    buddy = buddylist[i];
    online = onlineBuddies[buddy];
    e = document.createElement("span");
    e.className = "chatPlus_nick";

    var n = buddy.split("@");
    e.appendChild(document.createTextNode(n[0]));
    e.appendChild(myDom.createTag("sup", "@" + n[1]));
    e.title = buddy;

    if (online) {
      onLine.appendChild(e);
      onLine.appendChild(document.createTextNode(" "));
      hasOnline = true;
    } else {
      offLine.appendChild(e);
      offLine.appendChild(document.createTextNode(" "));
    }
    extractNameInfo(e, defaultTail);
  }

  eTbody = document.createElement("tbody");

  eTr = document.createElement("tr");
  eTd = document.createElement('td');
  eTd.className = "left";
  eTd.appendChild(document.createTextNode("Online Buddies"));
  eTr.appendChild(eTd);

  eTd = document.createElement('td');
  eTd.className = "right";
  eTd.appendChild(onLine);

  if (!hasOnline) {
    eTd.appendChild(
    myDom.createTag("small", "-none-"));
  }

  eTr.appendChild(eTd);
  eTbody.appendChild(eTr);

  eTr = document.createElement("tr");
  eTd = document.createElement('td');
  eTd.className = "left";
  eTd.appendChild(document.createTextNode("Offline Buddies"));
  eTr.appendChild(eTd);

  eTd = document.createElement('td');
  eTd.className = "right";
  div = document.createElement('div');
  div.style.display = "none";
  div.id = 'offlinebuddydiv';
  div.appendChild(offLine);

  labelDiv = myDom.createTag("div", myDom.createATag("#", "Show offline buddies"));
  labelDiv.id = 'offlinebuddybutton';

  eTd.appendChild(div);
  eTd.appendChild(labelDiv);

  eTr.appendChild(eTd);
  eTbody.appendChild(eTr);

  eTable = document.createElement("table");
  eTable.className = "hotTable";
  eTable.appendChild(eTbody);
  d.appendChild(eTable);

  addEvent(labelDiv, 'click', function () {
    document.getElementById('offlinebuddybutton').style.display = "none";
    document.getElementById('offlinebuddydiv').style.display = "";

  });

  function roomListProxy(name, div) {
    online = onlineBuddies[name];
    if (online) {
      for (j = 0; j < online.room.length; j++) {
        div.appendChild(myDom.createLinkToRoom(online.room[j]));
        div.appendChild(document.createElement("br"));
      }
    }
  }

  finishBuddyPopup(d, roomListProxy);
}