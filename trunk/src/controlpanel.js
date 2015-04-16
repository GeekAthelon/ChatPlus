/* exported controlPanel */
var controlPanel = (function() {
  "use strict";

  function formatStr() {
    var args = Array.prototype.slice.call(arguments, 0);
    var s = args.shift();
    return stringFormat(s, args);
  }

  var cp_event; // The even that called up the control panel
  var jumpList = {};

  function finishUp(el, html) {
    html.unshift("<h1>Changes won't be seen until the page is reloaded</h1>");
    html.unshift(makeCloseJump(closeControlPanel, '[Click Here to Close]'));
    el.innerHTML = html.join("");
  }

  function getCheckedValue(radioObj) {
    // return the value of the radio button that is checked
    // return an empty string if none are checked, or
    // there are no radio buttons
    if (!radioObj) {
      return "";
    }
    var radioLength = radioObj.length;

    if (!radioLength) {
      if (radioObj.checked) {
        return radioObj.value;
      } else {
        return "";
      }
    }

    for (var i = 0; i < radioLength; i++) {
      if (radioObj[i].checked) {
        return radioObj[i].value;
      }
    }
    return "";
  }

  // set the radio button with the given value as being checked
  // do nothing if there are no radio buttons
  // if the given value does not exist, all the radio buttons
  // are reset to unchecked
  function setCheckedValue(radioObj, newValue) {
    if (!radioObj) {
      return;
    }

    var radioLength = radioObj.length;
    if (!radioLength) {
      radioObj.checked = (radioObj.value === newValue.toString());
      return;
    }
    for (var i = 0; i < radioLength; i++) {
      radioObj[i].checked = false;
      if (radioObj[i].value === newValue.toString()) {
        radioObj[i].checked = true;
      }
    }
  }

  var saveBody;

  function getCpDiv(atTop) {
    var body, e;
    saveBody = document.createDocumentFragment();
    body = document.getElementsByTagName("body")[0];
    while (body.firstChild) {
      e = body.firstChild;
      saveBody.appendChild(e);
    }

    var el = myDom.displayPopupDiv(cp_event, atTop);
    el.style.backgroundImage = "url(http://ssom15.hyperchat.com/images/chatplus/BG-Puzzle.gif)";
    el.className += "chatPlus_popupok controlPanel";
    return el;
  }

  function closeControlPanel() {
    myDom.hidePopupDiv();
    var body = document.getElementsByTagName("body")[0];
    var e;
    while (saveBody.firstChild) {
      e = saveBody.firstChild;
      body.appendChild(e);
    }
  }

  function populateScreen(thisForm, controlNames, obj) {
    var i;
    var a;
    var o;
    var el;

    for (i = 0; i < controlNames.length; i++) {
      a = controlNames[i];
      o = obj[a];
      el = thisForm.elements.namedItem(a);

      if (!o) {
        // Leave the control alone
      } else if (o.push) {
        el.value = o.join("   ");
      } else {
        el.value = o;
      }
    }
  }

  function populateObject(thisForm, controlNames, obj) {
    var i;
    var a;
    var o;
    var el;

    for (i = 0; i < controlNames.length; i++) {
      a = controlNames[i];
      o = obj[a];
      el = thisForm.elements.namedItem(a);

      if (o && o.push) {
        obj[a] = el.value.toLowerCase().split(/\s+/);
      } else {
        obj[a] = el.value;
      }
    }
  }

  function makeCloseJump(func, text) {
    return makeRealJump(func, text, false);
  }

  function makeNoCloseJump(func, text) {
    return makeRealJump(func, text, true);
  }

  function makeRealJump(func, text, toClose) {
    var r;
    var l = text.replace(/ /g, "&nbsp;");
    var className = toClose ? "noclose" : "close";

    jumpList[text] = func;
    r = "<button class='{2}' id='cp_{0}'>{1}</button>";
    r = formatStr(r, text, l, className);
    return r;
  }

  function updateJumps() {
    var key;
    var el;
    var n;

    for (key in jumpList) {
      if (jumpList.hasOwnProperty(key)) {
        n = 'cp_' + key;
        el = document.getElementById(n);
        if (el) {
          addEvent(el, 'click', (function(_el, _key, _event) {
            return function( /*event*/ ) {
              if (_el.className === "noclose") {} else {
                closeControlPanel();
              }
              jumpList[_key](_event);
            };

          }(el, key, cp_event)));
        }
      }
    }
  }

  function makemain(event) {
    cp_event = event;
    jumpList = {};
    var el = getCpDiv(true);

    var html = [];
    html.push('<center>');
    html.push('<h2>ChatPlus Control Center</h2>');
    html.push('</center>');
    html.push('');
    html.push('<hr>');
    html.push('<center>');
    html.push('<table border=5>');
    html.push('');
    html.push('<tr><td>');
    html.push('<h3>Master Settings</h3>');
    html.push('Click the button to order list rooms that should NEVER be seen, regardless of the');
    html.push('realm selected and choose the default layout for some screens.');
    html.push('</td>');
    html.push('<td>');
    html.push('<center>');
    html.push(makeCloseJump(masterControls, 'Master Controls'));
    html.push('</center>');
    html.push('</td></tr>');

    html.push('<tr><td>');
    html.push('<h3>Realm Controls</h3>');
    html.push('Click the button in order to create, delete, and manage your personal realms');
    html.push('</td>');
    html.push('<td>');
    html.push('<center>');
    html.push(makeCloseJump(realmEdit1, 'Realm Controls'));
    html.push('</center>');
    html.push('</td></tr>');

    html.push('<tr><td>');
    html.push('<h3>Realm Order</h3>');
    html.push('Click the button to change the order in which realms are displayed.');
    html.push('</td>');
    html.push('<td>');
    html.push('<center>');
    html.push(makeCloseJump(realmOrder, 'Realm Order'));
    html.push('</center>');
    html.push('</td></tr>');

    html.push('<tr><td>');
    html.push('<h3>Backup and Restore</h3>');
    html.push('Click the button to backup or restore ChatPlus data');
    html.push('</td>');
    html.push('<td>');
    html.push('<center>');
    html.push(makeCloseJump(backupRestoreMenu, 'Backup and Restore'));
    html.push('</center>');
    html.push('</td></tr>');

    html.push('<tr><td>');
    html.push('<h3>Edit Macros</h3>');
    html.push('Click the button to create or edit macros');
    html.push('</td>');
    html.push('<td>');
    html.push('<center>');
    html.push(makeCloseJump(editMacroKeyScreen, 'Edit Macros'));
    html.push('</center>');
    html.push('</td></tr>');

    html.push('</table>');
    html.push('</center>');

    finishUp(el, html);
    updateJumps();
  }

  function masterControls( /*event*/ ) {
    jumpList = {};
    var el = getCpDiv(true);
    var html = [];

    function prepScreen() {
      controlNames = ["hotListView", "showhp", "ulinemode", "alwaysExclude", "userNames", "buddyList"];
      thisForm = document.getElementById('chatPlus_cp_form');
      master = realmList[":masterSettings:"];
      populateScreen(thisForm, controlNames, master);
    }

    function finishData() {
      populateObject(thisForm, controlNames, master);
      saveRealmList();
      closeControlPanel();
    }

    html.push('<h1>ChatPlus Master Controls</h1>');
    html.push('<p>This is the Master Control editor for ChatPlus.</a></p>');
    html.push('<form id="chatPlus_cp_form" onsubmit="return false;" action="#">');
    html.push('  <table border="1">');
    html.push('    <!-- ###################################################################### -->');
    html.push('    <tr>');
    html.push('      <td colspan="2">');
    html.push('        <h2>Your names</h2>');
    html.push('        Since ChatPlus does NOT have access to');
    html.push('        any information from SOI, enter the names you use here.');
    html.push('        <br><em>Names must include the tail</em><br>');
    html.push('        <em>Do not put spaces in names. [Bill Gates] would become billgates@soi</em>');
    html.push('        <br><br><br>');
    html.push('        (If, for security reasons, you choose not to enter this');
    html.push('        information, ChatPlus will still work, but certain features');
    html.push('        may work slightly differently.)');
    html.push('        <center>');
    html.push('          <textarea id="userNames" cols="80" rows="10"></textarea>');
    html.push('        </center>');
    html.push('      </td>');
    html.push('    </tr>');
    html.push('    <!-- ###################################################################### -->');
    html.push('    <tr>');
    html.push('      <td colspan="2">');
    html.push('        <h2>Buddy List</h2>');
    html.push('        The list of nicknames that are on your buddy list.');
    html.push('        Like the nickname list, ');
    html.push('        <br><em>names must include the tail</em><br>');
    html.push('        <em>Do not put spaces in names. [Bill Gates] would become billgates@soi</em>');
    html.push('        <br><br>');
    html.push('        <center>');
    html.push('          <textarea id="buddyList" cols="80" rows="10"></textarea>');
    html.push('        </center>');
    html.push('      </td>');
    html.push('    </tr>');
    html.push('    <!-- ###################################################################### -->');
    html.push('    <tr>');
    html.push('      <td colspan="2">');
    html.push('        <h2>Rooms to never see</h2>');
    html.push('        Any rooms listed here will never show on the new HOT list, regardless of the ');
    html.push('        realm that is selected.');
    html.push('        <center>');
    html.push('          <textarea id="alwaysExclude" cols="80" rows="10"></textarea>');
    html.push('        </center>');
    html.push('      </td>');
    html.push('    </tr>');
    html.push('    <!-- ###################################################################### -->    ');
    html.push('    <tr>');
    html.push('      <td>');
    html.push('        <h2>Host list view</h2>');
    html.push('        Do you want to see the new HOT list with each name separated by');
    html.push('        commas as the old HOT list worked, or do you want to see each name');
    html.push('        on its own line?');
    html.push('      </td>');
    html.push('      <td>');
    html.push('        <select name="hotListView">');
    html.push('          <option value="comma">Separated by commas</option>');
    html.push('          <option value="line">One name per line</option>');
    html.push('        </select>');
    html.push('      </td>');
    html.push('    </tr>');
    html.push('    <!-- ###################################################################### -->');
    html.push('    <tr>');
    html.push('      <td>');
    html.push('        <h2>Show homepage hint</h2>');
    html.push('        In chat rooms, you may click on a name to see their home page or add them');
    html.push('        to your buddy list.  To remind you, an optional ');
    html.push('        <span style="border-bottom-style:dotted;">dashed line</span>');
    html.push('        may be put under the name.');
    html.push('      </td>');
    html.push('      <td>');
    html.push('        <select name="showhp">');
    html.push('          <option value="true">Underline names</option>');
    html.push('          <option value="false">Do not underline names.</option>');
    html.push('        </select>');
    html.push('      </td>');
    html.push('    </tr>');
    html.push('    <!-- ###################################################################### -->');
    html.push('    <tr>');
    html.push('      <td>');
    html.push('      <h2>Force link underlines</h2>');
    html.push('      In some rooms, the room author has choosen to hide the underlines');
    html.push('      that are normally on links or to change the mouse pointer to a');
    html.push('      different shape.');
    html.push('      </td>');
    html.push('      <td>');
    html.push('        <select name="ulinemode">');
    html.push('          <option value="author">Use the room designer choices</option>');
    html.push('          <option value="reset">Make links act normally</option>');
    html.push('        </select>');
    html.push('      </td>');
    html.push('    </tr>');
    html.push('  </table>    ');
    html.push('  <center>');
    html.push(makeNoCloseJump(finishData, 'Save Data'));

    html.push('  </center>');
    html.push('</form>');
    finishUp(el, html);
    updateJumps();

    var controlNames;
    var thisForm;
    var master;

    prepScreen();
  }

  function realmEdit1( /*event*/ ) {
    jumpList = {};
    var thisForm;
    var el = getCpDiv(true);
    var html = [];

    function prepScreen() {
      addEvent(document.getElementById("makeChange"), "click", addDelete);

      var a;
      var div = document.getElementById("realmList");
      var realm;
      var key;

      for (var iii = 0; iii < realmList[":list:"].length; iii++) {
        key = realmList[":list:"][iii];
        realm = realmList[key];
        a = myDom.createATag("#", key);
        addEvent(a, 'click', (function(_key /*, _event*/ ) {
          return function( /*event*/ ) {
            var editDetails = {
              mode: "change",
              realmId: _key
            };
            realmEdit2(editDetails);
          };
        }(key, cp_event)));
        div.appendChild(a);
      }
    }

    html.push('<h1>ChatPlus Realm Editor</h1>');
    html.push('<p>This is the realm editor for ChatPlus.</p>');
    html.push('<form id="chatPlus_cp_form" onsubmit="return false;" action="#">');
    html.push('  <center>');
    html.push('    To create a new Realm, select the Add radio button, enter');
    html.push('    the realm id (2-8 alphanumeric characters) in the text');
    html.push('    box, and press "Make Change". If you wish To delete a');
    html.push('    realm, select the Delete radio button, enter the realm id');
    html.push('    you wish to delete in the text box, and press "Make');
    html.push('    Change".');
    html.push('    <br><br>');
    html.push('    <i>There is no maximum to the number of realms you can create</i>');
    html.push('    <br><br>');
    html.push('    <input type="radio" name="addDelete" id="cp_addDelete1" value="add"> Add');
    html.push('    <input type="radio" name="addDelete" id="cp_addDelete2" value="delete"> Delete');
    html.push('    <input name="realmName" size="20"><br>');
    html.push('    <button name="makeChange" id="makeChange">MakeChange</button>');
    html.push('    <div id="realmList"></div>');
    html.push('  </center>');
    html.push('</form>');

    finishUp(el, html);
    updateJumps();
    prepScreen();

    function addDelete( /*event*/ ) {
      thisForm = document.getElementById('chatPlus_cp_form');

      var hack = []; // namedItem isn't returning an array
      hack[0] = document.getElementById("cp_addDelete1");
      hack[1] = document.getElementById("cp_addDelete2");

      var choice = getCheckedValue(hack);
      var shortName = thisForm.elements.namedItem("realmName").value;

      if (choice === "") {
        alert("You must choose Add or Delete");
        return;
      }

      if (shortName === "") {
        alert("You must enter a realm name.");
        return;
      }

      var editDetails = {
        mode: choice,
        realmId: shortName
      };

      closeControlPanel();
      realmEdit2(editDetails);
    }
  }

  function realmEdit2(editDetails) {
    jumpList = {};
    if (editDetails.event) {
      cp_event = editDetails.event;
    }

    var el = getCpDiv(true);
    var html = [];
    var thisForm;

    function prepScreen() {
      if (mode === "") {
        alert("Mode not specified");
      }

      document.getElementById("step2_idspan").innerHTML = shortName;

      if (mode === 'prompt') {
        document.getElementById("add1").style.display = "none";
        document.getElementById("promptName").style.display = "";
      } else {
        if (mode === 'delete') {
          document.getElementById("editDetails").style.display = "none";
        }
        prepEditScreen(editDetails.realmId, editDetails.mode);
      }
    }

    function doNext( /*event*/ ) {
      shortName = document.getElementById("shortName").value;

      if (!isRealmNameValid(shortName)) {
        alert("The realm name is invalid.");
      } else if (realmList[shortName]) {
        alert("That realm name already exists.");
      } else {
        document.getElementById("add1").style.display = "";
        document.getElementById("promptName").style.display = "none";
        prepEditScreen(shortName, editDetails.mode2);
      }
    }

    function finishData() {
      //var shortName = document.getElementById("step2_idspan").innerHTML;
      var realm = realmList[shortName];
      var i;
      var key;
      var el;

      // And populate the form with basic info
      // Check any realms included
      realm.tailInclude = [];
      realm.tailExclude = [];
      for (key in tailList) {
        if (tailList.hasOwnProperty(key)) {
          el = document.getElementById("cb_include_" + key);
          if (el && el.checked === true) {
            realm.tailInclude.push(key);
          }
          el = document.getElementById("cb_exclude_" + key);
          if (el && el.checked === true) {
            realm.tailExclude.push(key);
          }
        }
      }

      populateObject(thisForm, controlNames, realm);

      if (mode === "delete") {
        delete realmList[shortName];
        i = realmList[":list:"].indexOf(shortName);
        if (i !== -1) {
          realmList[":list:"].splice(i, 1);
        }
      }
      saveRealmList();
      closeControlPanel();
    }

    html.push('<div id="add1">');
    html.push('<form id="chatPlus_cp_form" onsubmit="return false;" action="#">');
    html.push('    <h1 id="modeText"></h1>');
    html.push('    <h2>Controls For Realm ID \'<span id="step2_idspan"></span>\'</h2>');
    html.push('    You will see this name on the Hot List.');
    html.push('    <table border="1" id="editDetails">');
    html.push('      <!-- ###################################################################### -->');
    html.push('      <tr>');
    html.push('        <td colspan="2">');
    html.push('          <h2>Realm Name</h2>');
    html.push('          Please enter the Realm name. The realm name can be a maximum of 40 characters.');
    html.push('          <center>');
    html.push('            <input type="text" length="40" name="fullName">');
    html.push('          </center>');
    html.push('        </td>');
    html.push('      </tr>');
    html.push('      <!-- ###################################################################### -->');
    html.push('      <tr>');
    html.push('        <td>');
    html.push('          <h2>Choose default permission mode</h2>');
    html.push('          Please enter if this realm will list all rooms unless you choose NOT to see ');
    html.push('          them, or if it will show no rooms unless you choose to see them.');
    html.push('        </td>');
    html.push('        <td>');
    html.push('          <select name="defaultMode">');
    html.push('            <option value="include">Start off showing all rooms</option>');
    html.push('            <option value="exclude">Start off hiding all rooms</option>');
    html.push('          </select>');
    html.push('        </td>');
    html.push('      </tr>');
    html.push('      <!-- ###################################################################### -->');
    html.push('      <tr>');
    html.push('        <td>');
    html.push('          <h2>Control Room</h2>');
    html.push('          If this realm was created using the \'Realm\' button within a room, then');
    html.push('          that room will appear here as the control room.  Whenever you visit this');
    html.push('          room, then "Realm Rooms" below will be updated.<br><br>Only rooms that');
    html.push('          use a specific type of drop-down list may be as control rooms.');
    html.push('        </td>');
    html.push('        <td>');
    html.push('          <input type="text" length="12" name="controlRoom" disabled="true">');
    html.push('        </td>');
    html.push('      </tr>');
    html.push('      <!-- ###################################################################### -->');
    html.push('      <tr>');
    html.push('        <td colspan="2">');
    html.push('          <h2>Realm Rooms</h2>');
    html.push('          The rooms included in this realm.  This information is updated');
    html.push('          when you visit the control room for a realm (listed above).');
    html.push('          <center>');
    html.push('            <textarea id="roomList" cols="80" rows="10" disabled="true"></textarea>');
    html.push('          </center>');
    html.push('        </td>');
    html.push('      </tr>');
    html.push('      <!-- ###################################################################### -->');
    html.push('      <tr>');
    html.push('        <td colspan="2">');
    html.push('          <h2>Tails to show</h2>');
    html.push('          If, under default permission mode, you choose "Start off hiding all rooms" you');
    html.push('          may choose certain tails to always show (when you are looking at this realm.');
    html.push('          <br>');
    html.push('          Later on this screen you will have the option of hiding certain rooms ');
    html.push('          regardless of what tails you specify here.');
    html.push('          <div id="include_tails"></div>');
    html.push('        </td>');
    html.push('      </tr>');
    html.push('      <!-- ###################################################################### -->');
    html.push('      <tr>');
    html.push('        <td colspan="2">');
    html.push('          <h2>Tails to hide</h2>');
    html.push('          If, under default permission mode, you choose "Start off showing all rooms" you');
    html.push('          may choose certain tails to always hide (when you are looking at this realm).');
    html.push('          <br>');
    html.push('          Later on this screen you will have the option of showing certain rooms regardless');
    html.push('          of what tails you specify here.');
    html.push('          <div id="exclude_tails"></div>');
    html.push('        </td>');
    html.push('      </tr>');
    html.push('      <!-- ###################################################################### -->');
    html.push('      <tr>');
    html.push('        <td colspan="2">');
    html.push('          <h2>Rooms to show</h2>');
    html.push('          Any rooms listed here will ALWAYS show on the HOT list when they are active.');
    html.push('          (and you are looking at this realm).');
    html.push('          <br><br>');
    html.push('          Don\'t forget to include the room tail.');
    html.push('          <br><br>');
    html.push('          <center>');
    html.push('            <textarea id="roomInclude" cols="80" rows="10"></textarea>');
    html.push('          </center>');
    html.push('          </td>');
    html.push('      </tr>');
    html.push('      <!-- ###################################################################### -->');
    html.push('      <tr>');
    html.push('        <td colspan="2">');
    html.push('          <h2>Rooms to hide</h2>');
    html.push('          Any rooms listed here will NEVER show on the HOT list when they are active');
    html.push('          (and you are looking at this realm).');
    html.push('          <br><br>');
    html.push('          Don\'t forget to include the room tail.');
    html.push('          <br><br>');
    html.push('          <center>');
    html.push('            <textarea id="roomExclude" cols="80" rows="10"></textarea>');
    html.push('          </center>');
    html.push('        </td>');
    html.push('      </tr>');
    html.push('      <!-- ###################################################################### -->');
    html.push('      <!-- ###################################################################### -->');
    html.push('      <tr>');
    html.push('        <td>');
    html.push('          <h2>Hide realm rooms</h2>');
    html.push('          If, in this realm, you do not want to see rooms that are a part of any');
    html.push('          other realm, choose yes. IF you are unsure of what this means, choose');
    html.push('          "no."');
    html.push('          <br><br>');
    html.push('          This option is useful if you wish to set up a realm for ');
    html.push('          "unclaimed" rooms, allowing you to filter out any rooms that are owned');
    html.push('          by a role-playing realm.  Most of the time, this should be \'no.\'');
    html.push('        </td>');
    html.push('        <td>');
    html.push('          <select name="excludeRealmRooms">');
    html.push('            <option value="no">Show all rooms</option>');
    html.push('            <option value="yes">Hide rooms that belong to a realm</option>');
    html.push('          </select>');
    html.push('        </td>');
    html.push('      </tr>');
    html.push('    </table>');
    html.push('    <center>');
    html.push(makeNoCloseJump(finishData, 'Save Data'));
    html.push('    </center>');
    html.push('  </form>');
    html.push('</div> <!-- add1 -->');
    html.push('  ');
    html.push('<div id="promptName" style="display:none;">');
    html.push('  <form name="promptForm" onsubmit="return false;" action="#">');
    html.push('    <h2>Enter the name for the new realm</h2>');
    html.push('    <table border="1" id="editDetails">');
    html.push('    <!-- ###################################################################### -->');
    html.push('      <tr>');
    html.push('        <td colspan="2">');
    html.push('          <h2>Realm Name</h2>');
    html.push('          Please enter the Realm name. This short name can be between two and eight alphanumeric characters.');
    html.push('          <center>');
    html.push('            <input type="text" length="40" id="shortName" name="shortName">');
    html.push('          </center>');
    html.push('        </td>');
    html.push('      </tr>');
    html.push('    </table>');
    html.push('    <button id="cp_continue">Continue</button>');
    html.push('  </form>');
    html.push('</div><!-- promptName -->');
    finishUp(el, html);
    updateJumps();
    thisForm = document.getElementById('chatPlus_cp_form');

    var continueEl = document.getElementById('cp_continue');
    addEvent(continueEl, 'click', doNext);

    var mode = editDetails.mode;
    var shortName = editDetails.realmId;
    var controlNames = ["fullName", "defaultMode", "roomInclude", "roomExclude", "controlRoom", "roomList", "excludeRealmRooms"];
    prepScreen();

    function makeCheckBox(label, value, name) {
      var box = document.createElement('div');
      var checkbox = document.createElement('input');

      //var text = label.replace(/ /g,"\u00a0"); // non-breaking space
      checkbox.type = 'checkbox';
      checkbox.name = name;
      checkbox.id = name;
      checkbox.defaultModeChecked = false;
      checkbox.value = value;

      box.appendChild(document.createTextNode(label + ":"));
      box.appendChild(checkbox);
      box.appendChild(document.createTextNode(" \u00a0 "));
      return box;
    }

    function prepTails() {
      var key;
      var tail;
      var box;

      for (key in tailList) {
        if (tailList.hasOwnProperty(key)) {
          tail = tailList[key];
          box = makeCheckBox(tail.name, key, "cb_include_" + key);
          document.getElementById("include_tails").appendChild(box);
          box = makeCheckBox(tail.name, key, "cb_exclude_" + key);
          document.getElementById("exclude_tails").appendChild(box);
        }
      }
    }

    function prepEditScreen(shortName, mode) {
      var realm = realmList[shortName];
      var tail;
      var i;

      switch (mode) {
        case "add":
        case "add2":
          document.getElementById("modeText").appendChild(document.createTextNode("Adding"));
          break;
        case "change":
          document.getElementById("modeText").appendChild(document.createTextNode("Changing"));
          break;
        case "delete":
          document.getElementById("modeText").appendChild(document.createTextNode("Deleting! " + " MUST CLICK CHANGE REALM BUTTON TO CONFIRM"));
          break;
      }

      if (mode === "add" || mode === "add2") {
        realm = JSON.parse(JSON.stringify(newRealm));
        realmList[shortName] = realm;
      }
      if (mode === "add2") {
        realm.defaultMode = "exclude";
        realm.roomList = editDetails.roomList;
        realm.controlRoom = editDetails.controlRoom;
      }

      prepTails();

      if (realm === undefined) {
        alert("Realm is undefined");
        return;
      }

      // Fill in the title
      document.getElementById("step2_idspan").innerHTML = shortName;

      // Check any realms included
      if (realm.tailInclude) {
        for (i = 0; i < realm.tailInclude.length; i++) {
          tail = realm.tailInclude[i];
          document.getElementById("cb_include_" + tail).checked = true;
        }
      }

      // Check any realms excluded
      if (realm.tailExclude) {
        for (i = 0; i < realm.tailExclude.length; i++) {
          tail = realm.tailExclude[i];
          document.getElementById("cb_exclude_" + tail).checked = true;
        }
      }

      populateScreen(thisForm, controlNames, realm);
    }
  }

  function realmOrder( /*event*/ ) {
    jumpList = {};
    var el = getCpDiv(true);
    var html = [];

    function finishData() {
      saveRealmList();
      closeControlPanel();
    }

    function prepScreen() {
      var key;
      var realm;

      var tbody = document.getElementById("tbody");
      tbody.innerHTML = "";

      var tr, td, a;
      var len = realmList[":list:"].length;

      for (var iii = 0; iii < len; iii++) {
        key = realmList[":list:"][iii];
        realm = realmList[key];

        tr = myDom.createTag("tr");

        td = myDom.createTag("td", "");
        a = makeMoveLink("up", iii, -1);
        td.appendChild(a);

        if (iii === 0) {
          a.disabled = true;
        }

        a = makeMoveLink("down", iii, +1);
        td.appendChild(a);

        if (iii === len - 1) {
          a.disabled = true;
        }

        tr.appendChild(td);

        td = myDom.createTag("td", key);
        tr.appendChild(td);

        td = myDom.createTag("td", realm.fullName);
        tr.appendChild(td);

        tbody.appendChild(tr);
      }
    }

    html.push('<h1>ChatPlus Realm Order</h1>');
    html.push('');
    html.push('<p>Use the up and down buttons to rearrange the realms.  This is the order');
    html.push('they will be displayed on the HOT list.</p>');
    html.push('  ');
    html.push('<table border="1">');
    html.push('  <thead>');
    html.push('    <tr>');
    html.push('      <td>Move</td>');
    html.push('	     <td>Realm</td>');
    html.push('	     <td>Long name</td>');
    html.push('    </tr>');
    html.push('  </thead>');
    html.push('  <tbody id="tbody">');
    html.push('  </tbody>');
    html.push('</table>');
    html.push('  ');
    html.push('<center>');
    html.push(makeNoCloseJump(finishData, 'Save Data'));
    html.push('</center>');

    finishUp(el, html);
    updateJumps();
    prepScreen();

    function doSwapClick(event, idx, delta) {
      var a = realmList[":list:"];

      /* Do the swap */
      var t1 = a[idx];
      var t2 = a[idx + delta];
      a[idx + delta] = t1;
      a[idx] = t2;

      prepScreen();
      if (event.preventDefault) {
        event.preventDefault();
      }
      event.cancelBubble = true;
      return true;
    }

    function makeMoveLink(str, idx, delta) {
      var a;

      a = myDom.createTag("Button", str);
      a.title = "Move " + str;

      addEvent(a, 'click', function(i, d) {
        return function(event) {
          doSwapClick(event, i, d);
        };
      }(idx, delta));
      return a;
    }
  }

  function backupRestoreMenu( /*event*/ ) {
    jumpList = {};
    var el = getCpDiv(true);
    var html = [];

    html.push('<center>');
    html.push('  <h2>ChatPlus Backup and Restore</h2>');
    html.push('</center>');
    html.push('');
    html.push('<hr>');
    html.push('<center>');
    html.push('  <table border=5>');
    html.push('    <tr>');
    html.push('      <td>');
    html.push('        <h3>ChatPlus Backup</h3>');
    html.push('        Click the button to back up ChatPlus data.');
    html.push('      </td>');
    html.push('      <td>');
    html.push('        <center>');
    html.push(makeCloseJump(makeBackup, 'Create Backup'));
    html.push('        </center>');
    html.push('      </td>');
    html.push('    </tr>');
    html.push('    <tr>');
    html.push('      <td>');
    html.push('        <h3>ChatPlus Restore</h3>');
    html.push('        Click the button to Restore ChatPlus data');
    html.push('      </td>');
    html.push('      <td>');
    html.push('        <center>');
    html.push(makeCloseJump(makeRestore, 'Restore a Backup'));
    html.push('        </center>');
    html.push('      </td>');
    html.push('    </tr>');
    html.push('  </table>');
    html.push('</center>');

    finishUp(el, html);
    updateJumps();
  }

  function makeBackup() {
    jumpList = {};
    var el = getCpDiv(true);
    var html = [];
    var thisForm;

    html.push('<h1>ChatPlus Backup Data</h1>');
    html.push('<form id="chatPlus_cp_form" onsubmit="return false;" action="#">');
    html.push('  <table border="1" width="80%">');
    html.push('    <tr>');
    html.push('      <td>');
    html.push('        <h2>Backup Data</h2>');
    html.push('        <p>');
    html.push('          Because of security reasons, ChatPlus is <strong>not</strong> able to');
    html.push('          read or write to any files on your local computer.  In order to save your');
    html.push('          data, you will need to cut-and-paste from the box below into <strong>notepad</strong>');
    html.push('          or a similar program and save it that way.');
    html.push('        </p>');
    html.push('        <br><br>');
    html.push('        <p>I do apologize for the inconvenience of it.</p>');
    html.push('        <center>');
    html.push('          <textarea id="backup" cols="80" rows="20"></textarea>');
    html.push('        </center>');
    html.push('      </td>');
    html.push('    </tr>');
    html.push('  </table>');
    html.push('</form>');

    finishUp(el, html);
    updateJumps();
    thisForm = document.getElementById('chatPlus_cp_form');
    thisForm.elements.namedItem('backup').value = JSON.stringify(realmList, undefined, 2);
  }

  function makeRestore() {
    jumpList = {};
    var el = getCpDiv(true);
    var html = [];
    var thisForm;

    function finishData() {
      try {
        thisForm = document.getElementById('chatPlus_cp_form');
        realmList = JSON.parse(thisForm.elements.namedItem('backup').value);
        saveRealmList();
        closeControlPanel();
      } catch (err) {
        alert("Unable to restore data: Err = " + err);
      }
    }

    html.push('<h1>ChatPlus Restore Data</h1>');
    html.push('<form id="chatPlus_cp_form" onsubmit="return false;" action="#">');
    html.push('  <table border="1" width="80%">');
    html.push('    <tr>');
    html.push('      <td>');
    html.push('        <h2>Restore Data</h2>');
    html.push('        <p>');
    html.push('          Please cut-and-paste the backed up data into the box below and press');
    html.push('          the button.');
    html.push('        </p>');
    html.push('        <br>');
    html.push('        <center>');
    html.push('          <textarea id="backup" cols="80" rows="20"></textarea>');
    html.push('        </center>');
    html.push('      </td>');
    html.push('    </tr>');
    html.push('  </table>');
    html.push('  <center>');
    html.push(makeNoCloseJump(finishData, 'Save Data'));
    html.push('  </center>');
    html.push('</form>');

    finishUp(el, html);
    updateJumps();
  }

  function addRoomToRealm(event, data) {
    jumpList = {};
    cp_event = event;

    var el = getCpDiv(true);
    var html = [];
    var thisForm;

    function prepScreen() {
      var key, realm;
      var option;

      if (!data) {
        alert("Somehow, no data was available.");
        return;
      }

      document.getElementById("sRoomName").appendChild(
        document.createTextNode("Add Room " + data.roomName + " to Realm")
      );
      for (var iii = 0; iii < realmList[":list:"].length; iii++) {
        key = realmList[":list:"][iii];
        realm = realmList[key];

        option = myDom.createTag("option", realm.fullName);
        option.setAttribute('value', key);
        option.selected = key === data.realmName;
        document.getElementById("realmSelect").appendChild(option);
      }
    }

    function finishData() {
      var realm = realmList[thisForm.elements.namedItem("realmSelect").value];
      realm.roomInclude.push(data.roomName);

      var idx = realm.roomExclude.indexOf(data.roomName);
      if (idx !== -1) {
        delete realm.roomExclude[idx];
      }
      saveRealmList();
      closeControlPanel();
    }

    html.push('<h1>ChatPlus Add Room to Realm</h1>');
    html.push('<p>This is the realm editor for ChatPlus.</p>');
    html.push('<form id="chatPlus_cp_form" onsubmit="return false;" action="#">');
    html.push('  <table border="1">');
    html.push('    <tr>');
    html.push('      <td>');
    html.push('        <h2 id="sRoomName"></h2>');
    html.push('        This room will be added as part of the realm and will always');
    html.push('        be shown in that realm list when it is active.');
    html.push('        <br>');
    html.push('        <select name="realmSelect" id="realmSelect">');
    html.push('        </select>');
    html.push('      </td>');
    html.push('    </tr>');
    html.push('  </table>');
    html.push('  <center>');
    html.push(makeNoCloseJump(finishData, 'Save Data'));
    html.push('  </center>');
    html.push('</form>');

    finishUp(el, html);
    updateJumps();
    thisForm = document.getElementById('chatPlus_cp_form');
    prepScreen();
  }

  function removeRoomfromRealm(event, data) {
    jumpList = {};
    cp_event = event;

    var el = getCpDiv(true);
    var html = [];
    var thisForm;

    function finishData() {
      var realm = realmList[thisForm.elements.namedItem("realmSelect").value];
      var idx;
      var master = realmList[":masterSettings:"];

      if (thisForm.elements.namedItem("realmSelect").value === "***") {
        master.alwaysExclude.push(data.roomName);
      } else {
        idx = realm.roomInclude.indexOf(data.roomName);
        if (idx !== -1) {
          realm.roomInclude.splice(idx, 1);

        }
        realm.roomExclude.push(data.roomName);
      }
      saveRealmList();
      closeControlPanel();
    }

    function prepScreen() {
      var key, realm;
      var option;

      if (!data) {
        alert("Somehow, no data was available.");
        return;
      }

      option = myDom.createTag("option", "*** EVERWHERE ***");
      option.setAttribute('value', "***");
      document.getElementById("realmSelect").appendChild(option);

      document.getElementById("sRoomName").appendChild(
        document.createTextNode("Remove Room " + data.roomName + " from Realm or Everywhere"));
      for (var iii = 0; iii < realmList[":list:"].length; iii++) {
        key = realmList[":list:"][iii];
        realm = realmList[key];

        option = myDom.createTag("option", realm.fullName);
        option.setAttribute('value', key);
        option.selected = key === data.realmName;
        document.getElementById("realmSelect").appendChild(option);
      }
    }

    html.push('<h1>ChatPlus Add Room to Realm</h1>');
    html.push('<p>This is the realm editor for ChatPlus.</p>');
    html.push('<form id="chatPlus_cp_form" onsubmit="return false;" action="#">');
    html.push('  <table border="1">');
    html.push('    <tr>');
    html.push('      <td>');
    html.push('        <h2 id="sRoomName"></h2>');
    html.push('        This room will be removed from the realm or everwhere.');
    html.push('        <br><br>');
    html.push('        If you change your mind later, choose<br>');
    html.push('        [ChatPlus Controls]<br>');
    html.push('        [Realm Controls]<br>');
    html.push('        <i>The name of the realm</i><br>');
    html.push('        Rooms to Hide<br><br>');
    html.push('');
    html.push('        And remove the room from that list.');
    html.push('        <br><br>');
    html.push('        If you removed it from EVERYWHERE<br>');
    html.push('        [ChatPlus Controls]<br>');
    html.push('        [Master Controls]<br>');
    html.push('        Rooms to never see<br><br>');
    html.push('        <center>      ');
    html.push('          <select name="realmSelect" id="realmSelect">');
    html.push('          </select>');
    html.push('         </center>');
    html.push('       </td>');
    html.push('    </tr>');
    html.push('  </table>');
    html.push('  <center>');
    html.push(makeNoCloseJump(finishData, 'Save Data'));
    html.push('  </center>');
    html.push('</form>');

    finishUp(el, html);
    updateJumps();
    thisForm = document.getElementById('chatPlus_cp_form');
    prepScreen();
  }

  function addAvatar(event, data) {
    jumpList = {};
    cp_event = event;

    var el = getCpDiv(true);
    var html = [];
    var thisForm;

    function prepScreen() {
      var img = document.getElementById("avaimg");
      // Go into a busy wait for the image to load.
      if (!img.complete) {
        setTimeout(prepScreen, 100);
        return;
      }

      document.getElementById('cp_control_hidefinish').style.display = "";
      document.getElementById('cp_control_showwait').style.display = "none";

      thisForm.elements.namedItem("real_width").value = img.width;
      thisForm.elements.namedItem("real_height").value = img.height;

      thisForm.elements.namedItem("a_width").value = img.width;
      thisForm.elements.namedItem("a_height").value = img.height;
    }

    function finishData() {
      var alist = realmList[":avatars:"];
      var nick = data.nick;
      var sname = data.sname;
      var p;

      alist[nick][sname] = {};
      p = alist[nick][sname];
      p.height = +thisForm.elements.namedItem("a_height").value;
      p.width = +thisForm.elements.namedItem("a_width").value;
      p.url = data.fname;
      saveRealmList();
      closeControlPanel();
    }

    html.push('<h1>ChatPlus: Add Avatar</h1>');
    html.push('<form id="chatPlus_cp_form" onsubmit="return false;" action="#">');
    html.push('  <center>');
    html.push('    <h2>Actual image size</h2>');
    html.push('    <label>Avatar Real Width: </label>');
    html.push('    <input name="real_width" size="5" readonly>');
    html.push('    <label>Avatar Real Height: </label>');
    html.push('    <input name="real_height" size="5" readonly>');
    html.push('    <br>');
    html.push('    <h2>Enter image size</h2>');
    html.push('    <label>Avatar Width(1-120):</label>');
    html.push('    <input name="a_width" size="5">');
    html.push('    <label>Avatar Height(1-150): </label>');
    html.push('    <input name="a_height" size="5">');
    html.push('    <br>');
    html.push('    <img src="' + data.fname + '" id="avaimg">');
    html.push('    <br>');
    html.push('    <div id="cp_control_hidefinish" style="display:none">');
    html.push(makeCloseJump(finishData, 'Save Avatar To List'));
    html.push('    </div>');
    html.push('    <div id="cp_control_showwait">');
    html.push('      <strong>Waiting for image to load</strong>');
    html.push('    </div>');
    html.push('  </center>');
    html.push('</form>');

    finishUp(el, html);
    updateJumps();
    thisForm = document.getElementById('chatPlus_cp_form');
    prepScreen();
  }

  function removeAvatar(event, data) {
    jumpList = {};
    cp_event = event;

    var el = getCpDiv(true);
    var html = [];
    var thisForm;

    function finishData() {
      delete realmList[":avatars:"][data.nick][data.sname];
      saveRealmList();
      closeControlPanel();
    }

    html.push('<h1>ChatPlus: Remove Avatar</h1>');
    html.push('<form id="chatPlus_cp_form" onsubmit="return false;" action="#">');
    html.push('  <center>');
    html.push('    <img src="' + data.fname + '" id="avaimg">');
    html.push('     <br>');
    html.push(makeCloseJump(finishData, 'Remove Avatar'));
    html.push('  </center>');
    html.push('</form>');

    finishUp(el, html);
    updateJumps();
    thisForm = document.getElementById('chatPlus_cp_form');
  }

  function editMacroKeyScreen() {
    jumpList = {};
    var el = getCpDiv(true);
    var html = [];
    var macro_list = realmList[":macros:"];
    var m_details;
    var s;

    var i, l = $$_MACRO_KEY_LIST.length;
    var key;

    function makeUpdateFunction(ta_el, div_el) {
      return function() {
        div_el.innerHTML = ta_el.value;
      };
    }

    function attachEvents() {
      var i, l = $$_MACRO_KEY_LIST.length;
      var key;
      var ta_el;
      var div_el;
      var f;

      for (i = 0; i < l; i++) {
        key = $$_MACRO_KEY_LIST[i];
        ta_el = document.getElementById("ta_" + key);
        div_el = document.getElementById("div_" + key);
        f = makeUpdateFunction(ta_el, div_el);

        addEvent(el, 'change', f);
        addEvent(el, 'blur', f);
        addEvent(el, 'keyup', f);
      }
    }

    function finishData() {
      var i, l = $$_MACRO_KEY_LIST.length;
      var key;
      var ta_el;
      var name_el;
      var macro_list = {};

      for (i = 0; i < l; i++) {
        key = $$_MACRO_KEY_LIST[i];
        ta_el = document.getElementById("ta_" + key);
        name_el = document.getElementById("name_" + key);

        m_details = {};
        m_details.key = key;
        m_details.value = ta_el.value;
        m_details.name = name_el.value;

        macro_list[key] = m_details;
      }
      realmList[":macros:"] = macro_list;

      saveRealmList();
      closeControlPanel();
    }

    html.push('<h1>ChatPlus Create Macros</h1>');

    html.push('<p>');
    html.push('Not all macro-key combos are available in all browsers,');
    html.push('Hold down SHIFT,  and then the number of macro you');
    html.push('wish to test.  If the short cut doesn\'t work, you may still');
    html.push('use the macro by clicking on the macro name in the room chat.');
    html.push('</p>');

    html.push('<p>');
    html.push('This feature is still being written.  DO NOT USE the <strong>enter</strong> ');
    html.push('key when making macros.  It won\'t work.  In the future, it will be entirely ');
    html.push('disabled.');
    html.push('</p>');

    html.push('<form id="chatPlus_cp_form" onsubmit="return false;" action="#">');
    html.push('  <table border="1" width="80%">');
    html.push('    <tr>');
    html.push('      <td width="10%">');
    html.push('        Key Stroke');
    html.push('      </td>');
    html.push('      <td width="30%">');
    html.push('        Name');
    html.push('      </td>');
    html.push('      <td width="30%">');
    html.push('        Value');
    html.push('      </td>');
    html.push('      <td width="30%">');
    html.push('        Shows as');
    html.push('      </td>');
    html.push('    </tr>');

    for (i = 0; i < l; i++) {
      key = $$_MACRO_KEY_LIST[i];
      m_details = macro_list[key];

      if (!m_details) {
        m_details = {};
        m_details.key = key;
        m_details.value = "";
        m_details.name = "";
      }

      html.push('    <tr>');
      html.push('      <td>');
      html.push(m_details.key);
      html.push('      </td>');

      html.push('      <td>');

      s = '<div style="font-size:75%" ">Press SHIFT-CONTROL-{0} to test';
      s = formatStr(s, m_details.key);
      html.push(s);
      s = '<span id="test_{0}">&nbsp;</span>';
      s = formatStr(s, m_details.key);
      html.push(s);
      s = '</div>';
      html.push(s);

      var f = (function(_key) {
        return function( /*event*/ ) {
          document.getElementById("test_" + _key).innerHTML = _key + " *PASSED*";
        };
      }(m_details.key));

      s = "Ctrl+Shift+" + m_details.key;
      shortcut.add(s, f);

      s = '<input id="name_{0}" name="name_{0}" value="{1}">';
      s = formatStr(s, m_details.key, m_details.name);
      html.push(s);
      html.push('      </td>');

      html.push('      <td>');
      s = '<textarea name="ta_{0}" id="ta_{0}">{1}</textarea>';
      s = formatStr(s, m_details.key, m_details.value);
      html.push(s);
      html.push('      </td>');

      html.push('      <td>');
      s = '<div id="div_{0}">{1}</div>';
      s = formatStr(s, m_details.key, m_details.value);
      html.push(s);
      html.push('      </td>');

      html.push('    </tr>');
    }

    html.push('  </table>');
    html.push('  <center>');
    html.push(makeNoCloseJump(finishData, 'Save Data'));
    html.push('  </center>');
    html.push('</form>');

    finishUp(el, html);

    updateJumps();
    attachEvents();
  }

  return {
    main: makemain,
    addRoomToRealm: addRoomToRealm,
    removeRoomfromRealm: removeRoomfromRealm,
    realmEdit2: realmEdit2,
    addAvatar: addAvatar,
    removeAvatar: removeAvatar
  };

}());