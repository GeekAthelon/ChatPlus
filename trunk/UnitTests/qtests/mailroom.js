(function() {
  "use strict";

  QUnit.module("SOI MailRoom", {
    beforeEach: function() {
      var fixture = document.getElementById("qunit-fixture");
      var template = document.getElementById("mailroom-template");

      var html = template.innerHTML;
      fixture.innerHTML = html;

      resetGlobals();
    },
    afterEach: function() {
      document.getElementById("qunit-fixture").innerHTML = "";
      // clean up after each test
    }
  });

  QUnit.test("Configuration", function(assert) {
    var id = identifySoi();

    var expected = {
      blankTail: "soi",
      formFind: true,
      formMail: true,
      fullRoomName: "m@soi",
      isChatRoom: true,
      isCork: false,
      isFtpRoom: false,
      isHot: false,
      isNickRoom: false,
      isSoi: true,
      lastLink: true
    };

    assert.validConfig(id, expected);
  });

  QUnit.test("Check Nickname Conversions", function(assert) {
    upgrades.chatroom.upgrade();

    var namesList = [
      "Gabby Wilson",
      "-=[Athelon]=-",
      "-=[Athelon]=-",
      "Gabby Wilson@soi",
      "Gabby Wilson",
      "-=[Athelon]=-"
    ];

    var nicks = document.querySelectorAll(".chatPlus_nick");
    assert.strictEqual(nicks.length, 6, "All nicknames found");
    assert.deepEqual(window.qunit.chat.namesList, namesList, "Names List matches");
  });


  QUnit.test("Check for Special Buttons", function(assert) {
    upgrades.chatroom.upgrade();

    assert.ok(document.querySelector("#chatplus-auto2"), "Auto2 button exists");
    assert.ok(document.querySelector("#chatplus-special"), "Special Actions Button exists");
    assert.ok(document.querySelector("#chatplus-reset"), "Reset button exists");
    assert.ok(!document.querySelector("#chatplus-undo"), "Undo button doesn't exist");
    assert.ok(document.querySelector("#chatplus-mass-mail"), "Mass Mail button found");

    assert.ok(document.querySelector("#nameSetupPrompt"), "Mail Reply Setup Prompt found");
  });

  QUnit.test("Check for Reply/MSG buttons", function(assert) {
    upgrades.chatroom.upgrade();

    var replyButtonsList = document.querySelectorAll('[data-chatplus-mode="Reply"]');

    if (replyButtonsList.length === 0) {
      assert.ok(false, "No reply button list found");
      return;
    }

    var msgAgainButtonsList = document.querySelectorAll('[data-chatplus-mode="MSG again"]');

    assert.strictEqual(replyButtonsList.length, 2, "Correct number of reply buttons found");
    assert.strictEqual(msgAgainButtonsList.length, 1, "Correct number of MSG again buttons found");

    assert.strictEqual(replyButtonsList[0].getAttribute("data-chatplus-from"), "athelon@soi", "Correct From Found 1");
    assert.strictEqual(replyButtonsList[0].getAttribute("data-chatplus-to"), "gabbywilson@soi", "Correct To Found 2");

    assert.strictEqual(replyButtonsList[1].getAttribute("data-chatplus-from"), "athelon@soi", "Correct From Found 3");
    assert.strictEqual(replyButtonsList[1].getAttribute("data-chatplus-to"), "gabbywilson@soi", "Correct To Found 4");

    assert.strictEqual(msgAgainButtonsList[0].getAttribute("data-chatplus-from"), "athelon@soi", "Correct From Found 5");
    assert.strictEqual(msgAgainButtonsList[0].getAttribute("data-chatplus-to"), "gabbywilson@soi", "Correct To Found 6");
  });
}());
