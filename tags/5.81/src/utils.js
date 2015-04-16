"use strict";

//NOTEST
if (typeof GM_setValue === "function") {
  gmGetValue = function (p1, p2) {
    var r = GM_getValue(p1, JSON.stringify(p2));
    r = JSON.parse(r);
    return r;
  };

  gmSetValue = function (p1, p2) {
    var v = JSON.stringify(p2);
    GM_setValue(p1, v);
  };

}

//TESTED
function getNumberOfElementsByName(doc, n) {
  var e = doc.getElementsByName(n);
  return e.length;
}

/////////////////////////////////////////////////////////////////////////
//TESTED
function isRealmNameValid(n) {
  n = n.toLowerCase();
  var o = n.replace(/[^a-zA-Z0-9]+/g, '');

  if (n.length < 2) {
    return false;
  }
  if (n.length > 8) {
    return false;
  }
  if (o !== n) {
    return false;
  }
  return true;
}

//TESTED
function highlightIfBuddy(el, s) {
  var n = normalizeName(s);
  if (n.indexOf("@") === -1) {
    n += "@" + soiDetails.blankTail;
  }			  
  
  if (realmList[":masterSettings:"]["buddyList"].indexOf(n) !== -1)  {
    el.className += " onlineBuddy";
  }
}


function makeCommandPanel(newel) {
  var p = myDom.createTag("p", newel);
  var div = myDom.createTag("div", p);
  return div;
}

//TESTED
function getTail(s) {
  // Get the tail of a room like "z2@soi" and return "soi"
  var i = s.lastIndexOf("@");
  if (i === -1) {
    return soiDetails.blankTail;
  } else {
    return s.substr(i + 1, s.length);
  }
}

//TESTED
function normalizeName(n) {
  // Should this filter out the '@'?
  // Right now, code relies on that happening.
  n = n.toLowerCase();
  n = n.replace(/[^a-zA-Z0-9]+/g, '');
  return n;
}

function getKnownTails() {
  var site;
  var list = [];
  for (site in tailList) {
    list.push(site);
  }
  return list;
}
allKnownTails = getKnownTails();

//TESTED
function extractNameInfo(nameElement, defaultTail) {
  var ninfo = {};  
  var p;
  var bits;
  var tail;
  
  ninfo.decoratedName = myDom.getText(nameElement);

  // See if there is anything that might be a tail, if so,
  // grab the last one.
  bits = ninfo.decoratedName.split('@');
  if (bits) {
    tail = bits.pop(); // Get the last one.
	if (allKnownTails.indexOf(tail) === -1) {
	  tail = null;
	}
  }
  
  if (tail) {
    ninfo.tail = tail;    
    p = new RegExp(ninfo.tail + "$", "");
    ninfo.nameNoTail = ninfo.decoratedName.replace(p, "");
  } else {
    ninfo.nameNoTail = ninfo.decoratedName;
    ninfo.tail = defaultTail;
  }

  ninfo.soiStyleName = normalizeName(ninfo.nameNoTail);
  ninfo.fullSoiStyleName = ninfo.soiStyleName + "@" + ninfo.tail;
  nameList[ninfo.decoratedName] = ninfo;

  elementIndex.element.push(nameElement);
  elementIndex.name.push(ninfo.decoratedName);
  return ninfo;
}

//TESTED
function makeRoomLink(txt, url) {
  var data, dataLine, dataArray, s;
  var a;

  function setPropertyFromDom(o, form, prop) {
    var v;
	
	var el = form.elements.namedItem(prop);
		
	if (el.length) {
      v = el[0].value;
	} else {
      v = el.value;
	}
		
    o[prop] = v;
  }

  data = {};

  setPropertyFromDom(data, soiDetails.formFind, "vqxus"); // Last name chatted under
  setPropertyFromDom(data, soiDetails.formFind, "vqxha"); // Last name chatted under
  setPropertyFromDom(data, soiDetails.formFind, "roomsite"); // Tail of the room we are in
  setPropertyFromDom(data, soiDetails.formFind, "vqxti"); // time stamp
  setPropertyFromDom(data, soiDetails.formFind, "vqvak"); // Find button
  data["vqxfi"] = document.getElementsByName("vqxro")[0].value; // Name of the room we are in
  dataArray = [];

  for (var item in data) {
    if (data.hasOwnProperty(item)) {
      dataArray.push(item + "=" + data[item]);
    }
  }

  dataArray.push("chatplus_homepage", "true");
  dataLine = dataArray.join("&");
  s = url + "#" + dataLine;
  a = myDom.createATag(s, txt);
  return a;
}

//NOTEST
function loadBigOld(slotName) {
  var len = GM_getValue(slotName);
  var s = "";
  var s1;
  for (var i = 0; i < len; i++) {
    s1 = GM_getValue(slotName + "_" + i);
    s += s1;
  }
  s = s.replace(/#QUOTE#/g, '"');
  s = unescape(s);
  return s;
}

//NOTEST
function purgeBigOld(slotName) {
  function killit(key) {
    GM_setValue(key, "-");
    if (typeof GM_deleteValue === "function") {
      GM_deleteValue(key);
    }
  }
  var len = GM_getValue(slotName);
  killit(slotName);
  var key;
  for (var i = 0; i < len; i++) {
    key = slotName + "_" + i;
    killit(key);
  }
}


//NOTEST
// Save the realmList in only one place so we can easily add a debugging
// point and see what is getting written.
function saveRealmList() {
  gmSetValue("realmList2", realmList);
}

//NOTEST
function getRealmList() {
  var s;
  var s2;
  s = gmGetValue("realmList2", null);
  if (s) {
    return s;
  }

  s = defaultRealmList;
  // Check for old (2.x) saved data
  if (typeof GM_getValue === 'function') {
    s2 = GM_getValue('rList', "-");
    if (s2 !== "-") {
      s2 = loadBigOld('rList');
      //purgeBigOld('rList');
      s = JSON.parse(s2);
    }
  }
  return s;
}

//TESTED
var isArray = function (v) {
    return v && typeof v === "object" && typeof v.length === "number" && typeof v.splice === "function" && !(v.propertyIsEnumerable("length"));
  };

  //TESTED
function makePlayerHomePageUrl(name, tail) {
  var url;
  var aTag;
  var site;

  site = tailList[tail];
  if (!site) {
    aTag = myDom.createTag("span", "unknown tail: " + tail);
  } else {
    url = site.userBase;
    url = url.replace("!!!", name) + "homepage.html";
    aTag = makeRoomLink("Home Page", url);

    aTag.title = "See homepage.";
  }
  //aTag.className = "subtle";
  return aTag;
}

//TESTED
function objectToUrlArray(data) {
  var fullData = [];
  var i;
  for (i in data) {
    if (data.hasOwnProperty(i)) {
      fullData.push([i, '=', data[i]].join(""));
    }
  }
  return fullData;
}

//TESTED
function urlencode(str) {
  return encodeURIComponent(str).replace(/%20/g, '+').replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29');
  // replace(/\*/g, '%2A');
}

//DEFERRED
var serializeFormUrlencoded = function (f) {
    var e, // form element
    n, // form element's name
    t, // form element's type
    o, // option element
    es = f.elements,
      c1 = {},
      c = []; // the serialization data parts
    function add(n, v) {
      c[c.length] = urlencode(n) + "=" + urlencode(v);
      c1[urlencode(n)] = urlencode(v);
    }

    for (var i = 0, ilen = es.length; i < ilen; i++) {
      e = es[i];
      n = e.name;
      if (n && !e.disabled) {
        t = e.type;
        if (t.match(/^select/)) {
          // The 'select-one' case could reuse 'select-multiple' case
          // The 'select-one' case code is an optimization for
          // serialization processing time.
          if (t === 'select-one' || (t === 'select' && !t.multiple)) {
            if (e.selectedIndex >= 0) {
              add(n, getOptionValue(e.options[e.selectedIndex]));
            }
          } else {
            for (var j = 0, jlen = e.options.length; j < jlen; j++) {
              o = e.options[j];
              if (o.selected) {
                add(n, getOptionValue(o));
              }
            }
          }
        } else if (t.match(/^checkbox|radio$/)) {
          if (e.checked) {
            add(n, e.value);
          }
        } else if (t.match(/^text|password|hidden|textarea$/)) {
          add(n, e.value);
        }
      }
    }
    return c1;
    //return c.join('&');
  };

//TESTED
function getRefreshMeta() {
  var meta = document.querySelector('meta[http-equiv="refresh"]');
  if (meta) {
    return meta.getAttribute('CONTENT');
  }
  return null;
}

//TESTED
function fixFormAction(form) {
  var i;
  var action = form.action;

  // Ok, the mailForm action doesn't give the full address.  We can fix that.
  if (action.toLowerCase().indexOf("http") !== 0) {
    // Absolute path given
    if (action.charAt(0) === "/") {
      i = userWindow.location.href.indexOf("/", 9);
      action = userWindow.location.href.substring(0, i) + form.action;
    } else {
      i = userWindow.location.href.lastIndexOf("/");
      action = userWindow.location.href.substring(0, i + 1) + form.action;
    }
  }

  // Ok, this is a cheap and horrible hack, but it seems that IE7Pro
  // wants to encode the url, which is just plain wrong.  it looks like
  // none of the sister sites require anything past the address, so
  // we'll just trim off that which causes trouble.
  i = userWindow.location.href.lastIndexOf("#");
  if (i !== -1) {
    action = action.substring(0, i);
  }
  i = userWindow.location.href.lastIndexOf("?");
  if (i !== -1) {
    action = action.substring(0, i);
  }

  return action;
}



function trace(lvl, loc) {
  if (1) {
    return;
  } else {
    var d = document.getElementById("traceDiv");
    var div = document.createElement("div");
    // Cross platform method of tracing.  Messy, but it works in IE and Firefox.
    // Though its slow, it is able to hold more data than the console or normal
    // debugging log.
    //if (lvl < -10) { return; }
    if (!d) {
      d = document.createElement("div");
      d.id = "traceDiv";
      d.innerHTML = "<pre>" + d + "</pre>";
      //d.style.font = "monospace";
      document.body.appendChild(d);
    }
    //d.innerHTML = loc;
    //return;
    div.appendChild(document.createTextNode(loc));
    d.appendChild(div);
  }
}

//TESTED
function trim(str) {
  return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

// written by Dean Edwards, 2005
// with input from Tino Zijdel, Matthias Miller, Diego Perini
// http://dean.edwards.name/weblog/2005/10/add-event/
function addEvent(element, type, handler) {
  if (type == "ready") {
    setTimeout(handler, 1);
    return;
  }

  if (element.addEventListener) {
    var h = function(event) {
	  handler(event);
      event.preventDefault = true;
      event.stopPropagation = true; 
	}
    element.addEventListener(type, h, false);
  } else {
    // assign each event handler a unique ID
    if (!handler.$$guid) handler.$$guid = addEvent.guid++;
    // create a hash table of event types for the element
    if (!element.events) element.events = {};
    // create a hash table of event handlers for each element/event pair
    var handlers = element.events[type];
    if (!handlers) {
      handlers = element.events[type] = {};
      // store the existing event handler (if there is one)
      if (element["on" + type]) {
        handlers[0] = element["on" + type];
      }
    }
    // store the event handler in the hash table
    handlers[handler.$$guid] = handler;
    // assign a global event handler to do all the work
    element["on" + type] = handleEvent;
  }
};
// a counter used to create unique IDs
addEvent.guid = 1;

function removeEvent(element, type, handler) {
  if (element.removeEventListener) {
    element.removeEventListener(type, handler, false);
  } else {
    // delete the event handler from the hash table
    if (element.events && element.events[type]) {
      delete element.events[type][handler.$$guid];
    }
  }
};

function handleEvent(event) {
  var returnValue = true;
  // grab the event object (IE uses a global event object)
  event = event || fixEvent(((this.ownerDocument || this.document || this).parentWindow || window).event);
  // get a reference to the hash table of event handlers
  var handlers = this.events[event.type];
  // execute each event handler
  for (var i in handlers) {
    this.$$handleEvent = handlers[i];
    if (this.$$handleEvent(event) === false) {
      returnValue = false;
    }
  }
  return returnValue;
};

function fixEvent(event) {
  // add W3C standard event methods
  event.preventDefault = fixEvent.preventDefault;
  event.stopPropagation = fixEvent.stopPropagation;
  return event;
};
fixEvent.preventDefault = function () {
  this.returnValue = false;
};
fixEvent.stopPropagation = function () {
  this.cancelBubble = true;
};


function MakeMyDom() {
  var self = this;

  this.getElementPosition = function(obj) {
    var curleft =0;
    var curtop = 0;
    if (obj.offsetParent) {
      curleft = obj.offsetLeft;
      curtop = obj.offsetTop;
      while (obj = obj.offsetParent) {
        curleft += obj.offsetLeft;
        curtop += obj.offsetTop;
      }       
    }
    return [curleft,curtop];
  }

  
  //TESTED
  // Get just the text out of an element.  Strips formatting.
  this.getText = function (el) {
    var ret;
    var txt = [],
      i = 0;

    if (!el) {
      ret = "";
    } else if (el.nodeType === 3) {
      // No problem if it's a text node
      ret = el.nodeValue;
    } else {
      // If there is more to it, then let's gather it all.
      while (el.childNodes[i]) {
        txt[txt.length] = self.getText(el.childNodes[i]);
        i++;
      }
      // return the array as a string
      ret = txt.join("");
    }
    return ret;
  };

  //////////////////////////////////////////////////////////////////////////
  //Tested
  this.insertAfter = function (newElement, targetElement) {
    //target is what you want it to go after. Look for this elements parent.
    var parent = targetElement.parentNode;
    //if the parents lastchild is the targetElement...
    if (parent.lastchild === targetElement) {
      //add the newElement after the target element.
      parent.appendChild(newElement);
    } else {
      // else the target has siblings, insert the new element between the target and it's next sibling.
      parent.insertBefore(newElement, targetElement.nextSibling);
    }
  };

  //////////////////////////////////////////////////////////////////////////
  //
  // http://www.ibm.com/developerworks/xml/library/x-matters41.html
  //
  // return previous node in document order
  //TESTED
  this.prevNode = function (node) {
    function previousDeep(node) {
      if (!node) {
        return null;
      }
      while (node.childNodes.length) {
        node = node.lastChild;
      }
      return node;
    }

    if (!node) {
      return null;
    }
    if (node.previousSibling) {
      return previousDeep(node.previousSibling);
    }
    return node.parentNode;
  };

  // return next node in document order
  //TESTED
  this.nextNode = function (node) {
    function nextWide(node) {
      if (!node) {
        return null;
      }
      if (node.nextSibling) {
        return node.nextSibling;
      } else {
        return nextWide(node.parentNode);
      }
    }

    if (!node) {
      return null;
    }
    if (node.firstChild) {
      return node.firstChild;
    } else {
      return nextWide(node);
    }
  };
  //////////////////////////////////////////////////////////////////////////
  //TESTED
  this.copyInnerNodes = function (src) {
    var f = document.createDocumentFragment();
    var e, d;

    e = src.firstChild;
    while (e) {
      d = e.cloneNode(true); // Copy it
      f.appendChild(d); // and add it.
      e = e.nextSibling;
    }
    return f;
  };

  //////////////////////////////////////////////////////////////////////////
  //TESTED
  this.emptyNode = function (el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  };

  //////////////////////////////////////////////////////////////////////////
  // Create a tag fill it with the contents, if passed.
  //TESTED
  this.createTag = function (tag, text) {
    var t = document.createElement(tag);
    if (typeof text === "undefined") {
      text = text;
    } else if (typeof text === "string") {
      t.appendChild(document.createTextNode(text));
    } else {
      t.appendChild(text);
    }
    return t;
  };

  //TESTED
  this.createLinkToRoom = function (room, desc) {
    if (!desc) {
      desc = room;
    }

    var a = this.createTag("span", desc);
    a.style.textDecoration = "underline";
    a.style.cursor = "pointer";
    var f = soiDetails.formFind;

    addEvent(a, 'click', (function (_room) {

      return function (event) {
        if (f) {
          f.elements.namedItem("vqxfi").value = _room;
          f.submit();
        } else {
          userWindow.location.href = "http://soi.hyperchat.com/cgi-bin/soi.cgi?room=" + _room;
        }
      };
    }(room)));

    return a;
  };

  //DEFERRED
  this.createInnerJump = function (func, text) {
    var a;
    var span;
    var eType = "span";

    span = this.createTag(eType);
    span.className = "cssbutton";

    a = this.createTag(eType, text);
    a.className = "buttonright";
    span.appendChild(a);
    addEvent(span, 'click', function (e) {
      func(e);
    });

    return span;
  };

  //DEFERRED
  this.createATag = function (url, text) {
    var a;
    var span;
    var eType = "span";

    // HACK:
    // Wiggle our way around event bubbling and trouble preventing defaults
    // by turning dry "#" links into spans.
    if (url === "#") {	  
      span = this.createTag("input");
	  span.value = text;
	  span.type = "button";
	  span.className = "cpbutton";
	  
	  // Add it to the body just long enough to set up a page-level, DOM0 event handler
	  // Note that we add it to userWindow.document -- this lets us set up a page level 
	  // handler that runs on the USER page, and not GreaseMonkey.
	  // That keeps the button from actually *doing* anything.
	  var body = userWindow.document.getElementsByTagName("body")[0];
      var tname = "IAmTheVeryModelOfAModernMajorGeneral";	  
	  span.id = tname;
	  body.appendChild(span);
	  userWindow.document.getElementById(tname).onclick = function() {return false;};
	  body.removeChild(span);
	  span.id = "";
	  
    } else {
      a = document.createElement("a");
      a.href = url;
      a.appendChild(document.createTextNode(text));
      span = a;
    }
    return span;
  };

  //THis function may no longer be needed.  It should be compared to the
  // internal urlEncode methods.
  // If we can drop it, lets drop it.
  //TESTED
  this.urlEncode = function (clearString) {
    var output = '';
    var x = 0;
    clearString = clearString.toString();
    var regex = /(^[a-zA-Z0-9_.]*)/;
    while (x < clearString.length) {
      var match = regex.exec(clearString.substr(x));
      if (match != null && match.length > 1 && match[1] !== '') {
        output += match[1];
        x += match[1].length;
      } else {
        if (clearString[x] === ' ') {
          output += '+';
        } else {
          var charCode = clearString.charCodeAt(x);
          var hexVal = charCode.toString(16);
          output += '%' + (hexVal.length < 2 ? '0' : '') + hexVal.toUpperCase();
        }
        x++;
      }
    }
    return output;
  };


  // display Pop Up div element
  //DEFERRED
  this.displayPopupDiv = function (e, atTop) {
    cpConsole.log("Opening popup window");
	this.hidePopupDiv();
    var posx = 0;
    var posy = 0;
    var contentDiv;
    var div;

    // determine target DIV
    // calculate mouse coordinates
    if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = e.pageY;
    } else if (e.clientX || e.clientY) {
      posx = e.clientX + document.body.scrollLeft;
      posy = e.clientY + document.body.scrollTop;
    }
	
	//var target = e.target || e.srcElement;
	//var tmp_pos = myDom.getElementPosition(target);
    //posx = tmp_pos[0];
    //posy = tmp_pos[1];
	
	
    // assign attributes to pop-up DIV element and append it to
    // web document tree
    div = document.getElementById('popup');
    if (div) {
      div.parentNode.removeChild(div);
    }

    if (0) {
      div = document.createElement('div');
      contentDiv = div;
    } else {
      div = document.createElement('table');

      div.appendChild(myDom.createTag("tbody", myDom.createTag("tr", myDom.createTag("td"))));
      contentDiv = div.getElementsByTagName("td")[0];
    }
    div.id = 'popup';
    div.className = 'popupdiv';

    if (0) {
      var close = this.createTag("b", "[X]");
      addEvent(close, "click", function (event) {
        var div = document.getElementById('popup');
        if (!div) {
          return;
        }
        div.parentNode.removeChild(div);

      });
      close.style.cssFloat = "left";
      close.title = "Close this popup";
      contentDiv.appendChild(close);
    }

    document.getElementsByTagName('body')[0].appendChild(div);
	
    if (atTop) {
      div.style.top = '0px';
      div.style.left = '0px';
      userWindow.scroll(0, 0);
    } else {
      div.style.top = posy + 5 + 'px';
      div.style.left = posx + 5 + 'px';
    }
    return (contentDiv);
  };


  // remove pop-up DIV element
  //DEFERRED
  this.hidePopupDiv = function () {
    var div = document.getElementById('popup');
    if (!div) {
      return;
    }
    div.parentNode.removeChild(div);
	cpConsole.log("Hiding popup window");
  };

  this.nextElementSibling = function(el) {
    if (el.nextElementSibling) return el.nextElementSibling;
    do { el = el.nextSibling } while (el && el.nodeType !== 1);
    return el;
  }  
  
}
var myDom = new MakeMyDom();


//DEFERRED
function getRoomUrlLink() {
  return getLinkHrefByText("[Reload This Page]");
}

//DEFERRED
function getLinkHrefByText(linkText) {
  var a = getLinkByText(linkText);
  if (a && a.href) {
    return a.href;
  }  
}

//TESTED
function getLinkByText(linkText) {
  var links = document.links;
  var link;
  var l = links.length;
  var i;

  for (i = 0; i < l; i++) {
    link = links[i];
    if (myDom.getText(link) === linkText) {
      return link;
    }
  }
}


function fixmyList(myList) {
  function touchProperty(obj, key, theDefault) {
    var a;
    if (!obj[key]) {
      obj[key] = theDefault;
    }

    trace(10, "KEY: " + key);
    trace(10, "TYPE:" + typeof obj[key]);
    trace(10, isArray(theDefault));

    if (isArray(theDefault)) {
      if (typeof obj[key] === "string") {
        trace(10, "Fixing");
        a = obj[key].toLowerCase().split(/\s+/);
        obj[key] = a;
      }
    }
    trace(10, isArray(obj[key]));
  }


  // Make sure that myList has all of the needed keys in its array
  var a = myList[":list:"];
  var realm;
  var i;

  if (!a) {
    a = [];
  }

  for (var key in myList) {
    if (myList.hasOwnProperty(key)) {
      if (key === ":macros:") {
        continue;
      }

	if (key === ":list:") {
        continue;
      }
      if (key === ":masterSettings:") {
        continue;
      }
      if (key === ":avatars:") {
        continue;
      }

      trace(10, "MYKEY: " + key);
      realm = myList[key];

      touchProperty(realm, "tailInclude", []);
      touchProperty(realm, "tailExclude", []);
      touchProperty(realm, "roomInclude", []);
      touchProperty(realm, "roomExclude", []);
      touchProperty(realm, "controlRoom", "");
      touchProperty(realm, "lastVisited", "unknown");
      touchProperty(realm, "roomList", []);
      touchProperty(realm, "excludeRealmRooms", "no");

      if (a.indexOf(key) === -1) {
        a.unshift(key);
      }

      // Save all rooms that are in use.
      allRooms = allRooms.concat(realm.roomInclude);
      allRooms = allRooms.concat(realm.roomList);
    }
  }

  for (i = 0; i < a.length; i++) {
    key = a[i];
    if (!myList.hasOwnProperty(key)) {
      a = a.splice(i, 1);
      i = 0; // Force loop to restart over.
    }
  }

  myList[":list:"] = a;

  touchProperty(myList, ":masterSettings:", {});
  touchProperty(myList[":masterSettings:"], "alwaysExclude", []);
  touchProperty(myList[":masterSettings:"], "userNames", []);
  touchProperty(myList[":masterSettings:"], "buddyList", []);
  touchProperty(myList, ":avatars:", {});
  touchProperty(myList, ":macros:", {});

}



var cpConsole = (function () {
  var messages = [];

  log("ChatPlus log started.");
 
  function clear() {
    messages = [];
	log("ChatPlus log re-started.");
  };
  
  function addMessage(type, msg) {
    var note = {
      type: type,
      msg: msg
    };
    messages.push(note);
  }

  function log(s) {
    addMessage("log", s);
  }

  function error(msg, url, linenumber) {    
    var o = [];
    o.push("msg: " + msg);
    o.push("url: " + url);
    o.push("linenumber: " + linenumber);
	o.push(printStackTrace());
    alert(JSON.stringify(o));
    s = o.join("\r");
    addMessage("error", s);
  }

  function debug(s) {
    addMessage("debug", s);
  }

  function dump(o) {
    var s = JSON.stringify(o, undefined, 2);
    addMessage("debug", s);
  }

  function show(el) {    
    messages.forEach(function (val) {
	  var s, node;
	  node = document.createElement("br");
	  el.appendChild(node);
      s = val.type + ":" + val.msg;
      node = document.createTextNode(s);
      el.appendChild(node);
    });	
  }

  return {
    dump: dump,
    debug: debug,
    error: error,
    log: log,
    show: show,
	clear: clear
  };
}());

//TESTED
function formatStr() {
  var args = arguments;
  var st = args[0];

  return st.replace(/\{\{|\}\}|\{(\d+)\}/g, function (m, n) {
    if (m == "{{") {
      return "{";
    }
    if (m == "}}") {
      return "}";
    }
    return args[+n + 1];
  });
};

//TESTED
function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(bytes < thresh) return bytes + ' B';
    var units = si ? ['kB','MB','GB','TB','PB','EB','ZB','YB'] : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(bytes >= thresh);
    return bytes.toFixed(1)+' '+units[u];
};