(function() {
  "use strict";

  QUnit.module("Hot List", {
    beforeEach: function() {
      var fixture = document.getElementById("qunit-fixture");
      var template = document.getElementById("hotlist-template");

      var html = template.innerHTML;
      fixture.innerHTML = html;
      resetGlobals();
    },
    afterEach: function() {
      var popup = document.getElementById("popup");
      if (popup) {
        popup.parentNode.removeChild(popup);
      }
    }
  });

  QUnit.test("HOTLIST - Configuration", function(assert) {
    var id = identifySoi();

    var expected = {
      blankTail: "soi",
      formFind: true,
      formMail: false,
      fullRoomName: "c",
      isChatRoom: false,
      isCork: false,
      isFtpRoom: false,
      isHot: true,
      isNickRoom: false,
      isSoi: true,
      resetButton: false
    };

    assert.validConfig(id, expected);

  });

  QUnit.test("parseHotList", function(assert) {
    var data = upgrades.hotlist.internals.parseHotList();

    var result = [{
      "hideShowButton": {},
      "roomName": "jhnchat@soi",
      "roomURL": "http://ssomf.hyperchat.com/cgi-bin/somf.exe?EParms=ru%7Ckqw29tRmwmpkv%22ru%7Cvk9ik`wDwkm%22ru%7Cle9Rmwmpkv",
      "roomOpen": "Open to all",
      "roomHost": ", \n      owned by captainjohn",	  
	  "roomLong": 'A place for general and generic conversation, mostly based around\n\t  the old TV show \"Love Boat\"',   
      "roomDesc": "General & Generic Chat",
      "folkLen": 5
    }, {
      "hideShowButton": {},
      "roomName": "sshh@soi",
      "roomURL": "http://ssomf.hyperchat.com/cgi-bin/somf.exe?EParms=ru%7Ckqw29tRmwmpkv%22ru%7Cvk9wwllDwkm%22ru%7Cle9Rmwmpkv",
      "roomOpen": "Open to all",
      "roomHost": "",
      "roomLong": "A room of secret whispers. Post only to show that you are in \n        the room. No public conversations.  ",
      "roomDesc": "Shadows and Secrets",
      "folkLen": 5
    }, {
      "hideShowButton": {},
      "roomName": "nighttri@soi",
      "roomURL": "http://ssomf.hyperchat.com/cgi-bin/somf.exe?EParms=ru%7Ckqw29tRmwmpkv%22ru%7Cvk9jmclppvmDwkm%22ru%7Cle9Rmwmpkv",
      "roomOpen": "Citizens only",
      "roomHost": ", owned by \n      Dalesandro Empire",
      "roomLong": "Night Trips ~ Strip club located in the Hood ~ Part of the \n        City RPG  ",
      "roomDesc": "Night Trips ",
      "folkLen": 3
    }, {
      "hideShowButton": {},
      "roomName": "luperci@soi",
      "roomURL": "http://ssomf.hyperchat.com/cgi-bin/somf.exe?EParms=ru%7Ckqw29tRmwmpkv%22ru%7Cvk9hqtavgmDwkm%22ru%7Cle9Rmwmpkv",
      "roomOpen": "Open to \n      all",
      "roomHost": ", owned by Chase Stevens",
      "roomLong": "A multi-loc for Luperci in Neosaka. Posting is with domain \n        permissions only. A domain of |Exo RPG|",
      "roomDesc": "Luperci Headquarters [Neosaka | Exo]",
      "folkLen": 2
    }, {
      "hideShowButton": {},
      "roomName": "batcave@soi",
      "roomURL": "http://ssomf.hyperchat.com/cgi-bin/somf.exe?EParms=ru%7Ckqw29tRmwmpkv%22ru%7Cvk9fepgeraDwkm%22ru%7Cle9Rmwmpkv",
      "roomOpen": "Open to all",
      "roomHost": ", owned by \n      *username",
      "roomLong": "UL REALM - Batcave - Beware of all the traps. Only those \n        allowed may enter.",
      "roomDesc": "Bat Cave",
      "folkLen": 2
    }, {
      "hideShowButton": {},
      "roomName": "apub@soi",
      "roomURL": "http://ssomf.hyperchat.com/cgi-bin/somf.exe?EParms=ru%7Ckqw29tRmwmpkv%22ru%7Cvk9etqfDwkm%22ru%7Cle9Rmwmpkv",
      "roomOpen": "Open to all",
      "roomHost": "",
      "roomLong": "Entrance to the Pub, Tearoom and my Home.A place to relax, \n        and have fun. Please read the rules on the pub home page. This is not a \n        pick up room. ",
      "roomDesc": "Nikki's Country Inn and Home",
      "folkLen": 2
    }, {
      "hideShowButton": {},
      "roomName": "crosspen@soi",
      "roomURL": "http://ssomf.hyperchat.com/cgi-bin/somf.exe?EParms=ru%7Ckqw29tRmwmpkv%22ru%7Cvk9gvkwwtajDwkm%22ru%7Cle9Rmwmpkv",
      "roomOpen": "Citizens only",
      "roomHost": ", owned \n      by gabriel cross",
      "roomLong": "-The penthouse of Gabriel Cross, Part of the Temptation \n        Island Role play.\u0001",
      "roomDesc": "Cross Penthouse",
      "folkLen": 1
    }, {
      "hideShowButton": {},
      "roomName": "dice@soi",
      "roomURL": "http://ssomf.hyperchat.com/cgi-bin/somf.exe?EParms=ru%7Ckqw29tRmwmpkv%22ru%7Cvk9`mgaDwkm%22ru%7Cle9Rmwmpkv",
      "roomOpen": "Citizens only",
      "roomHost": ", owned by \n      Athelon",
      "roomLong": "Multiplayer Yahtzee VERSION 2.0 -- let the computer do the \n        math.  (Room is rated PG. This is the original version of the \n      room.)",
      "roomDesc": "The Dice Room",
      "folkLen": 1
    }, {
      "hideShowButton": {},
      "roomName": "vgame@soi",
      "roomURL": "http://ssomf.hyperchat.com/cgi-bin/somf.exe?EParms=ru%7Ckqw29tRmwmpkv%22ru%7Cvk9rceiaDwkm%22ru%7Cle9Rmwmpkv",
      "roomOpen": "Open to all",
      "roomHost": ", owned \n      by veronica",
      "roomLong": "",
      "roomDesc": "veronica's yahtzee",
      "folkLen": 1
    }, {
      "hideShowButton": {},
      "roomName": "apg@soi",
      "roomURL": "http://ssomf.hyperchat.com/cgi-bin/somf.exe?EParms=ru%7Ckqw29tRmwmpkv%22ru%7Cvk9etcDwkm%22ru%7Cle9Rmwmpkv",
      "roomOpen": "Open to all",
      "roomHost": ", \n      owned by Juliana",
      "roomLong": "Welcome to the Wee Pub...come soak in the hot springs...swim \n        in the lagoon...or warm yourself by the lava pit...where a stranger is \n        welcomed...and the Cheeky Little Barwench remembers your \n      drink.",
      "roomDesc": "A Wee Pub in the Grotto",
      "folkLen": 1
    }, {
      "hideShowButton": {},
      "roomName": "imagein@soi",
      "roomURL": "http://ssomf.hyperchat.com/cgi-bin/somf.exe?EParms=ru%7Ckqw29tRmwmpkv%22ru%7Cvk9miecamjDwkm%22ru%7Cle9Rmwmpkv",
      "roomOpen": "Citizens only",
      "roomHost": ", owned by \n      fadedillusion",
      "roomLong": "IMITATION OF LIFE",
      "roomDesc": "Imagein",
      "folkLen": 1
    }, {
      "hideShowButton": {},
      "roomName": "yahtzee2@soi",
      "roomURL": "http://ssomf.hyperchat.com/cgi-bin/somf.exe?EParms=ru%7Ckqw29tRmwmpkv%22ru%7Cvk9}elp~aa6Dwkm%22ru%7Cle9Rmwmpkv",
      "roomOpen": "Citizens only",
      "roomHost": ", owned by \n      sumer",
      "roomLong": "A non PG version of the game Yahtzee.",
      "roomDesc": "Yahtzee",
      "folkLen": 1
    }];

    data.forEach(function(a, i) {
      a.folkLen = a.folk.length;
      // Make FireFox happy...
      a.roomURL = a.roomURL.replace(/%60/g, "`");
      delete a.folk;
	  assert.deepEqual(data[i], result[i], "Data matches expected result for room " + a.roomName);
    });   
  });
    
  QUnit.test("parseHotList #2 - Verify we have no blank names on the list", function(assert) {
    // There is a bug where if a room appears in two different realms,
    //  the second time the room is listed, the nicknames are empty. 

    upgrades.hotlist.upgrade();

	var lists = document.querySelectorAll("table li b");
		
    forEachNode(lists, function(n, i) {
	  var txt = this.textContent;	  
	  assert.notEqual("", txt, "Non-blank test #" + i + " passed");
	});
  });
  
  QUnit.test("makeRealmChecks", function(assert) {
    var expectedCount = realmList[":list:"].length;

    upgrades.hotlist.upgrade();
    //upgrades.hotlist.internals.makeRealmChecks(realmList);

    var labels = document.querySelectorAll("#realmForm label");
    var cbs = document.querySelectorAll("#realmForm label input");

    assert.strictEqual(labels.length, expectedCount, "Checkmark labels found");
    assert.strictEqual(cbs.length, expectedCount, "Checkmarks found");
  });


  QUnit.test("updateSeenTable", function(assert) {
    upgrades.hotlist.internals.createRealmForm();
    upgrades.hotlist.internals.makeRealmChecks(realmList);

    var data = upgrades.hotlist.internals.parseHotList();
    upgrades.hotlist.internals.updateSeenTable(data);

    var hotListEntries = document.querySelectorAll(".hotTable");

    var expectedCount = realmList[":list:"].length;

    assert.strictEqual(hotListEntries.length, expectedCount, "Correct number of HOT list items created");
  });


  QUnit.test("prepHotRoom == Full Test", function(assert) {
    upgrades.hotlist.upgrade();

    var expectedCount = realmList[":list:"].length;
    var cbs = document.querySelectorAll("#realmForm label input");
    var hotListEntries = document.querySelectorAll(".hotTable");
    var onlineBuddies = document.querySelectorAll("#buddypanel tr")[0].querySelectorAll(".chatPlus_nick");
    var offlineBuddies = document.querySelectorAll("#buddypanel tr")[1].querySelectorAll(".chatPlus_nick");
    var showEmptyButtons = document.querySelectorAll("[data-action='show-empty']");
    var showHiddenButtons = document.querySelectorAll("[data-action='show-hidden']");

    assert.strictEqual(showEmptyButtons.length, expectedCount, "Show Hidden button found");
    assert.strictEqual(showHiddenButtons.length, expectedCount, "Show Empty Buttons found");
    assert.strictEqual(cbs.length, expectedCount, "Checkmarks found");
    assert.strictEqual(hotListEntries.length, expectedCount + 1, "HOT list entries + Buddy View");
    assert.strictEqual(onlineBuddies.length, 1, "Correct number of online buddies");
    assert.strictEqual(offlineBuddies.length, 2, "Correct number of online buddies");
  });

  QUnit.test("prepHotRoom -- Clear Checkmark and Hide Realm", function(assert) {
    var i;
	var cb;
    upgrades.hotlist.upgrade();

    var cbs = document.querySelectorAll("#realmForm label input");
    for (i = 0; i < cbs.length; i++) {
      cb = cbs[i];
      cb.checked = true;
      doClick(cb);
    }

    var hotListEntries = document.querySelectorAll(".hotTable");
    assert.strictEqual(hotListEntries.length, 0 + 1, "Cleared checkboxes - HOT list modified");

    for (i = 0; i < cbs.length; i++) {
      cb = cbs[i];
      cb.checked = false;
      doClick(cb);
    }

    hotListEntries = document.querySelectorAll(".hotTable");
    assert.strictEqual(hotListEntries.length, cbs.length + 1, "Checked boxes - HOT list modified");
  });
  
  QUnit.test("Test Active Buddy List", function(assert) {
    testNicknamePopup(assert, upgrades.hotlist.upgrade, "Aizen", "aizen@soi");	
  });
}());