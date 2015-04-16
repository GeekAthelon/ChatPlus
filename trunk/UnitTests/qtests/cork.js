QUnit.module("ChatPlus Cork", {
  beforeEach: function() {
    var fixture = document.getElementById("qunit-fixture");
    var template = document.getElementById("cork-template");

    var html = template.innerHTML;
    fixture.innerHTML = html;

    upgrades.cork.internals.nuke();

    resetGlobals();
  },
  afterEach: function() {
    upgrades.cork.internals.nuke();
  }
});

QUnit.test("Configuration", function(assert) {
  var id = identifySoi();

  var expected = {
    blankTail: "soi",
    formFind: true,
    formMail: false,
    fullRoomName: "chatplus@soi",
    isChatRoom: true,
    isCork: true,
    isFtpRoom: false,
    isHot: false,
    isNickRoom: false,
    isSoi: true,
    resetButton: true
  };

  assert.validConfig(id, expected);
});

QUnit.test("Parsing Cork Board", function(assert) {
  var data = upgrades.cork.internals.parseCork();

  var expected = [{
    "timeStamp": "Wed Apr 08 18:17",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"BugReport: ChatPlus attemps to upgrade ROOM CONTROLS\"",
    "reactions": 0
  }, {
    "timeStamp": "Mon Apr 06 18:26",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"Notes to myself - Type2 dropdown\"",
    "reactions": 0
  }, {
    "timeStamp": "Sun Apr 05 17:31",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"ChatPlus 5.57 - Updated FTP File Controls\"",
    "reactions": 10
  }, {
    "timeStamp": "Sun Apr 05 17:31",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"Test Line -- same timeStamp as above\"",
    "reactions": 5
  }, {
    "timeStamp": "Mon Feb 02 18:11",
    "isCitizenPost": null,
    "nickElement": "ms conduct",
    "title": "\"Ongoing battle with feistyangel@bwr\"",
    "reactions": 5
  }, {
    "timeStamp": "Fri Dec 12 23:29",
    "isCitizenPost": null,
    "nickElement": "-=[Lord of the Dice]=-",
    "title": "\"#r-dice -- Yahtzee Weirdness\"",
    "reactions": 0
  }, {
    "timeStamp": "Thu Sep 04 17:46",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"Version 5.5\"",
    "reactions": 3
  }, {
    "timeStamp": "Thu Sep 04 16:39",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"Version 5.54\"",
    "reactions": 1
  }, {
    "timeStamp": "Tue Aug 26 19:04",
    "isCitizenPost": null,
    "nickElement": " Rogue Thugg",
    "title": "\"chatplus missingsome stuff\"",
    "reactions": 1
  }, {
    "timeStamp": "Thu Aug 07 21:16",
    "isCitizenPost": null,
    "nickElement": "T.C.Pale",
    "title": "\"SeaMonkey?\"",
    "reactions": 4
  }, {
    "timeStamp": "Thu Aug 07 13:23",
    "isCitizenPost": null,
    "nickElement": "TwisT",
    "title": "\"Name Clicks and Realm Button\"",
    "reactions": 2
  }, {
    "timeStamp": "Thu Aug 07 02:47",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"ChatPlus 5.52 -- two outstanding issues fixed\"",
    "reactions": 1
  }, {
    "timeStamp": "Thu Aug 07 00:19",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"In regards to the Reply Feature ...\"",
    "reactions": 2
  }, {
    "timeStamp": "Wed Aug 06 15:59",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"ChatPlus died under Chrome/TamperMonkey\"",
    "reactions": 2
  }, {
    "timeStamp": "Wed Jul 30 08:56",
    "isCitizenPost": null,
    "nickElement": "Adrienne",
    "title": "\"Reply Feature\"",
    "reactions": 7
  }, {
    "timeStamp": "Thu Jun 05 09:45",
    "isCitizenPost": null,
    "nickElement": "haley{Callum}",
    "title": "\"ROOMS download exceed quota?\"",
    "reactions": 0
  }, {
    "timeStamp": "Sun Nov 10 21:37",
    "isCitizenPost": null,
    "nickElement": "Young Katumi",
    "title": "\"Checking identify Please wait. \"",
    "reactions": 2
  }, {
    "timeStamp": "Sun Aug 11 19:27",
    "isCitizenPost": null,
    "nickElement": "CeeJae",
    "title": "\"Cork Post Count\"",
    "reactions": 3
  }, {
    "timeStamp": "Mon Jul 29 12:52",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"Version 5.4.9 -- More Macro Slots\"",
    "reactions": 1
  }, {
    "timeStamp": "Wed Jun 05 17:17",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"Version 5.4.7 - Seems to fix Chrome Issue\"",
    "reactions": 0
  }, {
    "timeStamp": "Mon Jun 03 14:20",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"IMPORTANT: *** Tampermonkey broke ChatPlus in Chrome Again\"",
    "reactions": 2
  }, {
    "timeStamp": "Thu Feb 14 18:01",
    "isCitizenPost": null,
    "nickElement": "~ms mouse~",
    "title": "\"requests for recipes please ...\"",
    "reactions": 0
  }, {
    "timeStamp": "Thu Jan 31 14:06",
    "isCitizenPost": null,
    "nickElement": "X-23",
    "title": "\"Room list organization\"",
    "reactions": 0
  }, {
    "timeStamp": "Tue Jan 29 10:32",
    "isCitizenPost": null,
    "nickElement": "writes",
    "title": "\"troubleshooting\"",
    "reactions": 4
  }, {
    "timeStamp": "Sat Jan 12 10:47",
    "isCitizenPost": null,
    "nickElement": "Mistress Adia",
    "title": "\"music\"",
    "reactions": 2
  }, {
    "timeStamp": "Sat Dec 29 02:56",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"data dump for my own research\"",
    "reactions": 0
  }, {
    "timeStamp": "Mon Dec 03 16:13",
    "isCitizenPost": null,
    "nickElement": "{temptation personified}",
    "title": "\"Question - search feature?\"",
    "reactions": 2
  }, {
    "timeStamp": "Mon Dec 03 09:53",
    "isCitizenPost": null,
    "nickElement": "Sk.arve",
    "title": "\"Macros not showing up?\"",
    "reactions": 1
  }, {
    "timeStamp": "Fri Nov 09 18:35",
    "isCitizenPost": null,
    "nickElement": "Mistress Adia",
    "title": "\"*\"",
    "reactions": 1
  }, {
    "timeStamp": "Tue Oct 23 15:47",
    "isCitizenPost": null,
    "nickElement": "Orlando",
    "title": "\"Request for multiloc functionality\"",
    "reactions": 2
  }, {
    "timeStamp": "Wed Oct 03 15:29",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"Bug: Clicking on the 'Show Hidden Rooms' doesn't hide the button\"",
    "reactions": 0
  }, {
    "timeStamp": "Sun Sep 23 17:19",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"ChatPlus 5.46\"",
    "reactions": 2
  }, {
    "timeStamp": "Sat Sep 22 21:01",
    "isCitizenPost": null,
    "nickElement": "Catherine O'Sullivan",
    "title": "\"From question in mailroom\"",
    "reactions": 1
  }, {
    "timeStamp": "Wed Sep 19 14:38",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"Version 5.43 - Cosmetic\"",
    "reactions": 0
  }, {
    "timeStamp": "Thu Aug 30 09:59",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"Leave tech support needs here\"",
    "reactions": 2
  }, {
    "timeStamp": "Fri Aug 24 21:17",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"Doesn't work in #r-sbchar\"",
    "reactions": 0
  }, {
    "timeStamp": "Wed Aug 22 12:20",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"Oh yea -- offically dropped IE support\"",
    "reactions": 1
  }, {
    "timeStamp": "Tue Aug 21 23:46",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"Version 5.41 - Woot\"",
    "reactions": 1
  }, {
    "timeStamp": "Sun Aug 12 22:42",
    "isCitizenPost": null,
    "nickElement": "writes",
    "title": "\"LV\"",
    "reactions": 0
  }, {
    "timeStamp": "Mon May 28 00:40",
    "isCitizenPost": null,
    "nickElement": "writes",
    "title": "\"Lord Viper\"",
    "reactions": 0
  }, {
    "timeStamp": "Fri May 18 01:42",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"Version 5.37 Uploaded\"",
    "reactions": 2
  }, {
    "timeStamp": "Sun May 13 16:06",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"ChatPlus 5.35 Uploaded\"",
    "reactions": 8
  }, {
    "timeStamp": "Wed May 09 08:32",
    "isCitizenPost": null,
    "nickElement": "writes",
    "title": "\"Short enhancement?\"",
    "reactions": 2
  }, {
    "timeStamp": "Mon May 07 12:12",
    "isCitizenPost": null,
    "nickElement": "writes",
    "title": "\"Bug in old 2.0.9 version?\"",
    "reactions": 4
  }, {
    "timeStamp": "Wed Apr 11 15:50",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"I'm leaving a note for myself...\"",
    "reactions": 0
  }, {
    "timeStamp": "Fri Mar 23 17:43",
    "isCitizenPost": null,
    "nickElement": "amantay ",
    "title": "\"yahtzee2\"",
    "reactions": 1
  }, {
    "timeStamp": "Mon Mar 12 08:25",
    "isCitizenPost": null,
    "nickElement": "lynaya ",
    "title": "\"yahtzee\"",
    "reactions": 1
  }, {
    "timeStamp": "Sat Mar 10 22:08",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"Version 5.32: Better tail handling\"",
    "reactions": 1
  }, {
    "timeStamp": "Fri Feb 17 09:58",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"Tiranca tail is unknown to chatplus -- to fix some day. Maybe.\"",
    "reactions": 0
  }, {
    "timeStamp": "Sat Feb 11 20:27",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"Version 5.29 -- Removed highlighting for online buddies\"",
    "reactions": 5
  }, {
    "timeStamp": "Thu Feb 09 20:58",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"Version 5.27 -- Send a message to a user by clicking on their name\"",
    "reactions": 0
  }, {
    "timeStamp": "Thu Feb 09 07:20",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"Version 5.26 - buddies outlined and Home Pages working\"",
    "reactions": 0
  }, {
    "timeStamp": "Wed Feb 08 02:01",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"Chrome Bug\"",
    "reactions": 2
  }, {
    "timeStamp": "Tue Feb 07 13:34",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"Version 5.24 - Minor issue with the hot list\"",
    "reactions": 0
  }, {
    "timeStamp": "Mon Feb 06 16:13",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"Version 5.23 -- EESSSH, what did I do?\"",
    "reactions": 0
  }, {
    "timeStamp": "Mon Feb 06 15:15",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"Version 5.22 -- this really should be stable\"",
    "reactions": 0
  }, {
    "timeStamp": "Mon Feb 06 03:28",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"Version 5.21\"",
    "reactions": 1
  }, {
    "timeStamp": "Mon Feb 06 01:48",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"Version 5.18\"",
    "reactions": 0
  }, {
    "timeStamp": "Mon Feb 06 01:11",
    "isCitizenPost": null,
    "nickElement": "lynaya ",
    "title": "\"Athelon\"",
    "reactions": 0
  }, {
    "timeStamp": "Sat Feb 04 04:55",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"Bug report\"",
    "reactions": 5
  }, {
    "timeStamp": "Fri Feb 03 22:39",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"Why ChatPlus Quit Working\"",
    "reactions": 0
  }, {
    "timeStamp": "Fri Feb 03 22:31",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"Looking for brave volunteers for ChatPlus 5.11\"",
    "reactions": 2
  }, {
    "timeStamp": "Thu Feb 02 18:03",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"Pulled on a report of eating data ... hoping to solve that soon.\"",
    "reactions": 0
  }, {
    "timeStamp": "Thu Feb 02 17:20",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"ChatPlus: 5.4 Already\"",
    "reactions": 1
  }, {
    "timeStamp": "Thu Feb 02 16:30",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"Windows version caveat\"",
    "reactions": 0
  }, {
    "timeStamp": "Thu Feb 02 16:29",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"ChatPlus: 5.3\"",
    "reactions": 1
  }, {
    "timeStamp": "Thu Feb 02 16:26",
    "isCitizenPost": null,
    "nickElement": "-=[Athelon]=-",
    "title": "\"Ack! I cleared the room by mistake.\"",
    "reactions": 3
  }];

  data.forEach(function(post, i) {
    assert.deepEqual(expected[i], data[i], " Post #" + i + " matches expected");
  });

});

QUnit.test("Testing save/restore/nuke", function(assert) {
  var test = {
    mary: "had a little lamb"
  };
  var test1;

  upgrades.cork.internals.saveBucket(test);
  test1 = upgrades.cork.internals.getBucket(test);
  assert.deepEqual(test, test1, "Saved and restored value");


  upgrades.cork.internals.nuke();
  test1 = upgrades.cork.internals.getBucket();
  assert.deepEqual({}, test1, "Nuke worked");
});


QUnit.test("Checking for new posts", function(assert) {
  upgrades.cork.upgrade();

  assert.deepEqual(document.querySelectorAll(".chatplus_cork_count").length, 67, "Post counts found");
  assert.deepEqual(document.querySelectorAll("[data-cp-cork-flag='*']").length, 67 - 1, "New Posts found");
  assert.deepEqual(document.querySelectorAll("[data-cp-cork-flag='-']").length, 0, "THere should be NO read posts");
});

QUnit.test("Checking for read posts", function(assert) {
  var test1 = {
    "Mon Feb 02 18:11": {
      reactions: 3,
      isNew: false,
    }
  };

  upgrades.cork.internals.saveBucket(test1);
  upgrades.cork.upgrade();
  var posts = document.querySelectorAll("[data-cp-cork-flag='2']");
  assert.deepEqual(posts.length, 1, "One post found with proper number of unread message");
});

QUnit.test("Checking for read posts", function(assert) {
  var test1 = {
    "Mon Feb 02 18:11": {
      reactions: 3,
      isNew: false,
    }
  };

  upgrades.cork.internals.saveBucket(test1);
  upgrades.cork.upgrade();
  var posts = document.querySelectorAll("[data-cp-cork-flag='2']");
  assert.deepEqual(posts.length, 1, "One post found with proper number of unread message");
});

QUnit.test("Testing Click Handler", function(assert) {
  upgrades.cork.upgrade();

  var links = document.querySelectorAll("[data-cp-cork-reactions='8']");
  assert.deepEqual(links.length, 1, "One post found 8 unread messages");
  assert.deepEqual(links[0].getAttribute("data-cp-cork-flag"), "*", "Has the new flag");

  var a = links[0];
  doClick(a);

  upgrades.cork.upgrade();

  links = document.querySelectorAll("[data-cp-cork-reactions='8']");
  assert.deepEqual(links.length, 1, "Still One post found 8 unread messages");
  assert.deepEqual(links[0].getAttribute("data-cp-cork-flag"), "-", "Has the read flag");
});

QUnit.test("Test Active Buddy List", function(assert) {
  testNicknamePopup(assert, upgrades.cork.upgrade, "-=[Athelon]=-", "athelon@soi");
});