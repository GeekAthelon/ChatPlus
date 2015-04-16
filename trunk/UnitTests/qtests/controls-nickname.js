QUnit.module("Control Room - Nickname", {
  beforeEach: function() {
    var fixture = document.getElementById("qunit-fixture");
    var template = document.getElementById("controls-nickname-template");

    var html = template.innerHTML;
    fixture.innerHTML = html;

    resetGlobals();
  },
  afterEach: function() {
    // clean up after each test
  }
});

QUnit.test("Configuration", function(assert) {
  var id = identifySoi();

  var expected =  {
    blankTail: "soi",
    formFind: true,
    formMail: false,
    fullRoomName: "c@soi",
    isChatRoom: false,
    isCork: false,
    isFtpRoom: false,
    isHot: false,
    isNickRoom: true,
    isSoi: true,
    resetButton: false
  };

   assert.validConfig(id, expected);
});

QUnit.test("Check for added options", function(assert) {
  upgrades.control_nicknames.upgrade();
  
  assert.ok(document.querySelector("#chatplus-previewnick"), "Preview Nickname Button exists");
  assert.ok(document.querySelector("#chatplus-select-avatar"), "Select Avatar dropdown exists");  
});


