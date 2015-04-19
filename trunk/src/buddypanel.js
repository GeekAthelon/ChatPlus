/* exported buddyList */

var buddyList = (function() {
  "use strict";

  function add(nick) {
    var buddyList = realmList[":masterSettings:"].buddyList;
    if (isBuddy(nick)) {
      throw new Error(nick + " is already on the buddy list");
    }
    buddyList.push(nick);
    saveRealmList();
  }

  function remove(nick) {
    var buddyList = realmList[":masterSettings:"].buddyList;
    if (!isBuddy(nick)) {
      throw new Error(nick + " is already on the buddy list");
    }

    var i = buddyList.indexOf(nick);
    realmList[":masterSettings:"].buddyList.splice(i, 1);
    saveRealmList();
  }

  function isBuddy(nick) {
    var buddyList = realmList[":masterSettings:"].buddyList;
    var i = buddyList.indexOf(nick);
    return i !== -1;
  }

  return {
    add: add,
    remove: remove,
    isBuddy: isBuddy
  };
}());


function sendMailToUser(fullSoiStyleName) {
  "use strict";
  // Hack up the window.soiDetails.formFind to send us to a modified URL.
  var action = window.soiDetails.formFind.action;
  var hash = "#msg" + "_" + fullSoiStyleName;
  fakeHash = hash;
  action = action.replace("#newtalk", hash);

  window.soiDetails.formFind.setAttribute("action", action);
  // The mail room is called 'm'
  window.soiDetails.formFind.elements.namedItem('vqxfi').value = 'm';
  window.soiDetails.formFind.submit();
}

function makeMessagePlayerAction(ninfo) {
  "use strict";
}

function updateBuddyPanel() {
  "use strict";
  window.soiDetails = identifySoi();

  if (!window.soiDetails.isHot) {
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
  d.innerHTML = "";

  onLine = document.createDocumentFragment(); // document.createElement("div");
  offLine = document.createDocumentFragment(); //document.createElement("div");
  d.id = 'buddypanel';

  d.appendChild(myDom.createTag("h3", "Buddy List"));
  d.appendChild(document.createTextNode("Click on a name anywhere on the screen to add or remove names from the buddy list."));

  for (i = 0; i < buddylist.length; i++) {
    buddy = buddylist[i];
    online = onlineBuddies[buddy];

    var html = stringFormat(nickTemplate, {
      hint: buddy + " [Click for details]",
      soiFormat: buddy,
      html: buddy
    });

    e = document.createElement("span");
    e.innerHTML = html;

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

  addEvent(labelDiv, 'click', function() {
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
}