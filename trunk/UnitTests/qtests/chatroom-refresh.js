QUnit.module("Chat - Refresh mode", {
  beforeEach: function() {
    var fixture = document.getElementById("qunit-fixture");
    var template = document.getElementById("chatroom-refresh-template");

    var html = template.innerHTML;
    fixture.innerHTML = html;

    resetGlobals();
  },
  afterEach: function() {
    // clean up after each test
  }
});

QUnit.test("getRefreshMeta", function(assert) {
  assert.ok(true, "Test not available yet");
  //assert.strictEqual(getRefreshMeta(), "a");
});
