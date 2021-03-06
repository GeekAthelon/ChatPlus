window.qunit = window.qunit || {};
window.qunit.chat = {};
window.qunit.chat.namesList = [];

var upgrades = upgrades || {};

function createUserInfo(nickNameElement, blankTail) {
    "use strict";

    window.soiDetails = identifySoi();

    function cleanupName(name) {
        // Because of how funky the HTML can come back, its just easier to do cleanup work here
        // Remove any final ':'
        name = name.replace(/:$/, '');
        name = name.trim();
        name = name.trim();
        return name;
    }

    // OK, sometimes the weird closing system that SOI uses ends up closing
    // too much and we end up with elements that are siblings and not children.
    // textContent and innerHTML are known to die and gag when that happens,
    // so we wrap the element in a span to make everything there children.

    var container = document.createElement("span");
    container.appendChild(nickNameElement.cloneNode(true));
    var decoratedName = cleanupName(container.textContent);

    var tail;
    var nameNoTail;
    var soiStyleName;

    // See if there is anything that might be a tail, if so,
    // grab the last one.
    var bits = decoratedName.split('@');

    if (bits) {
        tail = bits.pop(); // Get the last one.
        if (allKnownTails.indexOf(tail) === -1) {
            tail = null;
        }
    }

    if (tail) {
        var p = new RegExp(tail + "$", "");
        nameNoTail = decoratedName.replace(p, "");
    } else {
        nameNoTail = decoratedName;
        tail = blankTail || window.soiDetails.blankTail;
    }

    soiStyleName = normalizeToSoiShortNick(nameNoTail);

    var user = {
        html: nickNameElement.innerHTML,
        text: cleanupName(nickNameElement.textContent),
        soiStyleName: normalizeToSoiShortNick(nameNoTail),
        fullSoiStyleName: soiStyleName + "@" + tail
    };

    user.element = nickNameElement;

    return user;
}

function handleNicknameClick(e) {
    "use strict";

    var buddylist = realmList[":masterSettings:"].buddyList;

    var nick;
    var el = e.target;
    var outerDiv;

    function addMenuItem(el, text, cb) {
        var button = document.createElement("button");
        button.type = "button";
        button.appendChild(document.createTextNode(text));
        button.className = "cpbutton";
        el.appendChild(button);

        addEvent(button, "click", cb);

        return button;
    }

    function createHomePageLink(nick) {
        var n = nick.split("@");
        var url = makePlayerHomePageUrl(n[0], n[1]);
        var link = document.createElement("a");
        link.href = url;
        link.appendChild(document.createTextNode("Homepage"));
        return link;
    }

    function sendUserMessage(nick) {
        sendMailToUser(nick);
    }

    function getNickInRooms(nick) {
        var inRoomList = [];
        var nickInRooms = document.querySelectorAll("[data-nick='" + nick + "']");
        forEachNode(nickInRooms, function(nickEl) {
            var tr = nickEl;
            while (tr && tr.nodeName.toLowerCase() !== 'tr') {
                tr = tr.parentNode;
            }

            if (tr) {
                var roomName = tr.getAttribute("data-for-room");
                if (roomName && inRoomList.indexOf(roomName) === -1) {
                    inRoomList.push(roomName);
                }
            }
        });
        return inRoomList;
    }

    while (el && el.className !== 'chatPlus_nick') {
        if (el.className === "cp-popup-visible") {
            return;
        }

        if (el.className && el.className.indexOf("chatPlus_popupok") !== -1) {
            return;
        }

        el = el.parentNode;
    }

    if (el) {
        outerDiv = popupMenu.createFor(el);
        var menu = outerDiv.querySelector("div");
        menu.className += " cp-popup-nickname-menu";
        nick = el.getAttribute("data-nick");

        var n = document.createElement("div");
        n.className = "cp-underline-bar";
        n.appendChild(document.createTextNode(nick));
        menu.appendChild(n);

        addMenuItem(menu, "Send a MSG", function() {
            sendUserMessage(nick);
        });

        if (buddylist.indexOf(nick) === -1) {
            var addButton = addMenuItem(menu, "Add to Buddy List", function() {
                buddyList.add(nick);
            });
            addButton.id = 'cp-buddy-add';
        } else {
            var removeButton = addMenuItem(menu, "Remove from Buddy List", function() {
                buddyList.remove(nick);
            });
            removeButton.id = 'cp-buddy-remove';
        }

        var homePageLink = createHomePageLink(nick);
        homePageLink.className = "cp-popup-link";

        menu.appendChild(homePageLink);
        menu.appendChild(document.createElement("br"));

        var inRoomList = getNickInRooms(nick);

        inRoomList.forEach(function(room) {
            var link = myDom.createLinkToRoom(room);
            link.className = "cp-popup-link";
            menu.appendChild(link);
            menu.appendChild(document.createElement("br"));
        });


        popupMenu.show(outerDiv);
        e.stopPropagation();
    } else {
        popupMenu.destroy();
    }
}

upgrades.chatroom_auto = (function() {
    function processRefreshRooms(markers) {
        window.soiDetails = identifySoi(); //jshint ignore:line

        var rBut;
        var announcementButton;
        var resetTimerBut;
        var resetTimerDiv;

        var roomWatchDiv;
        var status;

        var lastTimeStamp;
        var askKey;
        var makeStartButton;
        var makeStopButton;
        var makeAnnouncementButton;
        var allStampData = {};
        var roomStampData = {};

        function findPosts(firstOnly) {
            var hrs = document.getElementsByTagName("hr");
            var re = /^[A-Za-z]{3}\s[A-Za-z]{3}\s\d\d\s\d\d:\d\d:\d\d$/;
            var posts = [];

            forEachNode(markers.actionLinks, function(actionLink) {
                var post = actionLink.previousElementSibling;
                posts.push(post);
            });

            return posts;
        }

        function saveValues() {
            gmSetValue(askKey, allStampData);
        }

        function findLastTimeDateStamp() {
            var p = findPosts();
            if (!p.length) {
                return "Never";
            } else {
                return p[0].textContent;
            }
        }

        function makeButtonChoice() {
            if (roomStampData.alertMode) {
                makeStopButton();
            } else {
                makeStartButton();
            }
            makeAnnouncementButton();
        }

        function setMode(mode) {
            status.innerHTML = "";
            if (announcementButton) {
                announcementButton.parentNode.removeChild(announcementButton);
            }
            rBut.parentNode.removeChild(rBut);
            roomStampData.alertMode = mode;
            makeButtonChoice();
            saveValues();
        }

        function saveLastTimeStamp() {
            roomStampData.lastStampOnRecord = findLastTimeDateStamp();
            allStampData[window.soiDetails.fullRoomName] = roomStampData;
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

        makeAnnouncementButton = function() {
            if (!('speechSynthesis' in window)) {
                return;
            }

            announcementButton = myDom.createATag("#", "Change Announcement");

            addEvent(announcementButton, 'click', function() {
                var details = realmList[":roomAnnouncements:"][window.soiDetails.fullRoomName];
                modalWindow.promptTextToSpeach("What shall I say?  (Leave blank to stay quiet.)", details, function(answer) {
                    realmList[":roomAnnouncements:"][window.soiDetails.fullRoomName] = answer;
                    saveRealmList();
                });
            });
            roomWatchDiv.appendChild(announcementButton);
        };

        function setRefreshStatus() {
            if (roomStampData.alertMode) {
                status.innerHTML = "Looking for posts newer than " + roomStampData.lastStampOnRecord;
            } else {
                status.innerHTML = "";
            }
        }

        if (window.soiDetails.formMsg && !window.soiDetails.formMsg.querySelector("textarea")) {

            // Wrap the span in a roomWatchDiv tag to fix an IE rendering issue.
            roomWatchDiv = document.createElement("div");
            status = document.createElement("div");
            roomWatchDiv.appendChild(status);

            window.soiDetails.formMsg.parentNode.appendChild(roomWatchDiv);
            askKey = "cp_refresh_alert2"; // Invalidate the old alerts by changing name.
            allStampData = gmGetValue(askKey, {});
            roomStampData = allStampData[window.soiDetails.fullRoomName];

            if (!roomStampData) {
                roomStampData = {
                    lastStampOnRecord: "never",
                    alertMode: false
                };
            }

            makeButtonChoice();

            if (roomStampData.alertMode) {
                setRefreshStatus();
                lastTimeStamp = findLastTimeDateStamp();
                if (lastTimeStamp !== roomStampData.lastStampOnRecord) {
                    document.title = "@@@" + document.title;

                    resetTimerDiv = document.createElement("div");
                    resetTimerBut = myDom.createATag("#", "Clear alert and wait for next message");
                    rBut.title = "Clear the alert and wait for the next message";

                    var voiceDetails = realmList[":roomAnnouncements:"][window.soiDetails.fullRoomName];
                    if (voiceDetails && voiceDetails.text) {
                        var lastVoiceDetails = gmGetValue("roomAnnouncements-" + window.soiDetails.fullRoomName, "")
                        if (lastVoiceDetails !== roomStampData.lastStampOnRecord) {

                            textToSpeach(voiceDetails);
                            gmSetValue("roomAnnouncements-" + window.soiDetails.fullRoomName, roomStampData.lastStampOnRecord);
                        }
                    }

                    addEvent(resetTimerBut, 'click', function() {
                        roomStampData.playedVoice = false;
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
            roomStampData.playedVoice = false;
            saveLastTimeStamp();
        }
    }

    return {
        upgrade: processRefreshRooms
    };

}());

upgrades.chatroom = (function() {
    "use strict";

    window.qunit.chat = {};

    var special = (function() {
        function convertToCode() {
            var sourceElement = window.soiDetails.formMsg.elements.namedItem("vqxsp");
            var txt = sourceElement.value;

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
                sourceElement.value = txt;
            }

            doPreview();
        }

        function removeLineFeeds() {
            var sourceElement = window.soiDetails.formMsg.elements.namedItem("vqxsp");
            var txt = sourceElement.value;

            txt = txt.
            replace(/\r/g, " ").
            replace(/\n/g, " ");

            sourceElement.value = txt;
            doPreview();
        }

        window.qunit.chat.convertToCode = convertToCode;
        window.qunit.chat.removeLineFeeds = removeLineFeeds;
        return {
            convertToPostableCode: convertToCode,
            removeLineFeeds: removeLineFeeds
        };

    }());



    function getPostMarkers() {
        // Locate the '~' or '*' links by posts
        var actionLinks = document.querySelectorAll("hr + i + a, hr + center table i + a");
        var dialogTags;
        var allowedDistance = 4;
        //var dialogTags = document.querySelectorAll("hr + i + a ~ b, hr + center table i + a ~ b");

        // Unforunately, we can't use a selector to dig out the dialog tags.  Sometimes
        // there are other elements on the screen that would *appear* to be a dialog
        // tag.
        // Other times SOI gives out really really messed up HTML which mis-renders
        // horribly in the browser.

        // We can pass back an array instead of a NodeList and ChatPlus is OK with that.
        // forEachNode will happily iterate over arrays since all we really need is
        // that all important length property.

        // The approach: Loop through the actionLinks and then see if there is a
        // <b> element with allowedDistance elements.  We can't make this a fixed
        // number because the Flaire code (one of my other toys) may add elements.
        dialogTags = [];

        forEachNode(actionLinks, function(link) {
            var dialogTag = null;
            var chaserElement = link;
            for (var i = 0; i < allowedDistance; i++) {
                if (chaserElement.tagName.toLowerCase() === "b") {
                    dialogTag = chaserElement;
                    break;
                }
                chaserElement = chaserElement.nextElementSibling;
            }

            dialogTags.push(dialogTag);
        });

        if (actionLinks.length !== dialogTags.length) {
            throw new Error("Mismatch between actionLinks and dialogTags");
        }

        var ret = {
            actionLinks: actionLinks,
            dialogTags: dialogTags,
        };

        return ret;
    }

    function splitDialogTag(tag) {

        var dialogSeparators = ["said to", "said", "whispered to", "EMAILEDx"];

        if (tag.tagName.toLowerCase() !== "b") {
            throw new Error("Dialog tags are always in a <b> element");
        }

        var fromEl;
        var toEl;
        var sep;

        var dest = document.createElement("span");

        // Rewrote this code to loop through childNodes rather
        // than using nextSibling.  IE and its pain-in-the-ass
        // empty text nodes was killing nextSibling.
        var l = tag.childNodes.length;
        for (var i = 0; i < l; i++) {
            var f = tag.childNodes[i];

            var nodeCopy = f.cloneNode(true);
            var txt = f.textContent;

            if ((dialogSeparators.indexOf(txt) !== -1) && f.tagName.toLowerCase() === "i") {
                sep = txt;
                fromEl = dest;
                dest = document.createElement("span");
            } else {
                dest.appendChild(nodeCopy);
            }
        }
        toEl = dest;

        var r;

        // Some folks simply have a nickname where the HTML is too far messed up
        // for our poor parser to handle it so give up and gag.
        try {
            r = {
                from: createUserInfo(fromEl),
                to: createUserInfo(toEl),
                sep: sep
            };
        } catch (err) {
            cpConsole.log("splitDialogTag Error: Can't make heads or tails of '" +
                tag.textContent + "'  The HTML was too confusing.");
            r = {
                canUpgradeName: false
            };
        }

        return r;
    }

    function createRealmButton() {
        var hasRealmButton = false;

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

            var fButton = window.soiDetails.formFind.elements.namedItem("vqvak");
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

    function upgradeUndoButton() {
        var buttons = [{
            text: "Yes",
            value: "y"
        }, {
            text: "No",
            value: "n"
        }];


        var undo = getLinkByText("[Undo]");
        if (!undo) {
            return;
        }
        undo.style.display = "none";

        var newUndo = myDom.createATag("#", "Undo");
        newUndo.id = "chatplus-undo";

        myDom.insertAfter(newUndo, undo);
        myDom.insertAfter(document.createTextNode(" "), undo);

        addEvent(newUndo, 'click', function() {
            window.setTimeout(function() {
                modalWindow.confirm("Are you you sure you want to undo the last post?", buttons, function(answer) {
                    if (answer === "y") {
                        userWindow.location.href = undo.href;
                    }
                });
            }, 1);
        });
    }

    function createAuto2Button() {
        function handleAutoOn() {
            setTimeout(function() {
                userWindow.location.href = url;
            }, 1000 * 45);

            var el;
            el = document.getElementsByName("vqxsp");
            if (el) {
                el[0].style.display = "none";
            }

            window.soiDetails.lastLink.scrollIntoView(true);
        }

        function setMode() {
            gmSetValue(keyName, !mode);
            userWindow.location.href = url;
        }

        var url = getRoomUrlLink();
        var keyName = "cp_auto_room_" + window.soiDetails.fullRoomName;
        var mode = gmGetValue(keyName, false);
        var txt;
        var button;
        var autoLink = getLinkByText("Auto");

        if (!autoLink) {
            return;
        }

        if (mode) {
            txt = "stop auto2";
            handleAutoOn();
        } else {
            txt = "auto2";
        }

        button = myDom.createATag("#", txt);
        button.id = "chatplus-auto2";

        addEvent(button, 'click', setMode);

        autoLink.parentNode.insertBefore(button, autoLink);
    }

    function createSpecialButton() {
        var specialButton;

        function makeOption(txt, f) {
            var el = myDom.createATag("#", txt);
            el.className += " fullButton";

            addEvent(el, 'click', function() {
                f();
                popupMenu.destroy();
            });
            return el;
        }

        function insertMacroButtons(menu) {
            function insertButton(m) {
                if (!m || !m.name || m.name === "") {
                    return;
                }

                var f = (function(_key, _name, _value) {
                    return function( /*event*/ ) {
                        var el = document.getElementsByName("vqxsp")[0];
                        el.value += _value;
                    };
                }(m.key, m.name, m.value));

                menu.appendChild(makeOption(m.key + " : " + m.name, f));

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

        if (window.soiDetails.lastLink) {
            specialButton = myDom.createATag("#", "Special ...");
            specialButton.className += " chatPlus_popupok";
            specialButton.id = "chatplus-special";

            window.soiDetails.lastLink.parentNode.insertBefore(specialButton, window.soiDetails.lastLink);
            window.soiDetails.lastLink.parentNode.insertBefore(document.createTextNode(" "), window.soiDetails.lastLink);

            addEvent(specialButton, 'click', function() {
                var outerDiv = popupMenu.createFor(specialButton);
                var menu = outerDiv.querySelector("div");
                menu.appendChild(makeOption("Convert to postable code", special.convertToPostableCode));
                menu.appendChild(makeOption("Remove Line Feeds (for posting HTML)", special.removeLineFeeds));

                insertMacroButtons(menu);
                popupMenu.show(outerDiv);
            });
        }
    }

    function upgradeDialogTags(markers) {
        var dialogTags = markers.dialogTags;

        var template = "<span title='{fromHint}' class='chatPlus_nick' data-nick='{fromSoiFormat}'>{fromHtml}</span> <i>{sep}</i> " +
            "<span title='{toHint}' class='chatPlus_nick' data-nick='{toSoiFormat}'>{toHtml}</span>";

        window.qunit.chat.namesList = [];

        forEachNode(dialogTags, function(tag, i) {
            var result = splitDialogTag(this);

            if (result.canUpgradeName === false) {
                return;
            }

            window.qunit.chat.namesList.push(result.from.text);
            window.qunit.chat.namesList.push(result.to.text);

            var det = {
                fromSoiFormat: result.from.fullSoiStyleName,
                fromHtml: result.from.html,
                fromHint: result.from.text + " [Click for Options]",
                sep: result.sep,
                toSoiFormat: result.to.fullSoiStyleName,
                toHtml: result.to.html,
                toHint: result.to.text + " [Click for Options]"
            };

            var html = stringFormat(template, det);

            var b = document.createElement("b");
            b.innerHTML = html;

            this.parentNode.insertBefore(b, this.nextSibling);
            // Delete the original
            this.parentNode.removeChild(this);

            if (window.soiDetails.formMail) {
                upgrades.mailroom.makeReplyButton(result, markers.actionLinks[i]);
            }

        });
    }

    var mangleList1 = ["onclick", "<div>", "<marquee>", "<hr>"];
    var mangleList = []

    function getMangledList() {

        if (mangleList.length) {
            return mangleList;
        }

        mangleList1.forEach(function(item) {
            mangleList.push(item);
            if (item.charAt(0) === "<") {
                var lastChar = item.slice(-1);
                if (lastChar !== ">") {
                    throw new Error("mangleList has item that starts with < but doesn't end with >");
                }
                var item = item.slice(0, -1);
                mangleList.push(item);
            }
        });

        mangleList.sort(function(a, b) {
            return b.length - a.length;
        });

        return mangleList;
    }


    function soiIftyString(s) {
        function replaceAll(str, find, replace) {
            return str.replace(new RegExp(find, "g"), replace);
        }

        var r = s.
        replace(/\r\n\r\n/g, "<p>").
        replace(/\r\r/g, "<p>").
        replace(/\n\n/g, "<p>").
        replace(/\r\n/g, "<br>").
        replace(/\r/g, "<br>").
        replace(/\n/g, "<br>");

        var mangleList = getMangledList();
        var l = mangleList.length;
        for (var i = 0; i < l; i++) {
            r = replaceAll(r, mangleList[i], "*");
        }

        console.log(JSON.stringify(s), JSON.stringify(r));
        return r;
    }

    function doPreview() {
        var sourceElement = window.soiDetails.formMsg.elements.namedItem("vqxsp");
        var previewDiv = document.getElementById("cp-preview-div");
        if (previewDiv === null) {
            return;
        }
        previewDiv.innerHTML = soiIftyString(sourceElement.value);
    }

    function addPreviewToDocument(sourceElement, previewHolder) {
        var previewDiv = document.createElement("div");
        previewDiv.id = "cp-preview-div";
        previewHolder.appendChild(previewDiv);

        var sourceElement = window.soiDetails.formMsg.elements.namedItem("vqxsp");

        var width = getComputedStyle(sourceElement).width;
        previewDiv.style.width = width ;

        addEvent(sourceElement, 'keyup', function(_el, _key, _event) {
            doPreview();
        });
    }

    function removePreviewFromDocument(sourceElement, previewHolder) {
        var previewDiv = document.getElementById("cp-preview-div");
        if (previewDiv) {
            previewDiv.parentNode.removeChild(previewDiv);
        }
    }

    function addUpdatePreviewButton(shouldShowPreview, sourceElement, previewHolder) {

        var buttonId = "chatplus-previewToggle";

        var oldButton = document.getElementById(buttonId);
        if (oldButton) {
            oldButton.parentNode.removeChild(oldButton);
        }

        var toggleButtonText = shouldShowPreview ? "Turn preview mode off" : "Turn preview mode on";

        var button = myDom.createATag("#", toggleButtonText);
        button.id = buttonId;
        button.dataset.cpPreviewMode = shouldShowPreview;
        sourceElement.parentNode.appendChild(button);

        if (shouldShowPreview) {
            addPreviewToDocument(sourceElement, previewHolder);
            doPreview();
        }

        addEvent(button, 'click', function(_el, _key, _event) {
            shouldShowPreview = !shouldShowPreview;
            gmSetValue("showPreview", shouldShowPreview);

            removePreviewFromDocument(sourceElement, previewHolder);
            addUpdatePreviewButton(shouldShowPreview, sourceElement, previewHolder);
        });
    }

    function setupPreview() {

        var sourceElement = window.soiDetails.formMsg.elements.namedItem("vqxsp");
        var container = window.soiDetails.formMsg;
        var containerDest;

        if (!sourceElement) {
            return;
        }

        // Try to find the container for chat rooms.
        while (container && container.tagName && container.tagName.toLowerCase() !== "td") {
            container = container.parentNode;
        }

        // If we didn't find the element we are after, assume we are in a mailroom instead
        if (container.tagName) {
            containerDest = sourceElement;
        } else {
            container = window.soiDetails.formMsg;
            while (container && container.tagName && container.tagName.toLowerCase() !== "center") {
                containerDest = container;
                container = container.parentNode;
            }
        }

        if (!container.tagName) {
            return;
        }

        var shouldShowPreview = gmGetValue("showPreview", false);

        var previewHolder = document.createElement("div");
        previewHolder.id = "cp-preview-holder";

        container.appendChild(previewHolder);

        addUpdatePreviewButton(shouldShowPreview, containerDest, previewHolder);
    }

    function upgrade() {
        window.soiDetails = identifySoi(); //jshint ignore:line

        var markers = upgrades.chatroom.internal.getPostMarkers();

        upgradeDialogTags(markers);
        createAuto2Button();
        upgradeUndoButton();
        createSpecialButton();
        createRealmButton();
        setupPreview();

        if (!window.soiDetails.isCork) {
            upgrades.chatroom_auto.upgrade(markers);
        }

        if (window.soiDetails.formMail) {
            upgrades.mailroom.makeExtendedMailRoom();
        }
    }

    var internal = {
        getPostMarkers: getPostMarkers,
        splitDialogTag: splitDialogTag,
        createAuto2Button: createAuto2Button,
        createSpecialButton: createSpecialButton,
        soiIftyString: soiIftyString
    };

    return {
        internal: internal,
        upgrade: upgrade
    };

})();
