var nickTemplate = "<span title='{hint}' class='chatPlus_nick' data-nick='{soiFormat}'>{html}</span>";

var upgrades = upgrades || {};

upgrades.hotlist = (function() {
  "use strict";

  //   tblData.roomName    ==> The room name, including tail
  //   tblData.roomURL     ==> Current URL to room -- do not cache
  //   tblData.spiritCount ==> The count of Spirits
  //   tblData.roomOpen    ==> Who the room is open to, if known
  //   tlbData.roomHost    ==> Host of the room, if known.
  //   tblData.roomDesc    ==> Short description of the room
  //   tblData.folk        ==> Who is in the room, HTML nodes
  //   tblData.hideButtonHtml
  var nickTemplate = "<span title='{soiFormat} [Click for details]' class='chatPlus_nick' data-nick='{soiFormat}'><b>{html}</b></span>";

  var roomTemplate = "";
  roomTemplate += "<table class='hotTable'>";
  roomTemplate += "  <tr>";
  roomTemplate += "    <td class='left'>";
  roomTemplate += "      <a href='{roomURL}'>{roomName}</a><br>{spiritCount}";
  roomTemplate += "      <br>";
  roomTemplate += "      <br>{hideButton}";
  roomTemplate += "      <input type='button' value='Add' class='cpbutton' data-hotlist-action='add-realm' data-room='{roomName}'>";
  roomTemplate += "      <input type='button' value='Remove' class='cpbutton' data-hotlist-action='remove-realm' data-room='{roomName}'>";
  roomTemplate += "    </td>";
  roomTemplate += "    <td class='right'>";
  roomTemplate += "      <b>{roomDesc}</b>";
  roomTemplate += "      <br>";
  roomTemplate += "      <i>{roomOpen}</i> - <i>{roomHost}</i>";
  roomTemplate += "      <br>";
  roomTemplate += "      <blockquote>{roomLongDesc}</blockquote>";
  roomTemplate += "      {folkHtml}";
  roomTemplate += "    </td>";
  roomTemplate += "  </tr>";
  roomTemplate += "</table>";

  function handleRealmAddRemove(event) {
    var action = event.target.getAttribute("data-hotlist-action");
    if (!action) {
      return;
    }

    var table = event.target;
    while (table.nodeName.toLowerCase() !== "table") {
      table = table.parentNode;
    }

    var saveData = {
      realmName: table.getAttribute("data-realm-name"),
      roomName: action
    };

    if (action === "add-realm") {
      controlPanel.addRoomToRealm(event, saveData);
    } else {
      controlPanel.removeRoomfromRealm(event, saveData);
    }
  }

  document.body.removeEventListener('click', handleRealmAddRemove, false);
  document.body.addEventListener('click', handleRealmAddRemove, false);

  var placeHotPanel = function(paneldiv) {
    var logo;
    logo = document.getElementById("hotDiv");
    if (logo) {
      logo.innerHTML = "";
    } else {
      logo = document.createElement("div");
    }

    logo.appendChild(paneldiv);
    logo.id = "hotDiv";

    var loc = document.getElementsByTagName('table')[0]; // Location to put it in

    if (loc) {
      loc.parentNode.insertBefore(logo, loc);
    }
  };

  var createTableRowHtml = function(realmName, tblData) {
    function nicksToHtml() {
      var folkNameStart = "";
      var folkNameEnd = "";
      var folkSeparator = "";
      var folk;
      if (folkMode !== "line") {
        folkNameStart = "";
        folkNameEnd = "";
        folkSeparator = ", ";
      } else {
        folkNameStart = "<li>";
        folkNameEnd = "</li>";
        folkSeparator = "";
        tableHtml = tableHtml.replace("{folkHtml}", "<ul>{folkHtml}</ul>");
      }

      var folkList = tblData.folk;
      var tmpArray = [];
      for (var j = 0; j < folkList.length; j++) {
        folk = folkList[j].cloneNode(true);

        var temp = document.createElement("div");
        temp.appendChild(folk);
        var info = createUserInfo(temp);

        var html = stringFormat(nickTemplate, {
          soiFormat: info.fullSoiStyleName,
          html: info.html
        });

        tmpArray.push(folkNameStart + html + folkNameEnd);
      }

      return tmpArray.join(folkSeparator);
    }

    var tableHtml = roomTemplate;
    var folkMode = realmList[":masterSettings:"].hotListView;
    tblData.folkHtml = nicksToHtml();

    tableHtml = stringFormat(tableHtml, tblData);

    var container = document.createElement("div");
    container.innerHTML = tableHtml;
    return container.querySelector("tr");
  };

  var createNewHotList = function(tblList, realmName, realm) {
    var tblData;
    var i, l;
    var displayMode;
    var master = realmList[":masterSettings:"];
    var excludeReason;
    var exDiv, emptyDiv;
    var tag;
    var eTable;
    var eTbody;
    var eTr;
    var labelDiv, emptyLabelDiv;
    var countHidden = 0;
    var countEmpty = 0;
    var s;
    var metaData = [];
    var _roomName;
    var unusedRooms = [].concat(realm.roomInclude, realm.roomList);
    var j;
    var exLinks = [];

    exDiv = document.createElement("div");
    exDiv.id = "exDiv_" + realmName;
    emptyDiv = document.createElement("div");
    emptyDiv.id = "emptyDiv_" + realmName;

    eTable = document.createElement("table");
    eTable.className = "hotTable";
    eTable.setAttribute("data-realm-name", realmName);

    eTbody = document.createElement("tbody");
    eTable.appendChild(eTbody);

    l = tblList.length;
    for (i = 0; i < l; i++) {
      tblData = tblList[i];

      metaData[0] = getTail(tblData.roomName);
      _roomName = tblData.roomName;

      j = unusedRooms.indexOf(_roomName);
      while (j !== -1) {
        delete unusedRooms[j];
        j = unusedRooms.indexOf(_roomName);
      }

      displayMode = realm.defaultMode;

      excludeReason = [];
      excludeReason.push('Room hidden because: ');

      if (realm.excludeRealmRooms === "yes") {
        if (allRooms.indexOf(_roomName) !== -1) {
          displayMode = "exclude";
          excludeReason.push('Part of a realm');
        }
      }

      if (displayMode === "exclude") {
        excludeReason.push('realm default');
      }

      if (realm.roomList.indexOf(_roomName) !== -1) {
        displayMode = "include";
      }
      if (realm.tailInclude.indexOf(metaData[0]) !== -1) {
        displayMode = "include";
      }
      if (realm.tailExclude.indexOf(metaData[0]) !== -1) {
        displayMode = "exclude";
        excludeReason.push('room tail');
      }
      if (realm.roomInclude.indexOf(_roomName) !== -1) {
        displayMode = "include";
      }
      if (realm.roomExclude.indexOf(_roomName) !== -1) {
        displayMode = "exclude";
        excludeReason.push('room exclude');
      }
      if (master.alwaysExclude.indexOf(_roomName) !== -1) {
        displayMode = "exclude";
        excludeReason.push('master exclude');
      }

      if (displayMode === "include") {
        eTr = createTableRowHtml(realmName, tblData);
        eTbody.appendChild(eTr);
      } else {
        exLinks.push({
          url: tblData.roomURL,
          name: tblData.roomName
        });
        countHidden++;
      }
    }

    exDiv.style.display = "none";
    labelDiv = myDom.createTag("div", myDom.createATag("#", "Show Hidden Rooms (" + countHidden + " hidden)"));
    labelDiv.querySelector("input").setAttribute("data-action", "show-hidden");

    addEvent(labelDiv, 'click', (function(l1, _data) {
      return function( /*event*/ ) {
        var div = document.getElementById("exDiv_" + l1);
        var tag;
        var i, l = _data.length;
        div.style.display = "block";

        for (i = 0; i < l; i++) {
          tag = myDom.createATag(_data[i].url, _data[i].name);
          tag.title = excludeReason.join(" ");
          div.appendChild(tag);
          div.appendChild(document.createTextNode(", "));
        }

        this.style.display = "none";
      };
    }(realmName, exLinks)));

    l = unusedRooms.length;
    for (i = 0; i < l; i++) {
      s = unusedRooms[i];
      if (s) {
        countEmpty++;
      }
    }

    emptyDiv.style.display = "none";
    emptyLabelDiv = myDom.createTag("div", myDom.createATag("#", "Show Empty Rooms (" + countEmpty + " empty)"));
    emptyLabelDiv.querySelector("input").setAttribute("data-action", "show-empty");

    addEvent(emptyLabelDiv, 'click', (function(l1, _data) {
      return function( /*event*/ ) {
        var i, l = _data.length;
        var div = document.getElementById("emptyDiv_" + l1);
        div.style.display = "block";
        for (i = 0; i < l; i++) {
          s = _data[i];
          if (s) {
            tag = myDom.createLinkToRoom(s);
            div.appendChild(tag);
            div.appendChild(document.createTextNode(", "));
          }
        }

        this.style.display = "none";
      };
    }(realmName, unusedRooms)));

    eTr = myDom.createTag("tr");

    tag = myDom.createTag("div");
    tag.appendChild(document.createTextNode("Hidden rooms"));
    tag.appendChild(document.createElement("br"));
    tag.appendChild(document.createTextNode("Empty rooms"));

    tag = myDom.createTag("td", tag);
    tag.className = "left";

    eTr.appendChild(tag);
    eTbody.appendChild(eTr);

    tag = myDom.createTag("td");
    tag.className = "right";
    tag.appendChild(exDiv);
    tag.appendChild(labelDiv);

    tag.appendChild(emptyDiv);
    tag.appendChild(emptyLabelDiv);

    eTr.appendChild(tag);

    return eTable;
  };

  var updateSeenTable = function(tblList) {
    var key;
    var realm;
    var realmCheckMark;
    var realmTableDiv;
    var table;
    var realmHeader;
    var controlRoomElement;

    var holder = document.createElement("div");
    holder.id = 'hotListHolder';

    document.getElementById("tblHome").innerHTML = "";

    // Loop through the Realms
    for (var iii = 0; iii < realmList[":list:"].length; iii++) {
      key = realmList[":list:"][iii];
      realm = realmList[key];
      realmCheckMark = document.getElementById("id_HotListCheckBox2_" + key);

      if (realmCheckMark.checked) {
        table = createNewHotList(tblList, key, realm);
        //realmTableDiv = document.createElement('div');
        realmHeader = document.createElement('h3');
        realmHeader.appendChild(document.createTextNode(realm.fullName));

        if (realm.controlRoom !== "") {
          realmHeader.appendChild(document.createTextNode(" . "));
          controlRoomElement = myDom.createLinkToRoom(realm.controlRoom, "(*)");
          controlRoomElement.title = "Control Room last visited: " + realm.lastVisited;
          realmHeader.appendChild(myDom.createTag("small", controlRoomElement));
        }

        holder.appendChild(realmHeader);
        holder.appendChild(table);
      }
    }
    document.getElementById("tblHome").appendChild(holder);
  };

  var createRealmForm = function() {
    var newDiv;
    var loc = document.getElementsByTagName('table')[0]; // Location to put it in
    var newForm = document.createElement("form");
    newForm.id = "realmForm";
    newForm.name = "realmForm";

    newDiv = myDom.createTag("div", newForm);
    newDiv.id = "realmDiv";
    newDiv.appendChild(document.createTextNode("Click on a checkbox to turn on or off a Realm display"));

    loc.parentNode.insertBefore(newDiv, loc);

    newDiv = document.createElement("div", "tblHome");
    newDiv.id = "tblHome";
    loc.parentNode.insertBefore(newDiv, loc);
  };

  var updateHotList = function() {
    createRealmForm();
    makeRealmChecks(realmList);
    var tblList = parseHotList();
    updateSeenTable(tblList);
    updateBuddyPanel();
  };


  var parseHotList = function() {

    var tblList = [];

    // Read through the HOT list and turn it into an object filled witih
    // all sorts of data goodness.
    //   tblData.roomName  ==> The room name, including tail
    //   tblData.roomURL   ==> Current URL to room -- do not cache
    //   tblData.roomOpen  ==> Who the room is open to, if known
    //   tlbData.roomHost  ==> Host of the room, if known.
    //   tblData.roomDesc  ==> Short description of the room
    //   tblData.folk      ==> Who is in the room, HTML nodes
    //   tblData.hideShowButton ==> The SOI Hide/Show button
    var thisTable;
    var allTables;
    var tmp;
    var thisFolk;
    var thisTr; // Which table row are we using?
    var thisTd; // Which table detail are we using?

    var buddylist = realmList[":masterSettings:"]["buddyList"];
    var name, buddy;
    var defaultTail;

    // Targeted the 'openTo' element.. that seems fairly unique.
    var openTo = document.querySelectorAll("table td b + br + i ");
    allTables = [];
    forEachNode(openTo, function(el) {
      var table = el;
      while (table.nodeName.toLowerCase() !== "table") {
        table = table.parentNode;
      }
      allTables.push(table);
    });

    for (var i = 0; i < allTables.length; i++) {
      tmp = undefined;
      thisTd = undefined;

      thisTable = allTables[i];

      thisTable.style.display = "none";

      thisTr = thisTable.getElementsByTagName("tr")[0]; // One row per table.

      if (thisTr && thisTr.getElementsByTagName("td")[2]) {
        // This is one of the new "header" tables that clutter up things.
        continue;
      }

      var tblData = {
        folk: [],
        hideButton: "",
        roomDesc: null,
        roomHost: "",
        roomLongDesc: "",
        roomName: "",
        roomOpen: ""
      };

      if (thisTr) {
        thisTd = thisTr.getElementsByTagName("td")[0];
      } // The first column
      if (thisTd) {
        tmp = thisTd.getElementsByTagName("a")[0];
      } // The first link (to the room)

      if (!tmp) {
        return;
      }
      var dataTd = thisTable.querySelectorAll("td")[1];
      var bolds = dataTd.querySelectorAll("b");
      var link = thisTable.querySelector("td a");
      var longDescEl = dataTd.querySelector("blockquote");

      var roomOpenEl = dataTd.querySelector("i");
      var hostEl = dataTd.querySelector("i + i");

      if (hostEl) {
        tblData.roomHost = hostEl.textContent.replace(", ", "").trim();
        tblData.roomOpen = roomOpenEl.textContent;
        //console.log(roomOpenEl.textContent, roomOpenEl.textContent.replace(", ", ""));
      } else {
        tblData.roomOpen = roomOpenEl.textContent;
        tblData.roomHost = "";
      }

      forEachNode(bolds, function(el, i) {
        if (i === 0) {
          tblData.roomDesc = el.textContent;
        } else {
          var d = document.createDocumentFragment();
          d.appendChild(el.cloneNode(el));
          tblData.folk.push(d);
        }
      });

      var hideButtonEl = thisTable.querySelector("input[type=submit]");
      if (hideButtonEl) {
        tmp = document.createElement("div");
        tmp.appendChild(hideButtonEl.cloneNode(true));
        tblData.hideButton = tmp.innerHTML + "<br>";
      }

      tblData.roomLongDesc = longDescEl ? longDescEl.textContent : "";
      tblData.roomName = link.textContent;
      if (tblData.roomName.indexOf("@") === -1) {
        tblData.roomName += "@" + soiDetails.blankTail;
      }
      tblData.roomURL = link.href;
      if (tblData.folk.length === 1) {
        tblData.spiritCount = tblData.folk.length + " spirit";
      } else {
        tblData.spiritCount = tblData.folk.length + " spirits";
      }




      defaultTail = tblData.roomName.split("@")[1];

      onlineBuddies = onlineBuddies || {};

      for (var j = 1; j < bolds.length; j++) {
        thisFolk = bolds[j];
        name = extractNameInfo(thisFolk, defaultTail).fullSoiStyleName;

        if (buddylist.indexOf(name) !== -1) {

          buddy = onlineBuddies[name];
          if (!buddy) {
            buddy = {};
            buddy.room = [];
          }
          buddy.name = name;
          buddy.room.push(tblData.roomName);
          //buddy.node = myDom.copyInnerNodes(thisFolk);
          onlineBuddies[name] = buddy;
        }
      }

      tblList.push(tblData);
    }

    return tblList;
  };

  var makeRealmChecks = function(rList) {

    var realm;
    var box;
    var loc = document.getElementById('realmForm');
    var name;
    var list = rList[":list:"];
    var t;
    var key;

    function makeCheckBox(label, value, name) {
      var lab, box, checkbox, id = "id_" + name;

      lab = document.createElement("label");
      lab.htmlFor = id;

      box = document.createElement('span');
      box.style.whiteSpace = "nowrap";
      box.appendChild(document.createTextNode(label + ":"));

      checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = name;
      checkbox.id = id;
      checkbox.defaultModeChecked = false;
      checkbox.value = value;

      box.appendChild(checkbox);

      lab.appendChild(box);
      lab.appendChild(document.createTextNode(" \u00a0 "));
      lab.title = 'Toggle ' + realm.fullName;
      return lab;
    }

    var getString = function(elem) {
      var n = elem.id.replace("id_", "");
      n = "isHot_" + n;
      return n;
    };

    function handleClick(e) {
      e = e || window.event;
      var target = e.target || e.srcElement;
      // jjz
      var n = getString(target);
      updateSeenTable(rList);
      gmSetValue(n, "" + target.checked);
    }

    createRealmForm();

    for (var iii = 0; iii < list.length; iii++) {
      key = list[iii];
      realm = rList[key];
      name = "HotListCheckBox2_" + key;
      box = makeCheckBox(key, key, name);
      loc.appendChild(box);

      t = box.getElementsByTagName("input")[0];

      addEvent(t, "click", handleClick);

      var n = getString(t);
      var v = gmGetValue(n, true);
      if (v === "false") {
        v = false;
      }
      if (!!v) {
        t.checked = true;
      }
    }
  };

  var upgrade = function() {
    soiDetails = identifySoi();

    if (!onlineBuddies) {
      onlineBuddies = {};
    }

    var newMode = gmGetValue("isNewHot2", true);
    var link;

    if (!newMode) {
      link = myDom.createATag("#", "Customize Me");
      link.id = "newHot";

      link = makeCommandPanel(link);
      placeHotPanel(link);
      addEvent(document.getElementById("newHot"), "click", function(event) {
        document.getElementById("hotDiv").innerHTML = "";
        updateHotList();
        gmSetValue("isNewHot2", true);
        if (event.preventDefault) {
          event.preventDefault();
        }
        return true;
      });
    } else {
      link = myDom.createATag("#", "Use Old Hot");
      link.id = "newHot";
      link = makeCommandPanel(link);
      placeHotPanel(link);

      updateHotList();
      addEvent(link, "click", function( /*event*/ ) {
        link = makeCommandPanel(link);
        placeHotPanel(link);
        gmSetValue("isNewHot2", false);
        window.location.reload();
      });
    }
  };

  var internals = {
    parseHotList: parseHotList,
    createRealmForm: createRealmForm,
    makeRealmChecks: makeRealmChecks,
    updateSeenTable: updateSeenTable,
  };

  return {
    internals: internals,
    upgrade: upgrade
  };
}());