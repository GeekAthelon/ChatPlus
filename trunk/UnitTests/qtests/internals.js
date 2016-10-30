(function() {
  "use strict";
  QUnit.module("Internal Structures and Support", {
    beforeEach: function() {
      var fixture = document.getElementById("qunit-fixture");
      var template = document.getElementById("internal-structures-template");

      var html = template.innerHTML;
      fixture.innerHTML = html;

      resetGlobals();
    },
    afterEach: function() {
      // clean up after each test
    }
  });

  QUnit.test("getNumberOfElementsByName", function(assert) {
    assert.strictEqual(typeof getNumberOfElementsByName, "function", "Function exists");
    var vqvakLengthOnHotList;

    vqvakLengthOnHotList = getNumberOfElementsByName(document, "vqvak");
    assert.strictEqual(vqvakLengthOnHotList, 3, "Correctly found 3 elements");

    vqvakLengthOnHotList = getNumberOfElementsByName(document, "notFound");
    assert.strictEqual(vqvakLengthOnHotList, 0, "Correctly found 0 elements");
  });

  QUnit.test("isRealmNameValid", function(assert) {
    assert.ok(!isRealmNameValid("a"), "Name too short");
    assert.ok(isRealmNameValid("aa"), "Two character name");
    assert.ok(isRealmNameValid("aaaaaaaa"), "Eight character name");
    assert.ok(!isRealmNameValid("aaaaaaaaa"), "Nine character name");

    assert.ok(!isRealmNameValid("a#aa^aa$aaa"), "Eight character name with stripped chars");
  });

  QUnit.test("highlightIfBuddy", function(assert) {
    assert.ok(true, "Test skipped.");

    function test(s, shouldPass) {
      var el = document.createElement("span");
      highlightIfBuddy(el, s);
      var hasClass = el.classList.contains("onlineBuddy");

      if (shouldPass) {
        assert.ok(hasClass, "'" + s + "': " + shouldPass);
      } else {
        assert.ok(!hasClass, "'" + s + "': " + shouldPass);
      }
    }

    //test("jjs", true);
    //test("fooba", true);
    //test("jjs", false);
  });

  QUnit.test("getTail", function(assert) {
    assert.strictEqual(getTail("jjs@jjs"), "jjs", "Valid tail passed");
    assert.strictEqual(getTail("jjs"), window.soiDetails.blankTail, "No tail passed");
  });

  QUnit.test("normalizeToSoiShortNick", function(assert) {
    assert.strictEqual(normalizeToSoiShortNick("jjs@jjs"), "jjsjjs", normalizeToSoiShortNick("jjs@jjs"));
    assert.strictEqual(normalizeToSoiShortNick("-=[Athelon]=-"), "athelon", "-=[Athelon]=-");
  });

  QUnit.test("extractNameInfo", function(assert) {
    var el = document.createElement("div");
    el.innerHTML = '<font size="3">[[[<font color="#87cefa">N</font><font color="#93d3f8">i</font>' +
      '<font color="#9fd8f6">c</font><font color="#abddf3">o</font><font color="#b7e2f0"> </font>' +
      '<font color="#c4e7ee">R</font><font color="#d0eceb">o</font><font color="#dcf1e8">m</font>' +
      '<font color="#e8f6e5">a</font><font color="#f4fbe3">n</font><font color="#ffffe0">o</font></font>]]]';

    var expectedResult = {
      "decoratedName": "[[[Nico Romano]]]",
      "fullSoiStyleName": "nicoromano@priv",
      "nameNoTail": "[[[Nico Romano]]]",
      "soiStyleName": "nicoromano",
      "tail": "priv"
    };

    var nameInfo = extractNameInfo(el, "priv");
    assert.deepEqual(nameInfo, expectedResult, "Extracted nickname matches expected result.");
  });

  QUnit.test("makeRoomLink", function(assert) {
    var expected = "http://example.com/#vqxus=Visitor&vqxha=Visitor&roomsite=soi&vqxti=1428299047&vqvak=Find&vqxfi=c&chatplus_homepage&true";

    var a1 = makeRoomLink("ZZZ", "http://example.com");
    var a2 = makeRoomLink("ZZZ", "http://example.com/");

    assert.strictEqual(a1.href, expected, "Without ending slash");
    assert.strictEqual(a2.href, expected, "With ending slash");
  });

  QUnit.test("isArray", function(assert) {
    assert.strictEqual(isArray([]), true, "Array");
    assert.strictEqual(isArray({}), false, "Object");
    assert.strictEqual(isArray({
      length: 5
    }), false, "Object with length");
  });

  QUnit.test("makePlayerHomePageLink", function(assert) {
    var expected = "https://soiuser.hyperchat.com/jjs/homepage.html#vqxus=Visitor&vqxha=Visitor&roomsite=soi&vqxti=1428299047&vqvak=Find&vqxfi=c&chatplus_homepage&true";
    var l1 = makePlayerHomePageLink("jjs", "soi");
    var l2 = makePlayerHomePageLink("jjs", "priv");

    var u1 = makePlayerHomePageUrl("jjs", "soi");

    assert.strictEqual(expected, l1.href, "Good tail");
    assert.strictEqual(expected, u1, "makePlayerHomePageUrl good");
    assert.strictEqual("<span>unknown tail: priv</span>", l2.outerHTML, "Unknown tail");
  });

  QUnit.test("objectToUrlArray", function(assert) {
    var testData = {
      prop1: true,
      prop2: "string",
      prop3: 99
    };

    var expectedResult = [
      "prop1=true",
      "prop2=string",
      "prop3=99"
    ];
    var l1 = objectToUrlArray(testData);
    assert.deepEqual(l1, expectedResult, "Converted data matches expected result");
  });

  QUnit.test("urlencode", function(assert) {
    assert.strictEqual(urlencode("a"), "a", "Passed - 'a'");
    assert.strictEqual(urlencode(" "), "+", "Passed - ' '");
    assert.strictEqual(urlencode("!"), "%21", "Passed - '!'");
    assert.strictEqual(urlencode("'"), "%27", "Passed - \"'\"");
    assert.strictEqual(urlencode("("), "%28", "Passed - '('");
    assert.strictEqual(urlencode(")"), "%29", "Passed - ')'");
  });

  QUnit.test("fixFormAction", function(assert) {
    var form = document.createElement("form");
    form.action = "http://example.com?test#hash1";

    var action = fixFormAction(form);
    assert.strictEqual(action, "http://example.com/?test#hash1", "fixed Form action passed");
  });

  QUnit.test("humanFileSize", function(assert) {
    assert.strictEqual(humanFileSize(570, false), "570 B", "B");
    assert.strictEqual(humanFileSize(575730, false), "562.2 KiB", "Kib");
    assert.strictEqual(humanFileSize(5721794310, false), "5.3 GiB", "Gib");
    assert.strictEqual(humanFileSize(54741234873170, false), "49.8 TiB", "TiB");
    assert.strictEqual(humanFileSize(789723134466789570, false), "701.4 PiB", "PiB");
    assert.strictEqual(humanFileSize(113557978632478045763570, false), "96.2 ZiB", "ZiB");
  });

  QUnit.test("Testing Buddy List", function(assert) {
    realmList[":masterSettings:"].buddyList.length = 0;
    var buddylist = realmList[":masterSettings:"].buddyList;

    var n = "jjs@priv";
    buddyList.add(n);
    assert.ok(buddyList.isBuddy(n), "Buddy added");
    buddyList.remove(n);
    assert.notOk(buddyList.isBuddy(n), "Buddy removed");

    var didException = false;
    try {
      buddyList.add(n);
      buddyList.add(n);
    } catch (e) {
      didException = true;
    }

    assert.ok(didException, "Exception thrown adding duplicate.");

    buddylist.length = 0;
    didException = false;
    try {
      buddyList.remove(n);
    } catch (e) {
      didException = true;
    }
    assert.ok(didException, "Exception thrown removing non-existing entry.");
  });

  QUnit.module("myDom", {
    beforeEach: function() {
      resetGlobals();
    },
    afterEach: function() {
      // clean up after each test
    }
  });

  QUnit.test("insertAfter", function(assert) {
    var div = document.createElement("div");
    div.innerHTML = "<div><h1>Test...</h1><span>...</span></div>";

    var h1 = div.querySelector("h1");

    var h2 = document.createElement("h2");
    myDom.insertAfter(h2, h1);

    var span = div.querySelector("h1 + h2 + span");

    assert.ok(span, "Span element found in correct location");
  });

  QUnit.test("nextElementSibling", function(assert) {
    function pn(el) {
      return myDom.nextElementSibling(el);
    }

    var div = document.createElement("div");
    div.innerHTML = "<div>  1<h1> </h1> 2<h2>  </h2>  3<h3>  </h3>  4<h4>  </h4> 5 <h5>  </h5> 6 <h6>   </h6>";

    var start = div.querySelector("h1");
    assert.ok(start.tagName, "h1", "Starting on tag h1");

    var end = pn(start);
    end = pn(end);
    end = pn(end);
    end = pn(end);

    assert.strictEqual(end.tagName.toLowerCase(), "h5", "Ending on tag h5");
  });

  QUnit.test("createTag", function(assert) {
    var tag1 = myDom.createTag("span", "contents");
    var tag2 = myDom.createTag("div", tag1);

    assert.strictEqual(tag1.innerHTML, "contents", "Created tag with text contents correct");
    assert.ok(tag2.querySelector("span"), "Created tag with element content correct");
    assert.strictEqual(tag2.querySelector("span").innerHTML, "contents", "New tag has correct text contents too");
  });

  QUnit.test("createLinkToRoom", function(assert) {
    var link = myDom.createLinkToRoom("zeroom", "zetext");
    assert.strictEqual(link.tagName.toLowerCase(), "span", "'Fake' link correctly generated");
    assert.strictEqual(link.textContent, "zetext", "Contents of fake link correct");
  });

  QUnit.test("urlEncode", function(assert) {
    var str = "The quick !@#$$$$$%^&*()_+<> I�t�rn�ti�n�liz�ti�n \u1F4A9"; //jshint ignore:line

    var s = myDom.urlEncode(str);
    assert.strictEqual(s, "The+quick+%21%40%23%24%24%24%24%24%25%5E%26%2A%28%29_%2B%3C%3E+I%F1t%EBrn%E2ti%F4n%E0liz%E6ti%F8n+%1F4A9", "UrlEncode correct");
  });

  QUnit.test("getLinkByText", function(assert) {
    var fixture = document.getElementById("qunit-fixture");
    var html = "<a href='##'>ZZ</a><a href='http://example.com/right1'>FindMe</a>";
    fixture.innerHTML = html;

    var a = getLinkByText("FindMe");
    assert.ok(a, "Found a link");

    assert.strictEqual(a.href, "http://example.com/right1");

    var a1 = getLinkByText("--NOTFOUND--");
    assert.ok(!a1, "Correct response for not found");
  });

  QUnit.module("utils.stringFormat test", {});

  QUnit.test("ChatRoom - Configuration", function(assert) {
    var expectedResult = "Hello world";

    var str = "Hello {0}";
    var result = stringFormat(str, "world");
    assert.deepEqual(result, expectedResult, "One parameter");

    str = "Hello {0}";
    result = stringFormat(str, ["world"]);
    assert.deepEqual(result, expectedResult, "One element array");

    str = "{0} {1}";
    result = stringFormat(str, "Hello", "world");
    assert.deepEqual(result, expectedResult, "Two parameters");

    str = "{0} {1}";
    result = stringFormat(str, ["Hello", "world"]);
    assert.deepEqual(result, expectedResult, "Two element array");

    str = "{0} {1}";
    result = stringFormat(str, ["Hello", "world", "extra!"]);
    assert.deepEqual(result, expectedResult, "Two element array");
  });

  QUnit.test("Brace substitution Tests", function(assert) {
    var str = "Hello {{0}}";
    var result = stringFormat(str, "world");
    assert.deepEqual(result, "Hello {0}", "Double Braces");

    str = "{0} {1} {2}";
    result = stringFormat(str, "a", "{0}", "b");
    assert.deepEqual(result, "a {0} b", "{0} substitution");
  });

  QUnit.test("Key/Value substitution Tests", function(assert) {
    var expectedResult = "Hello world";

    var str = "Hello {key}";
    var result = stringFormat(str, {
      "key": "world"
    });
    assert.deepEqual(result, expectedResult, "One element object");

    str = "{key2} {key}";
    result = stringFormat(str, {
      "key": "world",
      "key2": "Hello"
    });
    assert.deepEqual(result, expectedResult, "Two element object");
  });

  QUnit.module("utils.dateHandling test", {});

  QUnit.test("isSoiDst", function(assert) {
    var soiTimestamp = 1477758726; // 10:08
    var soiTimeString = "** Gibberish 11:12 [10:32]";

    var isDst = dateTimeHandler.isSoiDst(soiTimestamp, soiTimeString);
    assert.equal(isDst, true);
  });

/*
*/

  QUnit.test("getDateFromDateString - test borked", function(assert) {
    var dates = [
      "Mon Apr 06 18:26",
      "Wed Apr 08 18:17",
      "Sun Apr 05 17:31",
      "Sun Apr 05 17:31",
      "Mon Feb 02 18:11"
    ];


    var dates2 = [
      "Wed Oct 03 15:29",
      "Sun Sep 23 17:19",
      "Sat Sep 22 21:01",
      "Wed Sep 19 14:38 "
    ];

    var soiTimestamp = 1477758726;
    var isDST = true;

    dates.forEach(function(d) {
      var thisDate = dateTimeHandler.getDateFromDateString(d, soiTimestamp, isDST);
      assert.equal(thisDate.getFullYear(), 2015);
    });

    dates2.forEach(function(d) {
      var thisDate = dateTimeHandler.getDateFromDateString(d, soiTimestamp, isDST);
      assert.equal(thisDate.getFullYear(), 2012);
    });

  });


  QUnit.test("getDateFromDateString - isDst true", function(assert) {
      var soiTimestamp = 1477758726;
      var dateString = "Sat Oct 29 10:32:06";
      var isDST = true;

      var date1 = new Date(soiTimestamp * 1000);
      var date2 = dateTimeHandler.getDateFromDateString(dateString, soiTimestamp, isDST);

      assert.equal(date2.getTime(), soiTimestamp * 1000);
      assert.equal(date1.toString(), date2.toString());
  });

  QUnit.test("getDateFromDateString - isDst false", function(assert) {
      var soiTimestamp = 1477758726;
      var dateString = "Sat Oct 29 09:32:06";
      var isDST = false;

      var date1 = new Date(soiTimestamp * 1000);
      var date2 = dateTimeHandler.getDateFromDateString(dateString, soiTimestamp, isDST);

      assert.equal(date2.getTime(), soiTimestamp * 1000);
      assert.equal(date1.toString(), date2.toString());
  });

  QUnit.test("getDateFromDateString - timeDifference", function(assert) {
      var time = 1477758726 * 1000;

      var date1 = new Date(time);
      var date2 = new Date(time);

      var res = dateTimeHandler.timeDifference(date1, date2);
      assert.equal(res, "\u2245 now");

      date2 = new Date(time);
      date2.setSeconds(date2.getSeconds() -30);
      res = dateTimeHandler.timeDifference(date1, date2);
      assert.equal(res, "30 seconds ago");

      date2 = new Date(time);
      date2.setSeconds(date2.getSeconds() -80);
      res = dateTimeHandler.timeDifference(date1, date2);
      assert.equal(res, "1 minute ago");

      date2 = new Date(time);
      date2.setSeconds(date2.getSeconds() -100);
      res = dateTimeHandler.timeDifference(date1, date2);
      assert.equal(res, "2 minutes ago");

      date2 = new Date(time);
      date2.setMinutes(date2.getMinutes() -60);
      res = dateTimeHandler.timeDifference(date1, date2);
      assert.equal(res, "1 hour ago");

      date2 = new Date(time);
      date2.setMinutes(date2.getMinutes() -120);
      res = dateTimeHandler.timeDifference(date1, date2);
      assert.equal(res, "2 hours ago");

      date2 = new Date(time);
      date2.setDate(date2.getDate() -5);
      res = dateTimeHandler.timeDifference(date1, date2);
      assert.equal(res, "\u2245 5 days ago");

      date2 = new Date(time);
      date2.setDate(date2.getDate() -29);
      res = dateTimeHandler.timeDifference(date1, date2);
      assert.equal(res, "\u2245 29 days ago");

      date2 = new Date(time);
      date2.setDate(date2.getDate() -30);
      res = dateTimeHandler.timeDifference(date1, date2);
      assert.equal(res, "\u2245 1 month ago");

      date2 = new Date(time);
      date2.setMonth(date2.getMonth() -11);
      res = dateTimeHandler.timeDifference(date1, date2);
      assert.equal(res, "\u2245 11 months ago");

      date2 = new Date(time);
      date2.setMonth(date2.getMonth() -12);
      res = dateTimeHandler.timeDifference(date1, date2);
      assert.equal(res, "\u2245 1 year ago");
  });
}());
