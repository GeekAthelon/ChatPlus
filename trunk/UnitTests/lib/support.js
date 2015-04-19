function doClick(element) {
  // SAFARI
  // Why you no handle .click()?????
  if (element.click) {
    element.click();
  } else if (document.createEvent) {
    var eventObj = document.createEvent('MouseEvents');
    eventObj.initEvent('click', true, true);
    element.dispatchEvent(eventObj);
  }
}

var fakeGmValues = {};

function gmGetValue(key, val) {
  return fakeGmValues[key] || val;
}

function gmSetValue(key, val) {
  fakeGmValues[key] = val;
}

function GM_addStyle(style) {
  var s = document.createElement('style');
  s.setAttribute('type', 'text/css');
  s.innerHTML = style;
  document.getElementsByTagName("head")[0].appendChild(s);
}


function resetGlobals() {

  fakeGmValues = {
    "isHot_HotListCheckBox2_beware": "true",
    "isHot_HotListCheckBox2_favs": "true",
    "isHot_HotListCheckBox2_all": "true"
  };

  realmList = {
  "break2": {
    "fullName": "Break the HOT list #2 - blank names were appearing here",
    "defaultMode": "exclude",
    "readOnly": true,
    "tailInclude": [],
    "tailExclude": [],
    "roomInclude": ["jchat@soi", "sshh@soi"],
    "roomExclude": [],
    "controlRoom": "",
    "lastVisited": "unknown",
    "roomList": [],
    "excludeRealmRooms": "no"
  },
  "break1": {
    "fullName": "Break the HOT list #1",
    "defaultMode": "exclude",
    "readOnly": true,
    "tailInclude": [],
    "tailExclude": [],
    "roomInclude": ["jchat@soi", "sshh@soi"],
    "roomExclude": [],
    "controlRoom": "",
    "lastVisited": "unknown",
    "roomList": [],
    "excludeRealmRooms": "no"
  },
    "all": {
      "fullName": "Show all rooms",
      "defaultMode": "include",
      "readOnly": true,
      "tailInclude": [],
      "tailExclude": [],
      "roomInclude": [],
      "roomExclude": [],
      "controlRoom": "",
      "lastVisited": "unknown",
      "roomList": [],
      "excludeRealmRooms": "no"
    },
    "favs": {
      "fullName": "My Favorites",
      "defaultMode": "exclude",
      "tailInclude": [],
      "tailExclude": [],
      "roomInclude": [],
      "roomExclude": [],
      "controlRoom": "",
      "lastVisited": "unknown",
      "roomList": [],
      "excludeRealmRooms": "no"
    },
    "beware": {
      "fullName": "Castle Beware",
      "defaultMode": "exclude",
      "tailInclude": [
        "bwr"
      ],
      "tailExclude": [],
      "roomInclude": [
        "tobar@soi"
      ],
      "roomExclude": [],
      "controlRoom": "",
      "lastVisited": "unknown",
      "roomList": [],
      "excludeRealmRooms": "no"
    },
    ":list:": [
      "beware",
	  "break1",
	  "break2",
      "favs",
      "all"
    ],
    ":masterSettings:": {
      "alwaysExclude": [],
      "userNames": [
        "athelon@soi",
        "lordofthedice@soi"
      ],
      "buddyList": ["jjs@soi", "fooba@soi", "sweetbree@soi"],
      "hotListView": "line",
      "showhp": "false",
      "ulinemode": "reset"
    },
    ":avatars:": {},
    ":macros:": {},
	":roomAnnouncements:": {}	
  };
  
  soiDetails = identifySoi();
}

QUnit.assert.validConfig = function(soi, expected) {
  var assert = this;

  var c = {
    blankTail: soi.blankTail,
    formFind: !!soi.formFind,
    formMail: !!soi.formMail,
    fullRoomName: soi.fullRoomName,
    isChatRoom: soi.isChatRoom,
    isCork: soi.isCork,
    isFtpRoom: soi.isFtpRoom,
    isHot: soi.isHot,
    isNickRoom: soi.isNickRoom,
    isSoi: soi.isSoi,
    resetButton: !!soi.resetButton
  };

  assert.strictEqual(expected.blankTail, c.blankTail, "Correct tail: Found");
  assert.strictEqual(expected.formFind, c.formFind, "Page has 'Find' form: " + c.formFind);
  assert.strictEqual(expected.formMail, c.formMail, "Page has 'Mail' form: " + c.formMail);
  assert.strictEqual(expected.fullRoomName, c.fullRoomName, "Correct room name: True");
  assert.strictEqual(expected.isChatRoom, c.isChatRoom, "Is Chat Room: True");
  assert.strictEqual(expected.isCork, c.isCork, "Is Cork: False");
  assert.strictEqual(expected.isFtpRoom, c.isFtpRoom, "Is FTP Files Room: False");
  assert.strictEqual(expected.isHot, c.isHot, "Is Hot List: False");
  assert.strictEqual(expected.isNickRoom, c.isNickRoom, "Is NickName Controls: False");
  assert.strictEqual(expected.isSoi, c.isSoi, "Is an SOI Page: True");
  assert.strictEqual(expected.resetButton, c.resetButton, "Reset Button Found: " + c.resetButton);
};
