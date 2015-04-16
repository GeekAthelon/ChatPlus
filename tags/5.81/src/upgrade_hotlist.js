window.qunit = window.qunit || {};
window.qunit.hotlist = {};

  var upgrade_hotlist = function (doRun) {
      "use strict";
	  
      var placeHotPanel = function (paneldiv) {
          var logo;
          logo = document.getElementById("hotDiv");
          if (logo) {
            myDom.emptyNode(logo);
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


      var createTableRowHtml = function (realmName, tblData) {
          var folk;
          var folkList;
          var tail;
          var spiritCount;
          var j;
          var tmpArray;
          var tag, tag2;
          var folkTag;
          var folkMode = realmList[":masterSettings:"].hotListView;
          var folkNameIn = "";
          var folkSeparator;

          var s = "";
          var eTr = document.createElement("tr");		  
          var eTd;

          var createAddRemoveRealmButtons = function (realmName, roomName) {
              var tag;
              var e;

              function createAddRemove(mode) {

                tag = myDom.createATag("#", mode === "add" ? "Add" : "Remove");
                addEvent(tag, 'click', (function (l1, l2, _mode) {

                  return function (event) {
                    var saveData = {
                      realmName: l1,
                      roomName: l2
                    };
                    var func;

                    if (mode === "add") {
                      func = function () {
                        controlPanel.addRoomToRealm(event, saveData);
                      }
                    } else {
                      func = function () {
                        controlPanel.removeRoomfromRealm(event, saveData);
                      }
                    }
                    setTimeout(func, 1);
                    return true;
                  };
                }(realmName, roomName, mode)));
                e.appendChild(tag);

              }
              e = myDom.createTag("div");
              createAddRemove("add");
              createAddRemove("remove");
              return e;
            };


          tail = getTail(tblData.roomName);

          spiritCount = "";

          j = tblData.folk.length;

          if (j === 0) {
            spiritCount = "No spirits -- but on the list?";
          } else if (j === 1) {
            spiritCount = "1 spirit";
          } else {
            spiritCount = "" + j + " spirits";
          }

          eTr.className = tail + " " + tblData.roomName;		  

          eTd = document.createElement('td');
          eTd.className = "left";

          eTd.appendChild(myDom.createATag(tblData.roomURL, tblData.roomName));
          eTd.appendChild(document.createElement("br"));
          eTd.appendChild(document.createTextNode(spiritCount));
          tag = createAddRemoveRealmButtons(realmName, tblData.roomName);
          eTd.appendChild(tag);

          if (tblData.hideShowButton.name) {
            tag = document.createElement("input");
            tag.type = "submit";
            tag.value = tblData.hideShowButton.value;
            tag.name = tblData.hideShowButton.name;
            eTd.appendChild(tag);
          }

          eTr.appendChild(eTd);

          eTd = document.createElement('td');
          eTd.className = "right";

          eTd.appendChild(myDom.createTag("b", tblData.roomDesc));
          eTd.appendChild(myDom.createTag("br"));
          eTd.appendChild(myDom.createTag("br"));
          eTd.appendChild(myDom.createTag("i", tblData.roomOpen));
          eTd.appendChild(myDom.createTag("i", tblData.roomHost));
          eTd.appendChild(myDom.createTag("blockquote", tblData.roomLong));

          if (folkMode === "line") {
            folkTag = myDom.createTag("ul");
            folkNameIn = "li";
            folkSeparator = "";
          } else {
            folkTag = myDom.createTag("div");
            folkNameIn = "span";
            folkSeparator = ", ";
          }

          folkList = tblData.folk;
          tmpArray = [];
          for (j = 0; j < folkList.length; j++) {
            folk = folkList[j];

            if (j > 0) {
              folkTag.appendChild(document.createTextNode(folkSeparator));
            }

            s = myDom.getText(folk);

            tag = folk.cloneNode(true);
            tag2 = myDom.createTag("b", tag);
            tag2.title = s;
            tag2.className = "chatPlus_nick";
			
			highlightIfBuddy(tag2, s);
			
            folkTag.appendChild(myDom.createTag(folkNameIn, tag2));
            extractNameInfo(tag2, tail);
          }

          eTd.appendChild(folkTag);

          eTr.appendChild(eTd);
          return eTr;
        };

      var createNewHotList = function (tblList, realmName, realm) {
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
		  
          addEvent(labelDiv, 'click', (function (l1, _data) {
            return function (event) {
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

          addEvent(emptyLabelDiv, 'click', (function (l1, _data) {
            return function (event) {
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

      var updateSeenTable = function (tblList) {
          var key;
          var realm;
          var elem;
          var table;
          var realmHeader;
          var controlRoomElement;

          var holder = document.createElement("div");
          holder.id = 'hotListHolder';

          myDom.emptyNode(document.getElementById("tblHome"));

          // Loop through the Realms
          for (var iii = 0; iii < realmList[":list:"].length; iii++) {
            key = realmList[":list:"][iii];
            realm = realmList[key];
            elem = document.getElementById("id_HotListCheckBox2_" + key);

            if (elem.checked) {
              table = createNewHotList(tblList, key, realm);
              elem = document.createElement('div');
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
          finishBuddyPopup(holder);
        };

      var parseHotList = function () {
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
          var folk;
          var folkList;
          var thisFolk;
          var thisTr; // Which table row are we using?
          var thisTd; // Which table detail are we using?
          var tmpTd;
          var tmp2;

          var buddylist = realmList[":masterSettings:"]["buddyList"];
          var name, buddy;
          var defaultTail;

          allTables = document.getElementsByTagName('table');
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
			
            if (thisTr) {
              thisTd = thisTr.getElementsByTagName("td")[0];
            } // The first column
            if (thisTd) {
              tmp = thisTd.getElementsByTagName("a")[0];
            } // The first link (to the room)
            if (tmp) {
              var tblData = {};
              tblData.hideShowButton = {};

              // Find the SOI show/hide button.
              tmp2 = thisTd.getElementsByTagName("input")[0];
              if (tmp2 && tmp2.value && tmp2.name) {
                if (tmp2.value.toLowerCase() === "show" || tmp2.value.toLowerCase() === "hide") {

                  tblData.hideShowButton.value = tmp2.value;
                  tblData.hideShowButton.name = tmp2.name;
                }
              }

              tblData.roomName = myDom.getText(tmp.firstChild);
              tblData.roomURL = tmp.href;

              if (tblData.roomName.indexOf("@") === -1) {
                tblData.roomName += "@" + soiDetails.blankTail;
              }
              defaultTail = tblData.roomName.split("@")[1];

              folk = [];
              folkList = undefined;

              //tmp =  thisTable.getElementsByTagName("tr")[0]; // One row per table.
              if (thisTr) {
                tmp = thisTr.getElementsByTagName("td")[1];
                tmpTd = tmp;
              } // The first column
              // The people on the HOT list are blocked off in <b></b> blocks.  Makes picking
              // them out fairly easy.  We leave behind the commas and the chaff.
              if (tmp) {
                folkList = tmp.getElementsByTagName("b");
              } // The first link (to the room)
              // Snag the 'open to ....' and 'owned by' links, if available.
              if (tmpTd) {
                tmp = tmpTd.getElementsByTagName("i");

                tblData.roomOpen = myDom.getText(tmp[0]) || "Not open? -- eh?";
                tblData.roomHost = myDom.getText(tmp[1]) || "";

                // In order for tmp[1] to be valid, it must be the right next
                // tmp[0].  Else, it comes from somewhere in the player list.
                if (tblData.roomHost !== "") {
                  if (tmp[1].previousSibling != tmp[0]) {
                    tblData.roomHost = "";
                  }
                }

                // Get the long description of the room.
                tmp = tmpTd.getElementsByTagName("blockquote");
                tblData.roomLong = myDom.getText(tmp[0]) || "";
              }

              if (!onlineBuddies) {
                onlineBuddies = {};
              }

              if (folkList) {
                // The first element is the room description
                tblData.roomDesc = myDom.getText(folkList[0]);

                // So the start at the 2nd element
                for (var j = 1; j < folkList.length; j++) {

                  thisFolk = folkList[j];
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
                  // Add to the table list
                  folk.push(myDom.copyInnerNodes(thisFolk));
                }
                tblData.folk = folk;
                tblList.push(tblData);
              }
            }
          }
		  
		  return tblList;
        };
			  
      var makeRealmChecks = function (rList) {
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

          var getString = function (elem) {
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
            if ( !! v) {
              t.checked = true;
            }
          }
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
		
      var updateHotList = function () {
		  createRealmForm();
          makeRealmChecks(realmList);
          var tblList = parseHotList();
          updateSeenTable(tblList);
          updateBuddyPanel();
        };

      var prepHotRoom = function () {
          var newMode = gmGetValue("isNewHot2", true);
          var link;
		  
          if (!newMode) {
            link = myDom.createATag("#", "Customize Me");
            link.id = "newHot";

            link = makeCommandPanel(link);
            placeHotPanel(link);
            addEvent(document.getElementById("newHot"), "click", function (event) {
              myDom.emptyNode(document.getElementById("hotDiv"));
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
            addEvent(link, "click", function (event) {
              link = makeCommandPanel(link);
              placeHotPanel(link);
              gmSetValue("isNewHot2", false);
              window.location.reload();
            });
          }
        };

		
      window.qunit.hotlist.parseHotList = parseHotList;	  
      window.qunit.hotlist.makeRealmChecks = makeRealmChecks;
      window.qunit.hotlist.updateSeenTable = updateSeenTable;
      window.qunit.hotlist.updateBuddyPanel = updateBuddyPanel;
	  window.qunit.hotlist.prepHotRoom = prepHotRoom;
      window.qunit.hotlist.createRealmForm = createRealmForm;
	  if (doRun !== false) {
        prepHotRoom();
	  }
    };