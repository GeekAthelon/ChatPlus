QUnit.module("Control Room - FTP Files", {
  beforeEach: function() {
    var fixture = document.getElementById("qunit-fixture");
    var template = document.getElementById("controls-ftp-files-template");

    var html = template.innerHTML;
    fixture.innerHTML = html;

    resetGlobals();
    addGlobalListeners();

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
    isFtpRoom: true,
    isHot: false,
    isNickRoom: false,
    isSoi: true,
    resetButton: false
  };
  
  assert.validConfig(id, expected);

});

QUnit.test("getExtension", function(assert) {
  var ext = upgrades.control_ftp_files.internals.getExtension("readme.txt");
  assert.deepEqual(ext, "txt");

  ext = upgrades.control_ftp_files.internals.getExtension("double.or.nothing");
  assert.deepEqual(ext, "nothing");

  ext = upgrades.control_ftp_files.internals.getExtension("noext");
  assert.deepEqual(ext, "noext");
});

QUnit.test("getExtension", function(assert) {
  var nick = upgrades.control_ftp_files.internals.currentNick();
  assert.deepEqual(nick, "theinept");

});


QUnit.test("Check for added options", function(assert) {
  upgrades.control_ftp_files.upgrade();
  
  assert.strictEqual(document.querySelectorAll(".chatplus-file-size").length, 7, "Human readable sizes present");
  assert.strictEqual(document.querySelectorAll(".chatplus-add-ava").length, 6, "Add Avatar buttons present");
  assert.strictEqual(document.querySelectorAll(".chatplus-edit-button").length, 1, "Edit button present");
});


