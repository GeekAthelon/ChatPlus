function testNicknamePopup(assert, setup, fullname, shortName) {
  "use strict";
  realmList[":masterSettings:"].buddyList.length = 0;
  var buddylist = realmList[":masterSettings:"].buddyList;
  setup();

  var nickEl = document.querySelector(".chatPlus_nick");
  assert.deepEqual(fullname, nickEl.textContent, "Found correct element");

  assert.deepEqual(fullname, nickEl.textContent, "Found correct element");

  var nick = nickEl.getAttribute("data-nick");
  assert.deepEqual(shortName, nick, "Found correct nick name");

  doClick(nickEl);

  var addButton = document.getElementById("cp-buddy-add");
  assert.ok(addButton, "Add button found");

  var removButton = document.getElementById("cp-buddy-remove");
  assert.notOk(removButton, "Remove button should NOT be found");

  if (addButton) {
    doClick(addButton);
    assert.deepEqual(buddylist.indexOf(shortName), 0, "Found newly added buddy");

    doClick(nickEl);
    var newRemove = document.getElementById("cp-buddy-remove");
    assert.ok(newRemove, "Remove Button found");
    doClick(newRemove);
    assert.deepEqual(buddylist.indexOf(shortName), -1, "Buddy Removed");
  }
}

(function() {
  "use strict";

  function myUpgrade() {
    upgrades.chatroom.upgrade();
  }

  QUnit.module("SOI ChatRoom", {
    beforeEach: function() {
      var fixture = document.getElementById("qunit-fixture");
      var template = document.getElementById("chatroom-template");

      var html = template.innerHTML;
      fixture.innerHTML = html;

      resetGlobals();
    },
    afterEach: function() {
      // clean up after each test
    }
  });

  QUnit.test("ChatRoom - Configuration", function(assert) {
    var id = identifySoi();

    var expected = {
      blankTail: "soi",
      formFind: true,
      formMail: false,
      fullRoomName: "soi@soi",
      isChatRoom: true,
      isCork: false,
      isFtpRoom: false,
      isHot: false,
      isNickRoom: false,
      isSoi: true,
      resetButton: true
    };

    assert.validConfig(id, expected);
  });

  QUnit.test("Check Nickname Conversions", function(assert) {

    var namesList = [
      "Pepin",
      "samsaraFFM",
      "samsaraFFM",
      "Pepin",
      "samsaraFFM",
      "",
      "Couch1",
      "",
      "AKTRe",
      "",
      "clarky",
      "",
      "Anyone",
      "",
      "Bradd",
      "",
      "Pepin",
      "",
      "Couch1",
      "",
      "Couch1",
      "",
      "Punch the Clown",
      "",
      "visitor man uk",
      "",
      "Anyone",
      "",
      "wildchild",
      "Punch the Clown",
      "Punch the Clown",
      "",
      "Seræna",
      "",
      "Couch1",
      "",
      "samsaraFFM",
      "",
      "Couch1",
      ""
    ];

    myUpgrade();
    var nicks = document.querySelectorAll(".chatPlus_nick");
    assert.strictEqual(nicks.length, 40, "All nicknames found");

  });

  QUnit.test("Check for Special Buttons", function(assert) {
    myUpgrade();

    assert.ok(document.querySelector("#chatplus-auto2"), "Auto2 button exists");
    assert.ok(document.querySelector("#chatplus-special"), "Special Actions Button exists");
    assert.ok(document.querySelector("#chatplus-reset"), "Reset button exists");
    assert.ok(document.querySelector("#chatplus-undo"), "Undo button exists");
  });

  QUnit.test("Convert to Postable Code", function(assert) {
    myUpgrade();

    var expectedResult = "<pre>&lt;<b></b>b<b></b>&gt;<b></b>T<b></b>h<b></b>i<b></b>s<b></b> <b></b>s<b></b>h<b></b>o<b></b>u<b></b>l<b></b>d<b></b> <b></b>b<b></b>e<b></b><br><b></b>T<b></b>r<b></b>a<b></b>n<b></b>s<b></b>l<b></b>a<b></b>t<b></b>e<b></b>d<b></b> <b></b>r<b></b>i<b></b>g<b></b>h<b></b>t<b></b>.<b></b>&lt;<b></b>/<b></b>b<b></b>&gt;</pre>";

    soiDetails.formMsg.elements.namedItem("vqxsp").value = "<b>This should be\r\nTranslated right.</b>";
    window.qunit.chat.convertToCode();
    var result = soiDetails.formMsg.elements.namedItem("vqxsp").value;

    assert.strictEqual(expectedResult, result, "Converted code matches expected result");
  });


  QUnit.test("Test Type2 Realm Lists", function(assert) {
    window.nameArray = ["~*~ Hong Kong RPG ~*~ ", " ", "~*~ Realm Information ~*~ ", "IC/OOC Cork", "Map Cork", " "];
    window.addressArray = ["", "", "", "!!!hkcork@soi", "!!!hkmap@soi", ""];

    myUpgrade();

    delete window.nameArray;
    delete window.addressArray;

    assert.strictEqual(window.nameArray, undefined, "nameArray property removed");
    assert.strictEqual(window.addressArray, undefined, "nameArray property removed");

    var rButton = document.querySelector("#chatplus-realm");
    assert.ok(rButton, "Realm button exists");
    assert.strictEqual(rButton.getAttribute("data-realm-type"), "2", "Realm is of type 2");
  });


  QUnit.test("Test Special (Round 1)...", function(assert) {
    myUpgrade();

    var specialButton = document.getElementById("chatplus-special");
    assert.ok(!!specialButton, "Special button found.");

    doClick(specialButton);

    var popup = document.querySelectorAll(".cp-popup-visible, .cp-popup-hidden")[0];
    assert.ok(!!popup, "Popup made");

    var items = popup.querySelectorAll("input[type='button']").length;
    assert.deepEqual(items, 1, "No macros, only one button");

    var convertButton = popup.querySelector("input[type='button']");
    doClick(convertButton);
    var popups = document.querySelectorAll(".cp-popup-visible, .cp-popup-hidden");

    assert.deepEqual(popups.length, 0, "After use, menu destroyed");
  });

  QUnit.test("Test Special (Round 2)...", function(assert) {
    realmList[":macros:"] = {
      "0": {
        "key": "0",
        "value": "",
        "name": ""
      },
      "1": {
        "key": "1",
        "value": "<font size=\"7\">D<sub>r<sub>o<sub>p<sub>s<sub> <sub>i<sub>n<sub> <sub>f<sub>o<sub>r<sub> <sub>a<sub> <sub>v<sub>i<sub>s<sub>i<sub>t<sub>.</font>",
        "name": "Drops in"
      }
    };

    myUpgrade();
    var specialButton = document.getElementById("chatplus-special");
    doClick(specialButton);
    var popup = document.querySelectorAll(".cp-popup-visible, .cp-popup-hidden")[0];
    var items = popup.querySelectorAll("input[type='button']").length;
    assert.deepEqual(items, 2, "One empty, one populated macro");
  });


  QUnit.test("Test Type3 Realm Lists", function(assert) {
    var selectHtml = '<select name="sb" id="sb" size="1">' +
      '<option value="">~~~~~ Milano ~~~~~</option>' +
      '<option value=""></option>' +
      '<option value="micork@soi">IC &amp; OOC Cork</option>' +
      '<option value="http://soiroom.hyperchat.com/micork/milaninfo.html">OOC Info</option>' +
      '</select>';

    var div = document.createElement("div");
    div.innerHTML = selectHtml;
    document.getElementById("qunit-fixture").appendChild(div);

    assert.ok(document.querySelector("#sb"), "Realm Select List Created");

    myUpgrade();

    var rButton = document.querySelector("#chatplus-realm");
    assert.ok(rButton, "Realm button exists");
    assert.strictEqual(rButton.getAttribute("data-realm-type"), "3", "Realm is of type 3");
  });


  QUnit.test("Get Post Markers", function(assert) {
    var markers = upgrades.chatroom.internal.getPostMarkers();

    assert.deepEqual(markers.actionLinks.length, 20, "All action links found");
    assert.deepEqual(markers.dialogTags.length, 20, "All action links found");
  });

  QUnit.test("Extract names from dialogTags", function(assert) {
    function test(s, expected) {
      var b = document.createElement("b");
      b.innerHTML = s;
      var result = upgrades.chatroom.internal.splitDialogTag(b);

      assert.deepEqual(result.from.text, expected.fromText, "From Text Matches: " + expected.fromText);
      assert.deepEqual(result.to.text, expected.toText, "To Text Matches: " + expected.fromText);
      assert.deepEqual(result.sep, expected.sep, "Seperator matches: " + expected.sep);

      //assert.deepEqual(result.toHtmlText, result.toText, "toText: Text and HTML->Text versions match");
      //assert.deepEqual(result.fromHtmlText, result.fromHtmlText, "fromText: Text and HTML->Text versions match");
    }
    var s;
    var r;

    s = '<i><font face="elephant" size="3" color="585858">N<font color="707070">i<font color="787878">k<font color="909090">k<font color="707070">i <font color="585858">H<font color="707070">e<font color="909090">a<font color="A8A8A8">t</font></font></font></font></font></font></font></font></font></i> <i>said to</i> <font color="green">ashlea</font>:';
    r = {
      fromText: "Nikki Heat",
      toText: "ashlea",
      sep: "said to"
    };
    test(s, r);

    s = '<i><font color="#000000">B</font><font color="#2b3618">l</font><font color="#556b2f">i</font><font color="#394820">g</font><font color="#1d2410">h</font><font color="#000000">t</font></i> <i>said to</i> <font color="#C0C0C0">N</font><font color="#B2AFAF">a</font><font color="#A49D9D">d</font><font color="#958C8C">i</font><font color="#877A7A">n</font><font color="#796969">e</font><i> <font color="#5D4646">B</font><font color="#4F3434">l</font><font color="#402323">a</font><font color="#321111">c</font><font color="#240000">k</font></i>:';
    r = {
      fromText: "Blight",
      toText: "Nadine Black",
      sep: "said to"
    };
    test(s, r);

    s = 'faith, hope &amp; charity <i>said</i>:';
    r = {
      fromText: "faith, hope & charity",
      toText: "",
      sep: "said"
    };
    test(s, r);

    s = 'athelon-testing <i>said to</i> athelon3-testing:';
    r = {
      fromText: "athelon-testing",
      toText: "athelon3-testing",
      sep: "said to"
    };
    test(s, r);

    s = '<font color="navy">-=[<font color="silver"><i><font color="white">A</font>thelon</i></font>]=-</font> <i>said to</i> athelon3-testing:';
    r = {
      fromText: "-=[Athelon]=-",
      toText: "athelon3-testing",
      sep: "said to"
    };
    test(s, r);

    s = '<font color="navy">-=[<font color="silver"><I><font color="white">A</font>thelon</i></font>]=-</font> <i>said to</i> <i><font color="#665c2e">G</font><font color="#444640">a</font><font color="#212f50">b</font><font color="#4c5869">b</font><font color="#788083">y</font><font color="#a2a89b"> </font><font color="#788083">W</font><font color="#4c5869">i</font><font color="#212f50">l</font><font color="#383e45">s</font><font color="#504e3a">o</font><font color="#665c2e">n</font></font></font></i><sup>@soi</sup>:';
    r = {
      fromText: "-=[Athelon]=-",
      toText: "Gabby Wilson@soi",
      sep: "said to"
    };
    test(s, r);
  });

  QUnit.test("Test Active Buddy List", function(assert) {
    testNicknamePopup(assert, myUpgrade, "Pepin ", "pepin@soi");
  });

}());