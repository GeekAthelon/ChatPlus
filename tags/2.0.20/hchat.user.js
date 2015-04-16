// ==UserScript==
// @name          ChatPlus
// @namespace     tag:athelon@hyperchat.com,2008-08-17:Athelon
// @description   Add new options to SOI (and sister-site) pages.
// @include       *
// ==/UserScript==


// Would be nice if there was a way to limit this to JUST SOI,
// but SOI uses a IP address, domain n
//////////////////////////////////////////////////////////////////////////
// Setup functions that have to be at the top of the file
//////////////////////////////////////////////////////////////////////////

/*global GM_getValue, GM_setValue, GM_xmlhttpRequest, PRO_addStyle, PRO_getValue, PRO_log,
PRO_setValue, window, escape, myDom:true , PRO_openInTab, GM_log, PRO_xmlhttpRequest,
unescape, GM_addStyle, updateBuddyPanel:true
*/

/*jslint browser: true, devel: true, undef: true, eqeqeq: true,  immed: true */


var $$_MAILFORM;
var $$_FINDFORM;
var $$_MSGFORM;
var $$_FULLROOMNAME;
var $$_BLANKTAIL;
var $$_RESETBUTTON;
var $$_ISSOI;

var isABetaVersion = false;
var extraString = "";
var is7Pro = !!window.PRO_setValue;

var userWindow = this.unsafeWindow ? this.unsafeWindow : window;
var homeUrl = "http://soiroom.hyperchat.com/chatplus/code/";
if (isABetaVersion) { extraString = "beta/"; }

var chatPlusLocal = !!userWindow.chatPlusLocal;

homeUrl += extraString;

var myStats;
myStats = {
  "sname" : "ChatPlus",
  "updateUrl" : homeUrl + "update.html"
};

myStats.versionUrl = homeUrl + "hchatv.txt";
myStats.version = "2.0.19";


function getNumberOfElementsByName(n) {
  var e = document.getElementsByName(n);
  if (!e) {return -1;}
  return e.length;
}

// Look for any tell-tale signs that we are on a hyperchat page.
var vqvakLength = getNumberOfElementsByName("vqvak");
var vqvajLength = getNumberOfElementsByName("vqvaj");
var DeleteMarkedMessagesLength = getNumberOfElementsByName("DeleteMarkedMessages");
var vqxqzLength = getNumberOfElementsByName("vqxqz");
var vqxcaLength = getNumberOfElementsByName("vqxca");
var avaurlLength = getNumberOfElementsByName("avaurl");

var isHot = vqvakLength === 3;
var isChatRoom = (vqvajLength === 1) && (vqvakLength === 1);

var isFtpRoom = vqxcaLength === 2;
var isNickRoom = avaurlLength === 1;

// Nail down what URLs are allowed to see the data here to keep it
// from leaking

if (window && window.location && window.location.href) {
  var isControl = !!(document.getElementById("tinker_realm_editor_soi"));
  if (isControl) {
    if (("" + window.location.href).indexOf("file") === 0) {
      isControl = true;
    }
    if (("" + window.location.href).indexOf("http://soiroom.hyperchat.com/chatplus") === 0) {
      isControl = true;
    }
  }
  
  $$_ISSOI = (isHot || isChatRoom || $$_MAILFORM);
  $$_ISSOI = $$_ISSOI || (window.location.href.toString().indexOf("chatplus_homepage") !== -1);
  $$_ISSOI = $$_ISSOI || isControl;
  $$_ISSOI = $$_ISSOI || isFtpRoom;
  $$_ISSOI = $$_ISSOI || isNickRoom;
}


function testo() {
  var realmList;
  var nameList; // What names were found in the document.
  var onlineBuddies;
  
  var elementIndex = {};
  var newRealm;
  var defaultRealmList;
  var allRooms = [];
  var tailList;
  
  //////////////////////////////////////////////////////////////////////////
  // Utility functions
  //////////////////////////////////////////////////////////////////////////
  
  function makeCommandPanel(newel) {
    var p = myDom.createTag("p", newel);
    var div = myDom.createTag("div", p);
    return div;
  }
  
  function getTail(s) {
    // Get the tail of a room like "z2@soi" and return "soi"
    var i = s.lastIndexOf("@");
    if (i === -1) {
      return $$_BLANKTAIL;
    } else {
      return s.substr(i+1, s.length);
    }
  }
  
  function normalizeName(n) {
    n = n.toLowerCase();
    n = n.replace(/[^a-zA-Z0-9]+/g,'');
    return n;
  }
    
  function extractNameInfo(nameElement, defaultTail) {
    var ninfo = {};
    var tailElement;
    var p;
    
    ninfo.decoratedName = myDom.getText(nameElement);
    
    tailElement = nameElement.getElementsByTagName("sup")[0];
    if (tailElement) {
      ninfo.tail = myDom.getText(tailElement);
      ninfo.tail = ninfo.tail.replace("@", "");
      p = new RegExp(ninfo.tail + "$", "");
      ninfo.nameNoTail = ninfo.decoratedName.replace(p ,"");
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
  
  
  function makeRoomLink(txt, url) {
    var data, dataLine, dataArray, s;
    var a;
    
    
    function setPropertyFromDom(o, form, prop)
    {
      o[prop] = form.elements.namedItem(prop).value;
    }
    
    
    data = {};
    
    setPropertyFromDom(data, $$_FINDFORM, "vqxus"); // Last name chatted under
    setPropertyFromDom(data, $$_FINDFORM, "vqxha");// Last name chatted under
    setPropertyFromDom(data, $$_FINDFORM, "roomsite"); // Tail of the room we are in
    setPropertyFromDom(data, $$_FINDFORM, "vqxti"); // time stamp
    setPropertyFromDom(data, $$_FINDFORM, "vqvak"); // Find button
    
    data["vqxfi"] = document.getElementsByName("vqxro")[0].value; // Name of the room we are in
    
    dataArray = [];
    
    for(var item in data) {
      if (data.hasOwnProperty(item)) {
        dataArray.push(item + "=" + data[item]);
      }
    }
    
    dataArray.push("chatplus_homepage", "true");
    dataLine = dataArray.join("&");
    s = url + "?" + dataLine;
    a = myDom.createATag(s, txt);
    return a;
  }
  
  
  
  function saveBig(_str, slotName) {
    var str = escape(_str);
    
    var mSize = 1000;  //3070
    var strs = [];
    function splitStr() {
      var smallStr = str.substr(0, mSize);
      strs.push(smallStr);
      str = (str.length>mSize?str.substr(mSize):"");
    }
    
    while (str !== "") {
      splitStr();
    }
    var len = strs.length;
    GM_setValue(slotName, len);
    for (var i=0; i<len; i++) {
      GM_setValue(slotName+"_"+i, strs[i]);
    }
  }
  
  function loadBig(slotName)
  {
    var len = GM_getValue(slotName);
    var s = "";
    var s1;
    for (var i=0; i<len; i++) {
      s1 = GM_getValue(slotName+"_"+i);
      s += s1;
    }
    s = s.replace(/#QUOTE#/g, '"');
    s = unescape(s);
    return s;
  }
  
  
  
  // Save the realmList in only one place so we can easily add a debugging
  // point and see what is getting written.
  function saveRealmList() {
    var RL;
    RL =  realmList.toJSON();
    saveBig("" + RL, "rList");
    GM_setValue("realmList", "-");
  }
  function getRealmList() {
    var s = GM_getValue("realmList", defaultRealmList.toJSON());
    if (s !== "-") {
      return s;
    }
    s = loadBig("rList");
    return s;
  }
  
  
  var isArray = function(v) {
    return v && typeof v === "object" && typeof v.length === "number" &&
    typeof v.splice === "function" && !(v.propertyIsEnumerable("length"));
  };

  
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

  
  function objectToUrlArray(data) {
    var fullData = [];
    var i;
    for (i in data) {
      if (data.hasOwnProperty(i)) {
        fullData.push([i,'=',data[i]].join(""));
      }
    }
    return fullData;
  }
  
   function urlencode(str) {
    return encodeURIComponent(str).replace(/%20/g, '+').replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29');
            // replace(/\*/g, '%2A');
  }

  var getOptionValue =
  (function() {
   if (document.documentElement) {
   if (document.documentElement.hasAttribute) {
     return function(o) {
       return o.hasAttribute('value') ? o.value : o.text;
     };
   }
   if (document.documentElement.attributes) {
     return function(o) {
       return (o.attributes.value &&
               o.attributes.value.specified) ?
       o.value : o.text;
     };
   }
   }
  }());
  
  
  var serializeFormUrlencoded = function(f) {
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
    
    for (var i=0, ilen=es.length; i<ilen; i++) {
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
          }
          else {
            for (var j=0, jlen=e.options.length; j<jlen; j++) {
              o = e.options[j];
              if (o.selected) {
                add(n, getOptionValue(o));
              }
            }
          }
        }
        else if (t.match(/^checkbox|radio$/)) {
          if (e.checked) {
            add(n, e.value);
          }
        }
        else if (t.match(/^text|password|hidden|textarea$/)) {
          add(n, e.value);
        }
      }
    }
    return c1;
    //return c.join('&');
  };
 
  
  function getRefreshMeta() {
    var metas = document.getElementsByTagName('META');
    var i;
    for (i = 0; i < metas.length; i++) {
      if (metas[i].httpEquiv.toLowerCase() === "refresh") {
        return metas[i].getAttribute('CONTENT');
      }
    }
  }

  function fixFormAction(form) {
    var i;
    var action = form.action;
    
    // Ok, the mailForm action doesn't give the full address.  We can fix that.
    if (action.toLowerCase().indexOf("http") !== 0) {
      // Absolute path given
      if (action.charAt(0) === "/") {
        i = window.location.href.indexOf("/", 9);
        action = window.location.href.substring(0, i) + form.action;
      } else {
        i = window.location.href.lastIndexOf("/");
        action = window.location.href.substring(0, i+1) + form.action;
      }
    }
    
    // Ok, this is a cheap and horrible hack, but it seems that IE7Pro
    // wants to encode the url, which is just plain wrong.  it looks like
    // none of the sister sites require anything past the address, so
    // we'll just trim off that which causes trouble.
    
    i = window.location.href.lastIndexOf("#");
    if (i !== -1) { action = action.substring(0, i); }
    i = window.location.href.lastIndexOf("?");
    if (i !== -1) { action = action.substring(0, i); }
    
    return action;
  }
  
  
  
  function processNick(nickInfo) {
    function getIframeDoc(iframe) {
      var doc = iframe.document;
      if(iframe.contentDocument) {
        doc = iframe.contentDocument; // For NS6
      }
      else if(iframe.contentWindow) {
        doc = iframe.contentWindow.document; // For IE5.5 and IE6
      }
      return doc;        
    }
    function makeIframe(txt) {
      var iframe = userWindow.document.createElement("iframe");
      document.body.appendChild(iframe);
      var doc = getIframeDoc(iframe);
      
      // We want to make sure we DON'T jump to the iframe, so we change its
      // special hash values.
      txt = txt.replace(/"chatmark"/g, 'chatterbug');
      txt = txt.replace(/"newtalk"/g, 'chatterbug');
      
      
      // Put the content in the iframe
      doc.open();
      doc.writeln(txt);
      doc.close();
      
      return iframe;
    }
    
    function nickCheck(response) {
      var txt = response.responseText;
      var iframe = makeIframe(txt);
      var doc = getIframeDoc(iframe);
      var name1,  name2;

      function getValue(elname) {
        var el = doc.getElementsByName(elname);
        if (el && el.length) {
          return el[0].value;
        } else {
          return undefined;
        }
      }
      
      
       name1 = getValue("vqxha") + "@" + getValue("roomsite");
       name2 = getValue("vqxus");
      
      
      //showResponse(response);
      if(response && response.readyState !== 4) {return;}
            
      document.body.removeChild(iframe);
      
      //alert([name1, name2, name1 === name2]);
      
      if (name1 === name2) {
        nickInfo.onsuccess();
      } else {
        nickInfo.onfailure();
      }
    }
    
    var nick = nickInfo.nick;
    var data = serializeFormUrlencoded($$_MAILFORM);
    data.vqxha = urlencode(nick);
    var fullData = objectToUrlArray(data);
    var action = fixFormAction($$_FINDFORM);
    //alert(action);
    
    var o = {
      method: "POST",
      url: action,
      data: fullData.join("&"),
      onreadystatechange:nickCheck,
      onerror: window.alert
    };
    
    GM_xmlhttpRequest(o);
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
  
  function trim(str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  }
  
  
  
  /////////////////////////////////////////////////////////////////////////////
  //Taken from:
  //http://users.on.net/~ihatescarves/addEvent.html
  

  /////////////////////////////////////////////////////////////////////////////
  //Taken from:
  //http://users.on.net/~ihatescarves/addEvent.html
  
  function addEvent(obj, evType, fn)
  {
    
    if (chatPlusLocal && evType === "load") {
      fn();
      return;
    }
    
    if (obj.addEventListener) {
      return obj.addEventListener(evType, fn, false);
    }
    
    // If this is the first added event, set the unload event to clean up.
    if (!window.eventObjects)
    {
      window.eventObjects = [];
      // We add a function to add another event handler to make sure the cleaup handler is the last thing executed.
      addEvent(window, 'unload', function() { addEvent(window, 'unload', addEvent.unloadEvents); });
    }
    
    if (!obj.eventCache)
    {
      obj.eventCache = {};
      window.eventObjects.push(obj);
    }
    
    if (!obj.eventCache[evType])
    {
      obj.eventCache[evType] = [];
      
      // Add any existing events to the cache
      if (obj['on' + evType] && (obj['on' + evType] !== null)) {
        obj.eventCache[evType].push(obj['on' + evType]);
      }
      
      obj['on' + evType] = addEvent.raiseEvents;
    }
    
    // Make sure the event is only added once
    if (obj.eventCache[evType].indexOf(fn) < 0) {
      obj.eventCache[evType].push(fn);
    }
  }
  
  //
  // Removes an event - parameters are the same as addEvent.
  //
  function removeEvent(obj, evType, fn)
  {
    if (obj.removeEventListener) {
      return obj.removeEventListener(evType, fn, false);
    }
    
    if (!obj.eventCache || !obj.eventCache[evType])
    {
      return;
    }
    
    var index = obj.eventCache[evType].indexOf(fn);
    
    if (index > -1) {
      obj.eventCache[evType].splice(index, 1);
    }
  }
  
  //
  // Raise events for IE (or some other old browser)
  //
  addEvent.raiseEvents = function(e)
  {
    e = e || window.event;
    
    var objEvents = this.eventCache[e.type];
    var r = true;
    
    for (var i = 0; i < objEvents.length; i++)
    {
      // Get the return value so we can return false if any functions return false
      var fr;
      if (objEvents[i].call) {
        fr = (objEvents[i].call(this, e) && r);
      } else {
        this.raiseEvent = objEvents[i];
        fr = this.raiseEvent(e);
        this.raiseEvent = null;
      }
      // Default to true if there's no return value
      r = (((typeof(fr) === 'undefined') || fr) && r);
    }
    
    // Only return if false - otherwise it screws onbeforeunload up
    if (!r) {
      return false;
    }
  };
  
  //
  // Unloads all the added events on unload to free memory in IE
  //
  addEvent.unloadEvents = function(e)
  {
    if (! window.eventObjects) { return; }
    if (! window.eventObjects.length) { return; }
    for (var i = 0; i < window.eventObjects.length; i++)
    {
      /*JSLINT*/ for (var n in window.eventObjects[i].eventCache)
      /*JSLINT*/ {
      /*JSLINT*/   window.eventObjects[i]['on' + n] = null;
      /*JSLINT*/ }
      
      window.eventObjects[i].eventCache = null;
    }
    
    window.eventObjects = null;
  };
  
    
  function MakeMyDom() {
    var self=this;
    
    // Get just the text out of an element.  Strips formatting.
    this.getText = function(el) {
      var ret;
      var txt = [],i=0;
      
      if (!el) {
        ret = "";
      } else if (el.nodeType === 3) {
        // No problem if it's a text node
        ret = el.nodeValue;
      } else {
        // If there is more to it, then let's gather it all.
        while(el.childNodes[i]) {
          txt[txt.length] = self.getText(el.childNodes[i]);
          i++;
        }
        // return the array as a string
        ret = txt.join("");
      }
      return ret;
    };
    
    
    //////////////////////////////////////////////////////////////////////////
    
    this.insertAfter = function(newElement,targetElement) {
      //target is what you want it to go after. Look for this elements parent.
      var parent = targetElement.parentNode;
      //if the parents lastchild is the targetElement...
      if(parent.lastchild === targetElement) {
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
    this.prevNode = function(node) {
      function previousDeep(node) {
        if (!node) {return null;}
        while (node.childNodes.length) {
          node = node.lastChild;
        }
        return node;
      }
      
      if (!node) {return null;}
      if (node.previousSibling) {
        return previousDeep(node.previousSibling);
      }
      return node.parentNode;
    };
    
    // return next node in document order
    this.nextNode = function(node) {
      function nextWide(node) {
        if (!node) {return null;}
        if (node.nextSibling) {
          return node.nextSibling;
        } else {
          return nextWide(node.parentNode);
        }
      }
      
      if (!node) {return null;}
      if (node.firstChild){
        return node.firstChild;
      } else {
        return nextWide(node);
      }
    };
    //////////////////////////////////////////////////////////////////////////
    
    this.copyInnerNodes = function(src)
    {
      var f = document.createDocumentFragment();
      var e,d;
      
      e = src.firstChild;
      while (e) {
        d = e.cloneNode(true); // Copy it
        f.appendChild(d);  // and add it.
        e = e.nextSibling;
      }
      return f;
    };
    
    //////////////////////////////////////////////////////////////////////////
    //function myDom.emptyNode(el) {
    this.emptyNode = function(el) {
      while (el.firstChild) {
        el.removeChild(el.firstChild);
      }
    };
    
    //////////////////////////////////////////////////////////////////////////
    
    // Create a tag fill it with the contents, if passed.
    this.createTag = function(tag, text)
    {
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
    
    this.createLinkToRoom = function(room, desc) {
      if (!desc) { desc = room; }
      
      var a = this.createTag("span", desc);
      a.style.textDecoration = "underline";
      a.style.cursor = "pointer";
      var f = $$_FINDFORM;
            
      addEvent(a, 'click',
               (function(_room) {

                return function(event){
                        if (f) {
                        f.elements.namedItem("vqxfi").value = _room;
                        f.submit();
                        } else {
                          window.location.href = "http://soi.hyperchat.com/cgi-bin/soi.cgi?room=" + _room;
                        }
               };
               }(room)));
      
      return a;
    };
    
    this.createATag = function(url, text) {
      var a;
      var span;
      var eType = "span";
      
      // HACK:
      // Wiggle our way around event bubbling and trouble preventing defaults
      // by turning dry "#" links into spans.
      if (url === "#") {
        span = this.createTag(eType);
        span.className = "cssbutton";
        
        //a = this.createTag(eType, "CP");
        //a.className = "buttonleft";
        //span.appendChild(a);
        
        a = this.createTag(eType, text);
        a.className = "buttonright";
        span.appendChild(a);
        span.style.cursor = "pointer";
        //a.style.textDecoration = "underline"
      } else {
        a = document.createElement("a");
        a.href = url;
        a.appendChild(document.createTextNode(text));
        span = a;
      }
      return span;
    };
    
    this.urlEncode = function(clearString) {
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
            output += '%' + ( hexVal.length < 2 ? '0' : '' ) + hexVal.toUpperCase();
          }
          x++;
        }
      }
      return output;
    };
    
    
    // display Pop Up div element
    this.displayPopupDiv = function(e) {
      var posx=0;
      var posy=0;
      var contentDiv;
      var div;
      
      if(!e){e=window.event;}
      // determine target DIV
      
      // calculate mouse coordinates
      if(e.pageX||e.pageY){
        posx=e.pageX;
        posy=e.pageY;
      }
      else if(e.clientX||e.clientY){
        posx = e.clientX + document.body.scrollLeft;
        posy = e.clientY + document.body.scrollTop;
      }
      
      // assign attributes to pop-up DIV element and append it to
      // web document tree
      div=document.getElementById('popup');
      if (div) {
        div.parentNode.removeChild(div);
      }
      
      if (0) {
        div=document.createElement('div');
        contentDiv = div;
      } else {
        div=document.createElement('table');
        
        div.appendChild(myDom.createTag("tbody",
                                        myDom.createTag("tr",
                                                        myDom.createTag("td")
                                                        )
                                        )
                        );
        contentDiv = div.getElementsByTagName("td")[0];
      }
      div.id = 'popup';
      div.className='popupdiv';
      
      if (0) {
      var close=this.createTag("b", "[X]");
      addEvent(close, "click", function(event) {
               var div=document.getElementById('popup');
               if(!div){return;}
               div.parentNode.removeChild(div);
      
      });
      close.style.cssFloat = "left";
      close.title = "Close this popup";
      contentDiv.appendChild(close);
    }
    
      document.getElementsByTagName('body')[0].appendChild(div);
      
      // move pop-up DIV element
      div.style.top=posy+5+'px';
      div.style.left=posx+5+'px';
      
      return(contentDiv);
    };
    
    
    // remove pop-up DIV element
    this.hidePopupDiv = function() {
      var div=document.getElementById('popup');
      if(!div){return;}
      div.parentNode.removeChild(div);
    };
    
  }
  myDom = new MakeMyDom();
  
  
  // Make Grease Monkey compat layer
  if (is7Pro) {
    this.GM_getValue = PRO_getValue;
    this.GM_setValue = PRO_setValue;
    this.GM_addStyle = PRO_addStyle;
    this.GM_log = PRO_log;
    this.GM_openInTab = PRO_openInTab;
    
    (function(w,d) {
     w.GM_xmlhttpRequest=function (d) {
     var h;
     // url, method, headers, data, onload, onerror, onreadystatechange;
     if (!d.url) { GM_log("URL is missing in xhr-call"); return false; }
     if (!d.method) { d.method="POST"; } else { d.method=d.method.toUpperCase(); }
     if (!d.headers) { d.headers=[]; }
     var xhr={"readyState":-1,"status":0,"statusText":"not loaded"};
     var xhr_value=xhr;
     try {
       xhr=GM_xmlhttpRequest._createRequest();
       // OPENING of the xhr
       xhr.open(d.method, d.url, true);
       for (h in d.headers) {
         if (d.headers.hasOwnProperty(h)) {
           try { xhr.setRequestHeader(h, d.headers[h]); } catch (ex) {}
         }
       }
       // CallBack gesture
       xhr.onreadystatechange=function() {
         GM_xmlhttpRequest._createValue(xhr,xhr_value);
         try { d.onreadystatechange(xhr_value); } catch (ex) {}
         if (xhr.readyState === 4) {
           if (xhr.status<400) {
             try { d.onload(xhr_value); } catch (ex99) {}
           } else {
             try { d.onerror(xhr_value); } catch (ex98) {}
           }
         }
       };
       
       // SENDING the data
       xhr.send(d.data?d.data:null);
     } catch (ex1) {
       try { d.onerror(xhr_value, ex1); } catch (ex2) {}
     }
     };
     w.GM_xmlhttpRequest._createRequest=PRO_xmlhttpRequest;
     w.GM_xmlhttpRequest._createValue=function(x,v) {
       v.abort=function() { x.abort(); };
       v.getResponseHeader=function(n) { return x.getResponseHeader(n);  };
       v.getAllResponseHeaders=function() { return x.getAllResponseHeaders(); };
       v.responseText=x.responseText;
       v.responseHeaders=x.getAllResponseHeaders();
       v.responseText=x.responseText;
       v.responseBody=x.responseBody;
       v.readyState=x.readyState;
       v.status=x.status;
       v.statusText=x.statusText;
     };
     
    }(this,document));
    
  }

  function finishBuddyPopup(holder, proxy) {
    function nameClick(e, target) {
      var div;
      var div2;
      var tag;
      var buddylist;
      var mode;
      var idx;
      var ninfo;
      var link;
      var name;
      
      name = "???";
      for(idx = 0; idx < elementIndex.element.length; idx++) {
        if (elementIndex.element[idx] == target) {
          ninfo = nameList[elementIndex.name[idx]];
          name = ninfo.fullSoiStyleName;
          break;
        }
      }
      
      buddylist = realmList[":masterSettings:"].buddyList;
      
      div = myDom.displayPopupDiv(e);
      div2 = document.createElement("div");
      //div2.appendChild(document.createTextNode("Buddy Watcher for:"));
      div2.appendChild(myDom.createTag("b", name));
      div2.appendChild(document.createElement("hr"));
      
      link = makePlayerHomePageUrl(ninfo.soiStyleName, ninfo.tail);
      div2.appendChild(link);
      div2.appendChild(document.createElement("hr"));
      
      
      if (proxy) {
        proxy(name, div2);
        div2.appendChild(document.createElement("hr"));
      }
      
      if(buddylist.indexOf(name) === -1) {
        tag = myDom.createATag("#", "Add to buddy list");
        mode = "add";
      } else {
        tag = myDom.createATag("#", "Remove from buddy list");
        mode = "remove";
      }
      div2.appendChild(tag);
      
      addEvent(tag, 'click',
               (function(_name, _mode) {
               return function(event){
                 var i;
                 if (_mode === "add") {
                   buddylist.push(_name);
                 } else {
                   i = buddylist.indexOf(_name);
                   buddylist.splice(i,1);
                 }
                 saveRealmList();
                 updateBuddyPanel();
                 myDom.hidePopupDiv();
               };
               }(name, mode)));
      
      div.appendChild(div2);      
    }
    
    addEvent(holder, "click", function(e) {
             e = e || window.event;
             var target = e.target || e.srcElement;
             var popupOk = false;
             var cn;
             
             while(target) {
               cn = "NANA";
               
               if (target && target.className) {
                 cn = target.className;
               }
               
               if (cn.indexOf("chatPlus_nick") !== -1) {
                 nameClick(e, target);
                 popupOk = true;
                 break;
               }
               
               if (cn.indexOf("chatPlus_popupok") !== -1) {
                 popupOk = true;
               }
               
               target = target.parentNode;
             }
             
             if(!target && !popupOk) { myDom.hidePopupDiv(); }
    }
    
    );
  }  
  
  function updateBuddyPanel()
  {
    if (!isHot) {return;}
    
    var d = document.getElementById("buddypanel");
    
    var buddylist = realmList[":masterSettings:"]["buddyList"];
    var defaultTail = document.getElementsByName("roomsite")[0].value;
    
    var i, j, buddy, online;
    var onLine;
    var offLine;
    var e;
    var eTr;
    var eTd;
    var eTable;
    var eTbody;
    var div;
    var labelDiv;
    var hasOnline = false;
    
    
    if (!d) { d = document.createElement("div"); }
    //document.body.insertBefore(d, document.body.firstChild);
    myDom.insertAfter(d, document.getElementById("realmDiv"));
    myDom.emptyNode(d);
    
    onLine = document.createDocumentFragment();// document.createElement("div");
    offLine = document.createDocumentFragment();//document.createElement("div");
    
    d.id = 'buddypanel';
    
    d.appendChild(myDom.createTag("h3", "Buddy List"));
    d.appendChild(document.createTextNode("Click on a name anywhere on the screen to add or remove names from the buddy list."));
    
    for (i = 0; i < buddylist.length; i++) {
      buddy = buddylist[i];
      online = onlineBuddies[buddy];
      e = document.createElement("span");
      e.className = "chatPlus_nick";
      
      var n = buddy.split("@");
      e.appendChild(document.createTextNode(n[0]));
      e.appendChild(myDom.createTag("sup", "@" + n[1]));
      e.title = buddy;
      
      if (online) {
        onLine.appendChild(e);
        onLine.appendChild(document.createTextNode(" "));
        hasOnline = true;
      } else {
        offLine.appendChild(e);
        offLine.appendChild(document.createTextNode(" "));
      }
      extractNameInfo(e, defaultTail);
    }
    
    
    eTbody = document.createElement("tbody");
    
    
    eTr = document.createElement("tr");
    eTd = document.createElement('td');
    eTd.className = "left";
    eTd.appendChild(document.createTextNode("Online Buddies"));
    eTr.appendChild(eTd);
    
    eTd = document.createElement('td');
    eTd.className = "right";
    eTd.appendChild(onLine);
    
    if (!hasOnline) {
      eTd.appendChild(
                      myDom.createTag("small","-none-")
                      );
    }
    
    eTr.appendChild(eTd);
    eTbody.appendChild(eTr);
    
    eTr = document.createElement("tr");
    eTd = document.createElement('td');
    eTd.className = "left";
    eTd.appendChild(document.createTextNode("Offline Buddies"));
    eTr.appendChild(eTd);
    
    
    eTd = document.createElement('td');
    eTd.className = "right";
    div = document.createElement('div');
    div.style.display = "none";
    div.id = 'offlinebuddydiv';
    div.appendChild(offLine);
    
    labelDiv = myDom.createTag("div", myDom.createATag("#", "Show offline buddies") );
    labelDiv.id = 'offlinebuddybutton';
    
    eTd.appendChild(div);
    eTd.appendChild(labelDiv);
    
    eTr.appendChild(eTd);
    eTbody.appendChild(eTr);
    
    
    eTable = document.createElement("table");
    eTable.className = "hotTable";
    eTable.appendChild(eTbody);
    d.appendChild(eTable);
    
    addEvent(labelDiv, 'click',
             function() {
             document.getElementById('offlinebuddybutton').style.display = "none";
             document.getElementById('offlinebuddydiv').style.display = "";
             
             }
             );
    
    function roomListProxy(name, div) {
      online = onlineBuddies[name];
      if(online) {
        for(j = 0; j < online.room.length; j++) {
          div.appendChild(myDom.createLinkToRoom(online.room[j]));
          div.appendChild(document.createElement("br"));
        }
      }
    }
    finishBuddyPopup(d, roomListProxy);
  }  
    
  
  function getLinkHrefByText(linkText) {
    var a = getLinkByText(linkText);
    if (a && a.href) {
      return a.href;
    }
  }
  
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
  
  function setReturnLink() {
    // Set a return link so we can get back home
    var links = document.links;
    var l = links.length;
    var retLink;
    
    var linkText = "";
    if ($$_MAILFORM) {linkText = "Mail"; }
    if (isHot) {linkText = "Hot"; }
    
    if (linkText !== "") {
      retLink = getLinkHrefByText(linkText);
    } else if (isChatRoom) {
      retLink = links[l-4-1].href;
    }
    
    if (retLink !== undefined) {
      GM_setValue("returnLink", retLink);
    }
  }
  setReturnLink();
  
  // Not all systems have object.toSource()
  // But, even for those that do, this is one step better since it
  // puts quotes around property names, thus allowing the use of keywords
  // and the like.
  // http://snippets.dzone.com/posts/show/749

  Object.prototype.deep_clone = function(){
    /*JSLINT*/ eval("var tmp = " + this.toJSON());
    /*JSLINT*/ return tmp;
  };

  
  Object.prototype.toJSON = function(){
    var json = [];
    
    //alert(this.toSource());
    
    for(var zi in this) {
      if(this.hasOwnProperty(zi)) {
        //if(typeof this[i] == "function") continue;
        
        json.push(
                  zi.toJSON() + " : " +
                  ((this[zi] !== null) ? this[zi].toJSON() : "null")
                  );
      }
    }
    return "{\n " + json.join(",\n ") + "\n}";
  };
  
  Array.prototype.toJSON = function(){
    for(var ai=0,json=[];ai<this.length;ai++) {
      json[ai] = (this[ai] !== null) ? this[ai].toJSON() : "null";
    }
    return "["+json.join(", ")+"]";
  };
  
  String.prototype.toJSON = function(){
    /*JSLINT*/ return '"' +
    /*JSLINT*/ this.replace(/(\\|\")/g,"\\$1")
    /*JSLINT*/ .replace(/\n|\r|\t/g,function(){
                        /*JSLINT*/     var a = arguments[0];
                        /*JSLINT*/     return  (a == '\n') ? '\\n':
                        /*JSLINT*/     (a == '\r') ? '\\r':
                        /*JSLINT*/     (a == '\t') ? '\\t': ""
    /*JSLINT*/ }) +
    /*JSLINT*/ '"'
  };
  
  Boolean.prototype.toJSON = function(){return this;};
  Function.prototype.toJSON = function(){return this;};
  Number.prototype.toJSON = function(){return this;};
  RegExp.prototype.toJSON = function(){return this;};
  
  // strict but slow
  String.prototype.toJSON = function(){
    var tmp = this.split("");
    for(var i=0;i<tmp.length;i++){
      var c = tmp[i];
      /*JSLINT*/ (c >= ' ') ?
      /*JSLINT*/ (c == '\\') ? (tmp[i] = '\\\\'):
      /*JSLINT*/ (c == '"')  ? (tmp[i] = '\\"' ): 0 :
      /*JSLINT*/ (tmp[i] =
                  /*JSLINT*/ (c == '\n') ? '\\n' :
                  /*JSLINT*/ (c == '\r') ? '\\r' :
                  /*JSLINT*/ (c == '\t') ? '\\t' :
                  /*JSLINT*/ (c == '\b') ? '\\b' :
                  /*JSLINT*/ (c == '\f') ? '\\f' :
                  /*JSLINT*/ (c = c.charCodeAt(),('\\u00' + ((c>15)?1:0)+(c%16)))
                  /*JSLINT*/ )
    }
    return '"' + tmp.join("") + '"';
  };
  
  
  
  // Functions that are sometimes missing.
  // Came as part of the addEvent code above, but they are useful
  // in their own right too.
  
  // Array methods
  if (!Array.indexOf) {
    Array.prototype.indexOf = function(searchElement, fromIndex)
    {
      if (!fromIndex) {
        fromIndex = 0;
      }
      
      // If fromIndex is less than zero it's an offset from the end
      if (fromIndex < 0) {
        fromIndex = (this.length + fromIndex <= 0) ? 0 : this.length - 1 + fromIndex;
      }
      
      // Make sure it's an object at the very least
      for (var aai = fromIndex; aai < this.length; aai++)
      {
        if (this[aai] === searchElement) {
          return aai;
        }
      }
      return -1;
    };
  }
  
  Array.prototype._swap=function(a, b)
  {
    var tmp=this[a];
    this[a]=this[b];
    this[b]=tmp;
  };
  
  
  ////////////////////////////////////////////////////////////////////////////
  
  // Get Url Parameter.
  function gup( name )
  {
    var r;
    /*JSLINT*/ name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results === null ) {
      r = "";
    } else {
      r = results[1];
    }
    return r;
  }
  
  var GM_update = function(p_title, p_version, p_updateUrl, p_versionUrl) {
    // Thank you j.tymes@gmail.com
    // At http://test.jtymes.net/js/updater.html
        
    var title = p_title;
    var today = new Date();
    today = today.getDate();
    var last = GM_getValue(title);
    var current;
    var answer;
    var updateUrl = p_updateUrl;
    var versionUrl = p_versionUrl;
    
    var load = function(url) {
      //GM_openInTab(updateUrl);
      location.href = url;
    };
    
    var finish = function(o) {
      var version = p_version;
      
      function zeroPad(num,count)
      {
        var numZeropad = num + '';
        while(numZeropad.length < count) {
          numZeropad = "0" + numZeropad;
        }
        return numZeropad;
      }
      
      function expandVersion(version) {
        var v = "" +
        zeroPad(+version[0], 3) +
        zeroPad(+version[1], 3) +
        zeroPad(+version[2], 3) +
        "";
        return v;
        
      }
      
      if(o.readyState === 4) {
        current = o.responseText;
        current = current.split(".");
        version = version.split(".");
        
        version = expandVersion(version);
        current = expandVersion(current);
        
        if (version > current) {
          answer = confirm("Update " + title + " to version " + current.join(".") + "?");
          if(answer) { load(updateUrl); }
        }
      }
    };
       
    var check = function() {
      GM_xmlhttpRequest({
                        method:"GET",
                        url:versionUrl,
                        onreadystatechange:finish
      });
    };
    
    var init = function() {
      if(last !== undefined) {
        if(today - last >= 7 || today - last <= -24) {
          GM_setValue(title, today);
          check();
        }
      } else {
        GM_setValue(title, today);
        check();
      }
    };
    
 //start
    
    init();
  };
  
  
  nameList = {}; // What names were found in the document.
  
   elementIndex = {};
  elementIndex.element = [];
  elementIndex.name = [];
  
  // The prototype for a new Realm.
  newRealm = {
    "new": {
      "fullName" : "Change my name",
      "defaultMode": "include",
      "tailInclude" : [],
      "tailExclude" : [],
      "roomInclude" : [],
      "roomExclude" : []
    }
  };
  
   defaultRealmList = {
    "all": {
      "fullName" : "Show all rooms",
      "defaultMode": "include",
      "readOnly" : true,
      "tailInclude" : [],
      "tailExclude" : [],
      "roomInclude" : [],
      "roomExclude" : []
    },
    "favs" : {
      "fullName" : "My Favorites",
      "defaultMode" : "exclude",
      "tailInclude" : [],
      "tailExclude" : [],
      "roomInclude" : [],
      "roomExclude" : []
    },
    
    "beware": {
      "fullName" : "Castle Beware",
      "defaultMode" : "exclude",
      "tailInclude" : ["bwr"],
      "tailExclude" : [],
      "roomInclude" : ["tobar@soi"],
      "roomExclude" : []
    }
  };
  
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
    
    if (!a) { a = []; }
    
    for (var key in myList) {
      if (myList.hasOwnProperty(key)) {
        if (key === ":list:") {  continue; }
        if (key === ":masterSettings:") {  continue; }
        if (key === ":avatars:") {  continue; }
        
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
    
    touchProperty(myList, ":masterSettings:", {} );
    touchProperty(myList[":masterSettings:"], "alwaysExclude", [] );
    touchProperty(myList[":masterSettings:"], "userNames", [] );
    touchProperty(myList[":masterSettings:"], "buddyList", [] );
    touchProperty(myList, ":avatars:", {} );
    
  }
  
  
  //////////////////////////////////////////////////////////////////////////
  //  Upgrade the NickName Control room here
  //////////////////////////////////////////////////////////////////////////
  var upgradeNickRoom = function() {
    
    function addNickPreview() {
      var nickDiv = document.createElement("span");
      var nickBox = document.getElementsByName("vqvcl")[0];
      var tag = myDom.createATag("#", "Preview Nickname ===> ");
      
      function showNick() {
        nickDiv.innerHTML = nickBox.value;
      }
      
      nickDiv.id = "nickDiv";
      nickDiv.innerHTML = nickBox.value;
      
      myDom.insertAfter(document.createElement("br"), nickBox);
      myDom.insertAfter(nickDiv, nickBox);
      myDom.insertAfter(tag, nickBox);
      myDom.insertAfter(document.createElement("br"), nickBox);
      
      addEvent(tag, "click", function(event) {
               showNick();
               }
               );
      showNick();
    }
    
    
    function addAvatarButtons() {
      var sel;
      var dest;
      var nick = document.getElementsByName("vqvbf")[0].value;
      var div = document.createElement("div");
      var form;
      var e;
      var key;
      
      div.appendChild(document.createElement("hr"));
      div.appendChild(myDom.createTag("h3", "Or Choose Avatar from List."));
      
      
      div.appendChild(myDom.createTag("i", "Goto FTP_FILES to add avatars to " +
                                      "this list, or to clean out ghosts."));
      
      //div.appendChild(document.createElement("hr"));
      var avalist = realmList[":avatars:"][nick];
      
      form = document.getElementsByName("avaurl")[0];
      while (form.tagName.toLowerCase() !== "form") {
        form = form.parentNode;
      }
      
      dest = form.elements.namedItem("vqvaj");
      
      sel = document.createElement("select");
      sel.options[sel.length] = new Option("***** Choose one *****", "");
      
      for (key in avalist) {
        if (avalist.hasOwnProperty(key)) {
          sel.options[sel.length] = new Option(key, key);
        }
      }
      
      div.appendChild(document.createElement("br"));
      div.appendChild(sel);
      
      e = document.createElement("img");
      e.src = "http://soiroom.hyperchat.com/chatplus/question_mark.jpg";
      
      div.appendChild(e);
      myDom.insertAfter(div, dest);
      
      addEvent(sel, "change", function(event) {
               var val = sel[sel.selectedIndex].value;
               if (val === "") { return; }
               
               var ava = realmList[":avatars:"][nick][val];
               var d =  form.elements;
               
               e.src = ava.url;
               // Fx handles this on its own.
               // IE didn't, but there isn't any harm
               // in doing it "just because."
               e.width = ava.width;
               e.height = ava.height;
               
               d.namedItem("avawidth").value =  ava.width;
               d.namedItem("avaheight").value = ava.height;
               d.namedItem("avaurl").value = val;
      });
    }
    addAvatarButtons();
    addNickPreview();
  };
  
  
  //////////////////////////////////////////////////////////////////////////
  //  Do nothing but upgrade the FTP room here
  //////////////////////////////////////////////////////////////////////////
  
  var upgradeFtpRoom = function() {    
    var exts = ["gif", "jpg", "png"];
    var ext;
    
    var i,l;
    var p;
    
    var tbl = document.getElementsByTagName("table")[0];
    var links = tbl.getElementsByTagName("a");
    var tag;
    var el;
    
    var aalist = realmList[":avatars:"];
    el = document.getElementsByName("vqvat");
    if (!el || el.length === 0) {
      return;
    }
    var thisnick = el[0].value;
    if (aalist[thisnick] === undefined) {
      aalist[thisnick] = {};
    }
    var alist = aalist[thisnick];
    var sname;
    var mode;
    
    var newalist = {}; // Build a list that shows just the things that exist.
    
    function getExtension(filename) {
      var parts = filename.split('.');
      return parts[parts.length-1].toLowerCase();
    }

    function makeAddOrRemove(elem, _mode) {
      return function(event){
        
        var url = elem.href;
        var m = _mode ? "remove" : "add";
        window.location.href =
        homeUrl + "avatar_" + m + ".html?fname=" +  encodeURI(url) +
        "&nexturl=" + myDom.urlEncode("" + window.location.href ) +
        "&nick=" + thisnick +
        "&sname=" + myDom.urlEncode(myDom.getText(elem));
      };
    }
    
    
    for (i = 0, l = links.length; i < l; i++) {
      p = links[i].parentNode;
      
      ext = getExtension(links[i].href);
      
      if (exts.indexOf(ext) !== -1) { // If that is a picture extension
        sname = myDom.urlEncode(myDom.getText(links[i]));
        mode = (!!alist[sname]);
        
        // If the avatar is already on file, re-file it.
        // This will clean out "stale" avatar data.
        if (mode) {
          newalist[sname] = alist[sname];
        }
        
        tag = myDom.createATag("#", mode ? "Remove_Ava" : "Add_Ava");
        
        addEvent(tag, "click", makeAddOrRemove(links[i], mode) );
      } else {
        tag = myDom.createTag("span", "");
      }
      
      myDom.insertAfter(myDom.createTag("td", tag), p.nextSibling);
      tag = null;
    }
    
    realmList[":avatars:"][thisnick] = newalist;
    saveRealmList();
  };
  

  
  
  //////////////////////////////////////////////////////////////////////////
  //  Do nothing but handle chat rooms here
  //////////////////////////////////////////////////////////////////////////
  
  
  var upgradeChat = function()
  {
    var fromText = ""; // Who the message is from
    var toText = ""; // Who the message is to
    var msgType = "";
    var hasRealmButton = false;
    var toFullSoiStyleName;
    var fromFullSoiStyleName;
    
    var citizenTest = function(elem) {
      var e = elem;
      var i;
      var s;
      
      for (i = 0; i < 15; i++) {
        if (e && e.tagName && e.tagName.toLowerCase() === "a") {
          s = myDom.getText(e);
          if (s === "~") {
            return true;
          } else if (s === "*") {
            return false;
          }
        }
        e = myDom.prevNode(e);
        if (!e) { break; }
      }
      return false;
    };
    
    function handleReplyClick(_from, _to, domain) {
      return function(event){
        var i;
        var select, options;
        var val;
        var domainGood = false;
        
        if (domain) {
          select = $$_MAILFORM.elements.namedItem("vqvck");                
          if (select && select.options && select.options.length) {
            options = select.options;
            for (i = 0; i < options.length; i++) {
              val = getOptionValue(options[i]).toLowerCase();
                //alert([val, domain.toLowerCase()]);
               if (val === domain.toLowerCase()) {
                select.selectedIndex = i;
                domainGood = true;
                break;
              }
            }
          }
          
          if (!domainGood) {
            window.alert("Couldn't find specified domain in drop down list.");
          }
          
        }
        
        $$_MAILFORM.elements.namedItem("vqxha").value = _from;
        $$_MAILFORM.elements.namedItem("vqxto").value = _to;
        window.location.hash = "chatmark";
        $$_MAILFORM.elements.namedItem("vqxsp").focus();
      };
    }
    
    var makeReplyButton = function(elem) {
      var domain;
      var e = elem;
      var msgSpan;
      var i;
            
      if (!document.getElementById("nameSetupPrompt")) {
        msgSpan = myDom.createTag("div",
                                  myDom.createTag("strong",
                                                  "To make reply work, goto " +
                                                  "[ChatPlus Controls] [Master Controls]")
                                  );
        msgSpan.id = "nameSetupPrompt";
        myDom.insertAfter(msgSpan, $$_MAILFORM.elements.namedItem("vqxsp"));
      }
      
      // If the user has name list setup, then make sure the "to" name is
      // on the list...
      var a = realmList[":masterSettings:"].userNames;
      var myFrom = toText;
      var myTo = fromText;
      var buttonText;
      var tmp;
      var isKnownNick = false;
      
      buttonText = "Reply";
      myFrom = toFullSoiStyleName;
      myTo = fromFullSoiStyleName;
      
      if (a.indexOf(myFrom) !== -1) {
        isKnownNick = true;
      } else  { // The name isn't on "ournames" list
        // See if the user send this message
        tmp = myFrom;
        myFrom = myTo;
        myTo = tmp;
        buttonText = "MSG again";
        
        if (a.indexOf(myFrom) !== -1) { 
          isKnownNick = true;
        }
      }
      
      // The nickname wasn't found -- maybe it is email
     if (!isKnownNick) {
       e = elem;
        for (i = 0; i < 9; i++) {
          if (myDom.getText(e) === "**EMAIL**") {
            domain = fromText.split("@")[1]; 
            buttonText = "Email again";
            myFrom = fromText.split("@")[0];
            myTo = toText;
            isKnownNick = true;
            break;                        
          }
          e = myDom.prevNode(e);
          if (!e) { break; }
        }
      }
      
      function fixName(n) {
        n = n.replace(/\(/g, "");
        n = n.replace(/\)/g, "");
        n = n.replace(/:/g, "");
        n = n.replace(/\ /g, "");
        return n;
      }
      
      
      if (!isKnownNick && msgType === 'EMAILEDx') {
        toText = fixName(toText);
        fromText = fixName(fromText);
        
        buttonText = "Email Reply";
        myTo = toText.split("@")[0];
        domain = toText.split("@")[1];
        myFrom = fromText;
        
        tmp = myFrom;
        myFrom = myTo;
        myTo = tmp;
        
        isKnownNick = true;
        domain = fixName(domain);
              //alert([myTo, myFrom, domain].toJSON());
      }
      
      if (!isKnownNick) {return;}

      e = elem; // Restore the value      
      for (i = 0; i < 9; i++) {
        if (e && e.tagName && e.tagName.toLowerCase() === "input" && e.type === "checkbox") {
          
          var rBut = myDom.createATag("#", buttonText);
          
          if (domain) {
            rBut.title = "Send Email to " + myTo + " as " + myFrom + "@" + domain;
          } else {
            rBut.title = "Send MSG to " + myTo + " as " + myFrom;
          }
          addEvent(rBut, 'click', handleReplyClick(myFrom, myTo, domain) );
          myDom.insertAfter(rBut, e);
          break;
        }
        e = myDom.prevNode(e);
        if (!e) { break; }
      }
      return false;
    };    
    
    var parseNames = function(
                              e, // The element to take names from
                              divide, // The element that splits "from" and "to:"
                              separator // The text seperator to use
                              )
    {
      
      var fromElement = myDom.createTag("span", "*from*");
      var toElement = myDom.createTag("span", "*to*");
      var dest;
      var nodeCopy;
      var end;
      //NUKE var master = realmList[":masterSettings:"];
      var i,l;
      var defaultTail = document.getElementsByName("roomsite")[0].value;
      var ops;
      var isCitizen = false;
      var f = e.firstChild;
      var fromNinfo;
      var toNinfo;
      
      dest = myDom.createTag("span");
      
      // Rewrote this code to loop through childNodes rather
      // than using nextSibling.  IE and its pain-in-the-ass
      // empty text nodes was killing nextSibling.
      l = e.childNodes.length;
      for (i = 0; i < l; i++) {
        f = e.childNodes[i];
        nodeCopy = f.cloneNode(true);
        if (myDom.getText(f) === separator) {
          fromElement = dest;
          dest = myDom.createTag("span");
        } else {
          dest.appendChild(nodeCopy);
        }
      }
      toElement = dest;
      
      if ($$_MAILFORM) {
        isCitizen = citizenTest(e);
      }
      
      end = myDom.createTag("b");
      end.appendChild(fromElement);
      
      // Remove that annoying space from the end of names
      homeFree: while (true) {
        dest = fromElement.lastChild;
        
        while (dest.nodeType !== 3) {
          // Empty text nodes seemed to screw up lastChild
          
          // Handle folks like Imperius who have a weird "<i/>" tag in their
          // name by some magic.  It isn't valid and shouldn't even be
          // possible, but it happens anyways, at least under IE.
          // (Non-container type tags, like <br> and <hr> aren't valid
          // in names, but this code would catch those too
          if (dest.childNodes.length === 0) {
            break homeFree;
          }
          
          dest = dest.childNodes[dest.childNodes.length -1];
        }
        
        // Some folks have extra trailing spaces/nodes on the end.
        if  (dest.nodeType === 3 && (dest.nodeValue === "" || dest.nodeValue === " ")) {
          dest.parentNode.removeChild(dest);
          continue;
        }
        
        // Clean up any left over spaces.
        dest.nodeValue = dest.nodeValue.replace(/ *$/g, "");
        break;
      }
      
      // Get rid of the trailing colon.
      dest = toElement.lastChild;
      if (myDom.getText(dest) === ":") {
        toElement.removeChild(dest);
      }
      
      end.appendChild(myDom.createTag("i", " " + separator + " "));
      end.appendChild(toElement);
      end.appendChild(document.createTextNode(":"));
      
      
      msgType = separator;
      fromNinfo = extractNameInfo(fromElement, defaultTail);
      fromText = fromNinfo.decoratedName;
      fromFullSoiStyleName = fromNinfo.fullSoiStyleName;
      
      toNinfo = extractNameInfo(toElement, defaultTail);
      toText = toNinfo.decoratedName;
      toFullSoiStyleName = toNinfo.fullSoiStyleName;
      
      ops = " [Click for options]";
      
      fromElement.title = nameList[fromText].decoratedName + ops;
      fromElement.className = "chatPlus_nick";
      
      toElement.title = nameList[toText].decoratedName + ops;
      toElement.className = "chatPlus_nick";
      
      if (isCitizen && $$_MAILFORM) {
        makeReplyButton(e);
      }
      
      return end;
    };
    
    
    // Debugging code.
    function showResponse(response) {
      var msg = "";
      var i;
      if (response) {
        for (i in response) {
          if (response.hasOwnProperty(i)) {
            msg += [i, response[i]] + "\r\n";
          }
        }
        alert(msg);
      }
    }
    
    var makeExtendedMailRoom = function(elem) {
      var tmp;
      var frag;
      var ccLabel;
      var bccLabel;
      var ccElem;
      var bccElem;
      var s;
      var toBoxName = 'vqxto';
      var toList;
      var statusBar;
      var rBut;
      var ccList;
      var bccList;
      var inError;
      var messageIdx;

      
      function setBulkMailStatus(msg) {
        document.title = msg;
        if (msg.length !== 0) {
          statusBar.innerHTML = "<br>" + msg;
        } else {
          statusBar.innerHTML = "";
        }
      }      
      
      function setBulkMailStatusWait(msg) {
        setBulkMailStatus(msg + "<br>Please wait.");
      }
            
      function setDisabled(mode) {
        ccElem.disabled = mode;
        bccElem.disabled = mode;
        
        $$_MAILFORM.elements.namedItem("vqxha").readOnly = !mode;
      }      
      
      function sendMassMail() {        
        var data;
        
        function cleanupAndVerify(toList) {
          var i, l = toList.length;
          var a;
          var names = {};
          var err = [];
          var n;
          
          for (i = 0; i < l; i++)
          {
            a = toList[i].split("@");
            n = normalizeName(a[0]);
            if (a[1]) {
              n += "@" + normalizeName(a[1]);
            } else {
              n += "@" + $$_BLANKTAIL; 
            }
            if (names[n]) {
              err.push("Duplicate name `" + n + "'");
            }
            names[n] = true;
            toList[i] = n;
          }
          
          if (err.length) {
            window.alert(err.join("\r\n"));
            return false;
          } else {
            return true;
          }          
        }
        
        function sendError(err) {
          window.alert("Error!" + err.toJSON());
        }
        
        function sendNextMessage(response) {
          var dest;
          var fullData = [];
          var msg;
          var action;
          
          if(response && response.readyState !== 4) {return;}
          
          if (messageIdx === toList.length) {
            setBulkMailStatusWait("Sent all messages");
            window.location.href = getLinkHrefByText("Mail");
            return;
          }
          
          dest = toList[messageIdx];
          data.vqxto = urlencode(dest);
          messageIdx++;
          
          msg = "Sending message to: " + dest + " (" + messageIdx + " of " + toList.length + ")";
          setBulkMailStatusWait(msg);
          fullData = objectToUrlArray(data);
          
          action = fixFormAction($$_MAILFORM);
          
          var o = {
            method: "POST",
            url: action,
            data: fullData.join("&"),
            onreadystatechange:sendNextMessage,
            onerror: sendError
          };
          
          //alert(o.toJSON());
          //setBulkMailStatus(action);
          GM_xmlhttpRequest(o);
        }
        
        ccList = ccElem.value.split(",");
        bccList = bccElem.value.split(",");
        inError = false;
        
        /* Handle blank lines */
        if (trim(ccList[0]) === "") {ccList = [];}
        if (trim(bccList[0]) === "") {bccList = [];}
        
        if (ccList.length === 0 && bccList.length === 0) {
          window.alert("There must be at least one name specified.");
          inError = true;
        }
        
        if (ccList.length > 0 && bccList.length > 0) {
          window.alert("You can only use one at a time.  'CC' or 'BCC' but not both.");
          inError = true;
        }
        
        if (inError) { return;  }
                
        data = serializeFormUrlencoded($$_MAILFORM);
        data.vqvaj = urlencode("Talk/Listen"); // Force in the button press.
        
        if (ccList.length) {
          toList = ccList;
          if (!cleanupAndVerify(toList)) { return; }
          // Update the message:
          data.vqxsp = urlencode("<font size='-1' color='green'>Bulk message sent to:<br>" +
                                 toList.join(", ").split("").join("<b></b>") +
                                 "</font><br>") + data.vqxsp;
        } else {
          toList = bccList;
          if (!cleanupAndVerify(toList)) { return; }
        }
        
        setDisabled(true);        
        
        messageIdx = 0;
        sendNextMessage();
      }      
      
      function prepSendBulk() {
        var talkListen = document.getElementsByName("vqvaj")[0];
        var toBox = document.getElementsByName(toBoxName)[0];
        var span;
        
        var newTalk = myDom.createATag("#", "Send Mass Email");
        
        addEvent(newTalk, 'click', sendMassMail);
        
        myDom.insertAfter(newTalk, talkListen);
        talkListen.style.display = "none"; //parentNode.removeChild(talkListen);
        
        rBut.style.display = "none";
        frag.style.display = "";
        
        myDom.insertAfter(newTalk, talkListen);
        
        span = document.createElement("span");
        span.appendChild(document.createTextNode(" Disabled "));
        span.className = "chatplus_replace";
        
        myDom.insertAfter(span, toBox);
        toBox.style.display = "none";
        
        setDisabled(false);
      }   
      
      function makeTextArea(label, id) {        
        var l = document.createElement("fieldset");
        var ta = document.createElement("textarea");
        var legend = document.createElement("legend");
        
        ta.id = id;
        ta.name = id;
        ta.rows = 4;
        ta.cols = 55;
        
        legend.appendChild(document.createTextNode(label));
        l.appendChild(legend);
        l.appendChild(document.createElement("br"));
        l.appendChild(ta);
        return l;
      }
            
      frag = document.createElement("fieldset");
      tmp = document.createElement("legend");
      tmp.appendChild(document.createTextNode("Extended Mail Features"));
      frag.appendChild(tmp);
      frag.className = "hchat_mail";
      
      var target = document.getElementsByName("vqxby")[0];
      
      ccLabel = makeTextArea("CC: These names will be seen by everyone who receives the mail message.", "mail_cc");
      bccLabel = makeTextArea("BCC: These names will NOT be seen.", "mail_bcc");
      
      ccElem = ccLabel.getElementsByTagName("textarea")[0];
      bccElem = bccLabel.getElementsByTagName("textarea")[0];
      
      s = "Names should be separated by commas. If there is a comma in the nickname, " +
      "simply leave it out.  \"Bond, James Bond\" would become \"Bond James Bond\"." +
      " In addition, the character '@' should be used as part of tail and not part of " +
      "the regular name.  \"lm@o\" would become \"lmo\".";
      
      frag.appendChild(document.createTextNode(s));
      frag.appendChild(document.createElement("br"));
      
      frag.appendChild(ccLabel);
      frag.appendChild(document.createElement("br"));
      frag.appendChild(bccLabel);
      myDom.insertAfter(frag, target);
      frag.style.display = "none";
      setDisabled(true);
      
      
      var span = document.createElement("span");
      span.appendChild(document.createElement("br"));
      
      statusBar = document.createElement("span");
      statusBar.className = "chatplus_replace";
      myDom.insertAfter(statusBar, $$_MAILFORM.elements.namedItem("vqxsp"));
      setBulkMailStatus("");
      
      
      rBut = myDom.createATag("#", "Turn on mass mailer");
      span.appendChild(rBut);
      myDom.insertAfter(span, target);
      rBut.title = "Click here to enable the mass mailer functions";
      addEvent(rBut, 'click', function() {
               setBulkMailStatusWait("Checking identify");
               
               var nickInfo  = {
                 nick: $$_MAILFORM.elements.namedItem("vqxha").value.split("@")[0],
                 onsuccess: function() {setBulkMailStatus("");prepSendBulk();},
                 onfailure: function() {
                   setBulkMailStatus("That nickname doesn't seem to be part of this account.");
                 }
               };
               
               processNick(nickInfo);
      });
      
      
      
    }; //makeExtendedMailRoom
    
    
    var init = function() {
      var hrArray = document.getElementsByTagName("i");
      var hrIndex, hrLen;
      var action;
      var testElement;
      var newNameElement;
      var nameParent;
      var cNode;
      
      var seps = ["said to", "said", "whispered to", "EMAILEDx"];
      var sepI, sep, sepL;

      function parseOneNameInner() {
        // Get the next 'I' tag
        testElement = hrArray[hrIndex];
        
        // If the tag doesn't have a child next node, skip it.
        cNode = testElement.firstChild;
        if (!cNode) { return; }
        if (cNode.nodeType !== 3) { return; }
        
        // And look at its parent
        nameParent = testElement.parentNode;
        
        // The elements we want are in 'B' or tags
        if (nameParent.tagName.toLowerCase() !== "b") { return;  }
        
        // So far, so good.
        //action = myDom.getText(nameParent);
        action = myDom.getText(testElement);
        
        // Look at our separators
        for (sepI = 0; sepI < sepL; sepI++) {
          sep = seps[sepI];
          if (cNode.nodeValue !== sep) {
            continue;
          }
          
          newNameElement = parseNames(nameParent, testElement, sep);
          myDom.emptyNode(nameParent);
          nameParent.appendChild(newNameElement);
          break;
        }
      }      
      
      function parseOneName() {        
        parseOneNameInner();
        hrIndex++;
        
        if (hrIndex < hrLen) {
          window.setTimeout(parseOneName, 1);
        }
      }      
      
      
      sepL = seps.length;
      hrLen = hrArray.length;
      
      hrIndex = 0;
      parseOneName();      
    };
    
    var makeRealmButton = function(s, type) {
      var thisRoom = document.getElementsByName("vqxro")[0].value;
      var realmFound = false;
      hasRealmButton = true;
      
      if (s.indexOf(thisRoom) === -1) {
        s.push(thisRoom);  // The control room *should* be on the list, regardless
      }
      
      var butString = "Realm";
      var key, realm;
      for (key in realmList) {
        if (realmList.hasOwnProperty(key)) {
          realm = realmList[key];
          if (realm.controlRoom === undefined) {continue;}
          if (realm.controlRoom === thisRoom) {
            realm.lastVisited = new Date().toLocaleDateString();
            realm.roomList = s;
            saveRealmList();
            realmFound = true;
            break;
          }
        }
      }
      
      if (realmFound) {butString = "**REALM**"; }
      
      var rBut = myDom.createATag("#", butString);
      rBut.title = "Realm of type: " + type;
      var fFind = document.getElementById("formFind");
      var fButton = fFind.elements.namedItem("vqvak");
      myDom.insertAfter(rBut, fButton);
      
      addEvent(rBut, "click", function(event) {
               if (realmFound) {
               window.alert("This is the control room of realm " + key + "," +
                     " and updates itself.");
               return;
               }
               var o = {};
               o.roomList = s;
               saveBig(o.toJSON(), "saveData");
               window.location.href = homeUrl +
               'realm_edit2.html?mode=prompt&mode2=add2' +
               '&controlRoom=' + thisRoom;
      });
      return rBut;
    };
    
    
    var detectRealmList3 = function() {
      // This covers the case for when they re-name the realm controls.
      // We'll do it cruder and brute-force.
      
      function makeFrom(arr)
      {
        var i, l;
        var roomList = [];
        var s;
        
        l = arr.length;
        for (i = 0; i < l; i++) {
          s = arr[i].value;
          if (!s) {continue;}
          if (s.indexOf("@") > 0) {
            roomList.push(s);
          }
        }
        makeRealmButton(roomList, "3");
      }
      
      var opts = document.getElementsByTagName("option");
      var opt;
      var i, l = opts.length;
      var parent;
      for (i = 0; i < l; i++) {
        opt = opts[i];
        if (opt.value.indexOf("@") > 0) {
          parent = opt.parentNode;
          
          // Skip the spirit list.
          if (parent.name.toLowerCase() === "vqvdy") {continue;}
          
          // Folks love to put weird characters in the MultiLoc select box.
          // I should enforce that more.
          if (parent.id === "roomselect") {continue;}
          
          opts = parent.getElementsByTagName("option");
          //alert([parent.name, parent.id, opt.value]);
          makeFrom(opts);
          break;
        }
      }
    };
    
    
    
    var detectRealmList2 = function() {
      // Find one kind of realm --
      // Where they create an addressArray that is filled with the rooms
      // to go to.  Pilfer the array.
      if (!userWindow.addressArray) { return; }
      
      var i, l;
      var roomList = [];
      var arr = userWindow.addressArray;
      var s;
      
      l = arr.length;
      for (i = 0; i < l; i++) {
        s = arr[i];
        if (!s) {continue;}
        if (s.indexOf("!!!") === 0) {
          roomList.push(s.replace("!!!", ""));
        }
      }
      
      
      if (roomList.length !== 0) {
        makeRealmButton(roomList, "2");
      }
    };
    
    var detectRealmList = function() {
      // Find one kind of realm -- where the room names are kept in a
      // select list named "room".   Uses a
      // <form action =http://soi.hyperchat.com/cgi-bin/soi.cgi method=GET>
      // to change rooms.
      
      var selectArray = document.getElementsByTagName("select");
      var sel;
      var i, l;
      var roomList = [];
      var foundFlag = false;
      var option;
      var tail;
      var v;
      
      l = selectArray.length;
      for (i = 0; i < l; i++) {
        sel = selectArray[i];
        if (sel.name === "room") {
          foundFlag = true;
          break;
        }
      }
      
      if (!foundFlag) {
        return;
      }
      
      //Derek Bryan's script (see detectRealmList1)
      // uses the same name for the select box,
      // but is nice enough to give the form a name.
      if (sel.parentNode && sel.parentNode.name) {
        if (sel.parentNode.name.toLowerCase() === "myform") {
          foundFlag = false;
        }
      }
      
      if (foundFlag) {
        l =  sel.options.length;
        for (i = 0; i < l; i++) {
          option = sel.options[i];
          v = option.value;
          tail = getTail(v);
          v = v.split("@")[0] + "@" + tail;
          roomList.push(v);
        }
        makeRealmButton(roomList, "1");
      }
    };
    
    //if ($$_MSGFORM && $$_MSGFORM.elements.namedItem(ee)) {}
    
    function processRefreshRooms() {
      var rBut;
      var resetTimerBut;
      var resetTimerDiv;
      
      var roomWatchDiv;
      var status;
      
      var lastTimeStamp;
      var askKey;
      var makeStartButton;
      var makeStopButton;
      var allStampData = {};
      var roomStampData = {};

      function findPosts(firstOnly) {
        var hrs = document.getElementsByTagName("hr");
        var hr, next;
        var i, l = hrs.length;
        var str;
        var re = /^[A-Za-z]{3}\s[A-Za-z]{3}\s\d\d\s\d\d:\d\d:\d\d$/;
        var m;
        var posts = [];
        
        for (i = 0; i < l; i++) {
          hr = hrs[i];
          next = myDom.nextNode(hr);
          while(next && next.tagName && next.tagName.toLowerCase() !== "i") {
            next = myDom.nextNode(next);
          }
          str = myDom.getText(next);
          m = !!str.match(re);
          if(m) {
            posts.push(next);
            if (firstOnly) {break;}
          }
          //alert([next, str, m]);
        }
        return posts;
      }

      function saveValues() {
        saveBig(allStampData.toJSON(), askKey);        
      }

      
      function findLastTimeDateStamp() {
        var p = findPosts(true);
        if (!p.length) {
          return "Never";
        } else {
          return myDom.getText(p[0]);
        }
      }
      function makeButtonChoice() {
        if (roomStampData.alertMode) {
          makeStopButton();
        } else {
          makeStartButton();
        }
      }      
      function setMode(mode) {
        status.innerHTML = "";
        rBut.parentNode.removeChild(rBut);
        roomStampData.alertMode = mode;
        makeButtonChoice();
        saveValues();        
      } 

      
      function saveLastTimeStamp() {
        roomStampData.lastStampOnRecord = findLastTimeDateStamp();
        allStampData[$$_FULLROOMNAME] = roomStampData;
        saveValues();
      }
      
      makeStartButton = function() {
        setRefreshStatus();
        rBut = myDom.createATag("#", "Current mode: Room watcher turned off.");
        rBut.title = "Click to turn feature on";
        addEvent(rBut, 'click', function() {
                 saveLastTimeStamp();
                 setMode(!roomStampData.alertMode);
        });
        roomWatchDiv.appendChild(rBut);
      };
      
      makeStopButton = function() {
        setRefreshStatus("");
        rBut = myDom.createATag("#", "Current Mode: Room watcher turned on.");
        rBut.title = "Click to turn feature off";
        addEvent(rBut, 'click', function() {
                 setMode(!roomStampData.alertMode);
                 });
        roomWatchDiv.appendChild(rBut);
      };

      function setRefreshStatus() {
        if (roomStampData.alertMode) {
        status.innerHTML = "Looking for posts newer than " + roomStampData.lastStampOnRecord;
        } else {
          status.innerHTML = "";
        }
      }
      
      // Wrap the span in a roomWatchDiv tag to fix an IE rendering issue.
      roomWatchDiv = document.createElement("div");
      status = document.createElement("div");
      roomWatchDiv.appendChild(status);
      
      $$_MSGFORM.parentNode.appendChild(roomWatchDiv);
      askKey = "cp_refresh_alert";
      
      allStampData = loadBig(askKey);      
      if (!allStampData) {
        allStampData = {};
      } else {
        allStampData = eval("(" + allStampData + ")");
      }
      
      roomStampData = allStampData[$$_FULLROOMNAME];
      
      if (!roomStampData) {
        roomStampData = {
          lastStampOnRecord: "never",
          alertMode: false
        };
      }
      
      
      if ($$_MSGFORM  && getRefreshMeta() ) {        
        makeButtonChoice();
        
        if (roomStampData.alertMode) {
          setRefreshStatus();
          lastTimeStamp = findLastTimeDateStamp();
          if (lastTimeStamp !== roomStampData.lastStampOnRecord) {
            document.title = "@@@" + document.title;

            resetTimerDiv = document.createElement("div");
            resetTimerBut = myDom.createATag("#", "Clear alert and wait for next message");
            rBut.title = "Clear the alert and wait for the next message";
            
            addEvent(resetTimerBut, 'click', function() {
                       resetTimerDiv.parentNode.removeChild(resetTimerDiv);
                     saveLastTimeStamp();
                     setMode(!roomStampData.alertMode);
                     setMode(!roomStampData.alertMode);
                     document.title = document.title.replace(/^@@@/, "");
                     setRefreshStatus();
                     });
            resetTimerDiv.appendChild(resetTimerBut);
            roomWatchDiv.appendChild(resetTimerDiv);
            
          }
        }        
      } else {
        saveLastTimeStamp();
      }
    }
    
    function upgradeReseButton() {      
      if ($$_RESETBUTTON) {
        var newReset = myDom.createATag("#", "Reset");
        
        myDom.insertAfter(newReset, $$_RESETBUTTON);
        $$_RESETBUTTON.style.display = "none";
        $$_RESETBUTTON.disabled  = "true";
        
        addEvent(newReset, 'click',
                 function() {
                 return function(e){
                   var answer = window.confirm("Are you you sure you want to reset?");
                   
                   if (answer) {
                     $$_MSGFORM.reset();
                   }
                   
                 };
                 }());
      }
      
      var oldUndo = getLinkByText("[Undo]");
      
      if ($$_MSGFORM && oldUndo) {
        
        var newUndo = myDom.createATag("#", "Undo");
        
        myDom.insertAfter(document.createTextNode(" "), newReset);
        myDom.insertAfter(newUndo, newReset);
        myDom.insertAfter(document.createTextNode(" "), newReset);
        oldUndo.style.display = "none";
        
        addEvent(newUndo, 'click',
                 function() {
                 return function(e){
                   var answer = window.confirm("Are you you sure you want to undo the last post?");
                   
                   if (answer) {
                     window.location.href = oldUndo.href;
                   }
                   
                 };
                 }());
      }
      
      
    }
    
    function enableExtendedOptions() {
      
      function makeOption(txt, f) {
        var el = myDom.createATag("#", txt);
        addEvent(el, 'click', f);
        return el;
      }
      
      function convertToCode() {
        var txt = $$_MSGFORM.elements.namedItem("vqxsp").value;
        
        var n, o;
        var re;
        var i;
        var table = [
          "&", "&amp;",
          "<", "&lt;",
          ">", "&gt;",
          "\r\n", "\r",
          "\r", "<br>",
          "\n", "<br>",
          "\ ", " "
        ];

        txt = txt.split("").join("!==dummy==!");
        
        for (i = 0; i < table.length; i+=2) {
          o = table[i];
          n = table[i+1];
          re = new RegExp(o, "gi");
          txt = txt.replace(re, n);
          //alert([re, txt]);
        }
        
        txt = txt.replace(/!==dummy==!/g, "<b></b>");
        
        txt = "<pre>"+txt + "</pre>";
        
        if (txt.length > 11000) {
          window.alert("Converted length too long.");
        } else {
          $$_MSGFORM.elements.namedItem("vqxsp").value = txt;
        }
      }
      
      if ($$_RESETBUTTON) {
        var special = myDom.createATag("#", "Special ...");
        special.className += " chatPlus_popupok";

        $$_RESETBUTTON.parentNode.insertBefore(special, $$_RESETBUTTON);
        $$_RESETBUTTON.parentNode.insertBefore(document.createTextNode(" "), $$_RESETBUTTON);
        
        addEvent(special, 'click',
                 function() {
                 return function(e){
                   var div2 = document.createElement("div");
                   var div = myDom.displayPopupDiv(e);
                   
                   div2.appendChild(makeOption("Convert to postable code", convertToCode));
                   div.appendChild(div2);
                 };
                 }());
      }      
    }
    
    
    init();
    processRefreshRooms();
    upgradeReseButton();
    enableExtendedOptions();
    if ($$_MAILFORM) {
      makeExtendedMailRoom();
    }
    finishBuddyPopup(document.body, undefined);
    //alert(nameList.toSource());
    
    // The order matters here.
    if (!hasRealmButton) {detectRealmList2(); } // From the array, !!! style
    if (!hasRealmButton) {detectRealmList3(); }
    if (!hasRealmButton) {detectRealmList(); }
  };
  
  //////////////////////////////////////////////////////////////////////////
  //  Do nothing but handle  [HOT] room here
  //////////////////////////////////////////////////////////////////////////
  
  var hotListBuilder = function()
  {
    var tblList = [];
    
    var placeHotPanel = function(paneldiv) {
      var logo;
      logo = document.getElementById("hotDiv");
      if (logo) {
        myDom.emptyNode(logo);
      } else {
        logo = document.createElement("div");
      }
      
      logo.appendChild(paneldiv);
      logo.id = "hotDiv";
      
      var loc = document.getElementsByTagName('table')[0]; // Location to put it in
      if (loc) {
        loc.parentNode.insertBefore(logo, loc);
      }
    };

    
    var createTableRowHtml = function(realmName, tblData) {
      
      
      trace(5, "createTableRowHtml");
      var folk;
      var folkList;
      var tail;
      var spiritCount;
      var j;
      var tmpArray;
      var tag, tag2;
      var folkTag;
      var folkMode = realmList[":masterSettings:"].hotListView;
      var folkNameIn = "";
      var folkSeparator;
      
      var s = "";
      var eTr = document.createElement("tr");
      var eTd;

    var createAddRemoveRealmButtons = function(realmName, roomName) {
      var tag;
      var e;

      function createAddRemove(mode)
      {
        
        tag = myDom.createATag("#", mode === "add" ? "Add" : "Remove");
        addEvent(tag, 'click',
                 (function(l1, l2, _mode) {
                 
                 return function(event){
                   var saveData = {
                     "realmName" : l1,
                     "roomName" : l2
                   };
                   saveBig(saveData.toJSON(), "saveData");
                   
                   if (mode === "add") {
                     window.location.href = homeUrl + "realm_add_room.html";
                   } else {
                     window.location.href = homeUrl + "realm_remove_room.html";
                   }
                   return true;
                 };
                 }(realmName, roomName, mode)));
        e.appendChild(tag);
        
      }
      e = myDom.createTag("div");
      createAddRemove("add");
      createAddRemove("remove");
      return e;
    };    

      
      tail = getTail(tblData.roomName);
      
      spiritCount = "";
      
      j = tblData.folk.length;
      trace(5, "createTableRowHtml.1");
      
      if (j === 0) {
        spiritCount = "No spirits -- but on the list?";
      } else if (j === 1) {
        spiritCount = "1 spirit";
      } else {
        spiritCount = "" + j + " spirits";
      }
      
      eTr.className =  tail + " " + tblData.roomName;
      
      eTd = document.createElement('td');
      eTd.className = "left";
      
      eTd.appendChild(myDom.createATag(tblData.roomURL, tblData.roomName));
      eTd.appendChild(document.createElement("br"));
      eTd.appendChild(document.createTextNode(spiritCount));
      trace(5, "createTableRowHtml.1.1");
      tag = createAddRemoveRealmButtons(realmName, tblData.roomName);
      trace(5, "createTableRowHtml.1.2");
      eTd.appendChild(tag);
      
      if (tblData.hideShowButton.name) {
        tag = document.createElement("input");
        tag.type = "submit";
        tag.value = tblData.hideShowButton.value;
        tag.name = tblData.hideShowButton.name;
        eTd.appendChild(tag);
      }
      
      eTr.appendChild(eTd);
      
      eTd = document.createElement('td');
      eTd.className = "right";
      
      eTd.appendChild(myDom.createTag("b", tblData.roomDesc));
      eTd.appendChild(myDom.createTag("br"));
      eTd.appendChild(myDom.createTag("br"));
      eTd.appendChild(myDom.createTag("i", tblData.roomOpen));
      eTd.appendChild(myDom.createTag("i", tblData.roomHost));
      eTd.appendChild(myDom.createTag("blockquote",  tblData.roomLong));
      trace(5, "createTableRowHtml.2");
      
      if (folkMode === "line") {
        folkTag = myDom.createTag("ul");
        folkNameIn = "li";
        folkSeparator = "";
      } else {
        folkTag = myDom.createTag("div");
        folkNameIn = "span";
        folkSeparator = ", ";
      }
      
      trace(5, "createTableRowHtml.3");
      folkList = tblData.folk;
      tmpArray = [];
      for (j = 0; j < folkList.length; j++) {
        folk = folkList[j];
        
        if (j > 0) {
          folkTag.appendChild(document.createTextNode(folkSeparator));
        }
        
        s = myDom.getText(folk);
        
        tag = folk.cloneNode(true);
        tag2 = myDom.createTag("b", tag);
        tag2.title = s;
        tag2.className = "chatPlus_nick";
        
        folkTag.appendChild(myDom.createTag(folkNameIn, tag2));
        extractNameInfo(tag2, tail);
      }
      trace(5, "createTableRowHtml.4");
      
      eTd.appendChild(folkTag);
      
      eTr.appendChild(eTd);
      return eTr;
    };
    
    var createNewHotList = function(realmName, realm)
    {
      var tblData;
      var i, l;
      var displayMode;
      var master = realmList[":masterSettings:"];
      var excludeReason;
      var exDiv, emptyDiv;
      var tag;
      var eTable;
      var eTbody;
      var eTr;
      var labelDiv, emptyLabelDiv;
      var countHidden = 0, countEmpty = 0;
      var s;
      var metaData = [];
      var _roomName;
      var unusedRooms = [].concat(realm.roomInclude, realm.roomList);
      var j;
      var exLinks = [];
      
      exDiv = document.createElement("div");
      exDiv.id = "exDiv_" + realmName;
      emptyDiv = document.createElement("div");
      emptyDiv.id = "emptyDiv_" + realmName;
      
      eTable = document.createElement("table");
      eTable.className = "hotTable";
      
      eTbody = document.createElement("tbody");
      eTable.appendChild(eTbody);
      
      l = tblList.length;
      for (i = 0; i < l; i++) {
        trace(5, "i = " + i);
        tblData = tblList[i];
        
        metaData[0] = getTail(tblData.roomName);
        _roomName = tblData.roomName;
        
        j = unusedRooms.indexOf(_roomName);
        while(j !== -1) {
          delete unusedRooms[j];
          j = unusedRooms.indexOf(_roomName);
        }
        
        displayMode = realm.defaultMode;
        
        excludeReason = [];
        excludeReason.push('Room hidden because: ');
        
        if (realm.excludeRealmRooms === "yes")
        {
          if (allRooms.indexOf(_roomName) !== -1) {
            displayMode = "exclude";
            excludeReason.push('Part of a realm');
          }
        }
        
        if (displayMode === "exclude") {
          excludeReason.push('realm default');
        }
        
        if (realm.roomList.indexOf(_roomName) !== -1) {
          displayMode = "include";
        }
        if (realm.tailInclude.indexOf(metaData[0]) !== -1) {
          displayMode = "include";
        }
        if (realm.tailExclude.indexOf(metaData[0]) !== -1) {
          displayMode = "exclude";
          excludeReason.push('room tail');
        }
        if (realm.roomInclude.indexOf(_roomName) !== -1) {
          displayMode = "include";
        }
        if (realm.roomExclude.indexOf(_roomName) !== -1) {
          displayMode = "exclude";
          excludeReason.push('room exclude');
        }
        if (master.alwaysExclude.indexOf(_roomName) !== -1) {
          displayMode = "exclude";
          excludeReason.push('master exclude');
        }
        
        if (displayMode === "include") {
          trace(5, "Ha-1");
          eTr = createTableRowHtml(realmName, tblData);
          eTbody.appendChild(eTr);
          trace(5, "Ha-2");
        } else {
          exLinks.push( {url: tblData.roomURL, name: tblData.roomName } );
          countHidden++;
        }
      }
      
      exDiv.style.display = "none";
      labelDiv = myDom.createTag("div", myDom.createATag("#", "Show Hidden Rooms (" +  countHidden + " hidden)")
                                 );
      addEvent(labelDiv, 'click',
               (function(l1, _data) {
               return function(event){
                       var div =  document.getElementById("exDiv_" + l1);
                       var tag;
                       var i, l = _data.length;
                       div.style.display = "block";
                       
                       for (i = 0; i < l; i++) {
                         tag = myDom.createATag(_data[i].url, _data[i].name);
                         tag.title = excludeReason.join(" ");
                         div.appendChild(tag);
                         div.appendChild(document.createTextNode(", "));
                       }
                       
                       
                       this.style.display = "none";
               };
               }(realmName, exLinks)));
      
      l = unusedRooms.length;
      for (i = 0; i < l; i++) {
        s = unusedRooms[i];
        if (s) { countEmpty++; }
      }
      
      emptyDiv.style.display = "none";
      emptyLabelDiv = myDom.createTag("div", myDom.createATag("#", "Show Empty Rooms (" + countEmpty + " empty)") );
      
      addEvent(emptyLabelDiv, 'click',
               (function(l1, _data) {
               return function(event){
                       var i, l = _data.length;
                       var div = document.getElementById("emptyDiv_" + l1);
                       div.style.display = "block";
                       for (i = 0; i < l; i++) {
                         s = _data[i];
                         if (s) {
                           tag = myDom.createLinkToRoom(s);
                           div.appendChild(tag);
                           div.appendChild(document.createTextNode(", "));
                         }
                       }
                       
                       this.style.display = "none";
               };
               }(realmName, unusedRooms)));
      
      eTr = myDom.createTag("tr");
      
      tag = myDom.createTag("div");
      tag.appendChild(document.createTextNode("Hidden rooms"));
      tag.appendChild(document.createElement("br"));
      tag.appendChild(document.createTextNode("Empty rooms"));
      
      tag = myDom.createTag("td", tag);
      tag.className = "left";
      
      eTr.appendChild(tag);
      eTbody.appendChild(eTr);
      
      tag = myDom.createTag("td");
      tag.className = "right";
      tag.appendChild(exDiv);
      tag.appendChild(labelDiv);
      
      tag.appendChild(emptyDiv);
      tag.appendChild(emptyLabelDiv);
      
      eTr.appendChild(tag);
      
      return eTable;
    };    
    
    var updateSeenTable = function()
    {
      var key;
      var realm;
      var elem;
      var table;
      var realmHeader;
      var controlRoomElement;
      
      var holder = document.createElement("div");
      holder.id = 'hotListHolder';
      
      myDom.emptyNode(document.getElementById("tblHome"));
      
      // Loop through the Realms
      for(var iii = 0; iii < realmList[":list:"].length; iii++) {
        key = realmList[":list:"][iii];
        realm = realmList[key];
        elem = document.getElementById("id_cb_" + key);
        
        if (elem.checked) {
          table = createNewHotList(key, realm);
          elem = document.createElement('div');
          realmHeader = document.createElement('h3');
          realmHeader.appendChild(document.createTextNode(realm.fullName));
          
          if (realm.controlRoom !== "") {
            realmHeader.appendChild(document.createTextNode(" . "));
            controlRoomElement = myDom.createLinkToRoom(realm.controlRoom, "(*)");
            controlRoomElement.title = "Control Room last visited: " + realm.lastVisited;
            realmHeader.appendChild(myDom.createTag("small", controlRoomElement));
          }
          
          holder.appendChild(realmHeader);
          holder.appendChild(table);
        }
      }
      document.getElementById("tblHome").appendChild(holder);
      finishBuddyPopup(holder);
    };    
    
    var parseHotList = function()  {
      // Read through the HOT list and turn it into an object filled witih
      // all sorts of data goodness.
      //   tblData.roomName  ==> The room name, including tail
      //   tblData.roomURL   ==> Current URL to room -- do not cache
      //   tblData.roomOpen  ==> Who the room is open to, if known
      //   tlbData.roomHost  ==> Host of the room, if known.
      //   tblData.roomDesc  ==> Short description of the room
      //   tblData.folk      ==> Who is in the room, HTML nodes
      //   tblData.hideShowButton ==> The SOI Hide/Show button
      
      var thisTable;
      var allTables;
      var tmp;
      var folk;
      var folkList;
      var thisFolk;
      var thisTr; // Which table row are we using?
      var thisTd; // Which table detail are we using?
      var tmpTd;
      var tmp2;
      
      var buddylist = realmList[":masterSettings:"]["buddyList"];
      var name, buddy;
      var defaultTail;
      
      allTables = document.getElementsByTagName('table');
      for (var i = 0; i < allTables.length; i++) {
        tmp = undefined;
        thisTd = undefined;
        
        thisTable = allTables[i];
        
        thisTable.style.display = "none";
        
        thisTr =  thisTable.getElementsByTagName("tr")[0]; // One row per table.
        if (thisTr) { thisTd = thisTr.getElementsByTagName("td")[0]; } // The first column
        if (thisTd) { tmp = thisTd.getElementsByTagName("a")[0]; } // The first link (to the room)
        
        if (tmp) {
          var tblData = {};
          tblData.hideShowButton = {};
          
          // Find the SOI show/hide button.
          tmp2 = thisTd.getElementsByTagName("input")[0];
          if (tmp2 && tmp2.value && tmp2.name) {
            if (tmp2.value.toLowerCase() === "show" ||tmp2.value.toLowerCase() === "hide") {
              
              tblData.hideShowButton.value = tmp2.value;
              tblData.hideShowButton.name = tmp2.name;
            }
          }
          
          tblData.roomName = myDom.getText(tmp.firstChild);
          tblData.roomURL = tmp.href;
          
          if (tblData.roomName.indexOf("@") === -1) {
            tblData.roomName += "@" + $$_BLANKTAIL;
          }
          defaultTail = tblData.roomName.split("@")[1];
          
          folk = [];
          folkList = undefined;
          
          //tmp =  thisTable.getElementsByTagName("tr")[0]; // One row per table.
          if (thisTr) { tmp = thisTr.getElementsByTagName("td")[1]; tmpTd = tmp; } // The first column
          
          // The people on the HOT list are blocked off in <b></b> blocks.  Makes picking
          // them out fairly easy.  We leave behind the commas and the chaff.
          if (tmp) { folkList = tmp.getElementsByTagName("b"); } // The first link (to the room)
          
          // Snag the 'open to ....' and 'owned by' links, if available.
          if (tmpTd) {
            tmp = tmpTd.getElementsByTagName("i");
            
            tblData.roomOpen = myDom.getText(tmp[0]) || "Not open? -- eh?";
            tblData.roomHost = myDom.getText(tmp[1]) || "";
            
            // In order for tmp[1] to be valid, it must be the right next
            // tmp[0].  Else, it comes from somewhere in the player list.
            
            if (tblData.roomHost !== "") {
              if (tmp[1].previousSibling != tmp[0]) {
                tblData.roomHost = "";
              }
            }
            
            // Get the long description of the room.
            tmp = tmpTd.getElementsByTagName("blockquote");
            tblData.roomLong = myDom.getText(tmp[0]) || "";
          }
          
          if (!onlineBuddies) {
            onlineBuddies = {};
          }
          
          if (folkList) {
            // The first element is the room description
            tblData.roomDesc = myDom.getText(folkList[0]);
            
            // So the start at the 2nd element
            for (var j = 1; j < folkList.length; j++) {
              
              thisFolk = folkList[j];
              name = extractNameInfo(thisFolk, defaultTail).fullSoiStyleName;
              
              if (buddylist.indexOf(name) !== -1) {
                buddy = onlineBuddies[name];
                if (!buddy) {
                  buddy = {};
                  buddy.room = [];
                }
                buddy.name = name;
                buddy.room.push(tblData.roomName);
                //buddy.node = myDom.copyInnerNodes(thisFolk);
                onlineBuddies[name] = buddy;
              }
              // Add to the table list
              folk.push(myDom.copyInnerNodes(thisFolk));
            }
            tblData.folk = folk;
            tblList.push(tblData);
          }
        }
      }
    };    
    
    var makeRealmChecks = function (rList) {      
      var realm;
      var box;
      var loc = document.getElementById('realmForm');
      var name;
      var list = rList[":list:"];
      var t;
      var key;

      function makeCheckBox(label, value, name) {
        var lab,
        box,
        checkbox,
        id = "id_" + name;
        
        lab = document.createElement("label");
        lab.htmlFor = id;
        
        box = document.createElement('span');
        box.style.whiteSpace="nowrap";
        box.appendChild(document.createTextNode(label + ":"));
        
        checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = name;
        checkbox.id = id;
        checkbox.defaultModeChecked = false;
        checkbox.value = value;
        
        box.appendChild(checkbox);
        
        lab.appendChild(box);
        lab.appendChild(document.createTextNode(" \u00a0 "));
        lab.title = 'Toggle ' + realm.fullName;
        return lab;
      }
      
      var getString = function(elem) {
        var n = elem.id.replace("id_", "");
        n = "isHot_" + n;
        return n;
      };

      function handleClick(event) {
        var n = getString(this);
        updateSeenTable();
        GM_setValue(n, "" + this.checked);
      }
      
      for(var iii = 0; iii < list.length; iii++) {
        key = list[iii];
        realm = rList[key];
        name = "cb_" + key;
        box = makeCheckBox(key, key, name);
        loc.appendChild(box);
        
        //t = loc.elements.namedItem(name); // returns NULL under IE7Pro
        t = box.getElementsByTagName("input")[0];
        
        addEvent(t, "click", handleClick);
        
        var n = getString(t);
        var v = GM_getValue(n, true);
        if (v === "false") { v = false; }
        if (!!v) {
          t.checked = true;
        }
      }
    };    
    
    var updateHotList = function() {
      var newDiv;
      var loc = document.getElementsByTagName('table')[0]; // Location to put it in
      
      var newForm = document.createElement("form");
      newForm.id = "realmForm";
      newForm.name = "realmForm";
      
      newDiv = myDom.createTag("div", newForm);
      newDiv.id = "realmDiv";
      newDiv.appendChild(document.createTextNode("Click on a checkbox to turn on or off a Realm display" ) );
      
      loc.parentNode.insertBefore(newDiv, loc);
      
      newDiv = document.createElement("div", "tblHome");
      newDiv.id = "tblHome";
      loc.parentNode.insertBefore(newDiv, loc);
      
      makeRealmChecks(realmList);
      parseHotList();
      updateSeenTable();
      updateBuddyPanel();
    };
    
    var prepHotRoom = function ()
    {
      var newMode = GM_getValue("isNewHot", true);
      var link;
      
      if (!newMode) {
        link = myDom.createATag("#", "Customize Me");
        link.id = "newHot";
        
        link = makeCommandPanel(link);
        placeHotPanel(link);
        addEvent(document.getElementById("newHot"), "click", function(event) {
                 myDom.emptyNode(document.getElementById("hotDiv"));
                 updateHotList();
                 GM_setValue("isNewHot", true);
                 if (event.preventDefault) {event.preventDefault(); }
                 return true;
        });
      } else {
        link = myDom.createATag("#", "Use Old Hot");
        link.id = "newHot";
        link = makeCommandPanel(link);
        placeHotPanel(link);
        
        updateHotList();
        addEvent(document.getElementById("newHot"), "click", function(event) {
                 link = makeCommandPanel(link);
                 placeHotPanel(link);
                 GM_setValue("isNewHot", false);
                 window.location.reload();
        });
      }
    };
    
    prepHotRoom();
  };
  
  
  // Go through the page and name various form.
  // Code elsewhere depends on this.
  function makeFormIds() {
    function findResetButton() {
      if ($$_MSGFORM && $$_MSGFORM.elements) { 
        var l = $$_MSGFORM.elements.length;
        var i;
        var resetCtl;
        var ctl;
        for (i=0; i< l; i++) {
          ctl = $$_MSGFORM.elements[i];
          if (ctl.type.toLowerCase() === "reset") {
            resetCtl = ctl;
            break;
          }
        }
        return resetCtl;
      }
    }
        
    var forms;
    var form;
    var len;
    var i;
    var e;
    
    var testE = function(ee, v) {
      var q = form.elements.namedItem(ee);
      if (q && q.value) {
        return (q.value.toLowerCase() === v.toLowerCase());
      }
    };
    
    forms = document.forms;
    len = forms.length;
    
    for (i = 0; i < len; i++) {
      form = forms[i];
      
      if (testE("vqvak", "find")) {
        form.id = "formFind";
        $$_FINDFORM = form;
      }
      
      if (testE("vqvak", "find")) {
        form.id = "formFind";
        $$_FINDFORM = form;
      }
    }
    
    e = document.getElementsByName("vqvck")[0];
    if (e)
    {
      e.parentNode.id = "mailForm";
      $$_MAILFORM = e.parentNode; 
    }
    
    e = document.getElementsByName("vqvaj")[0];
    if (e) { $$_MSGFORM = e.parentNode; }
    
    e = document.getElementsByName("vqxro")[0];
    if (e) { $$_FULLROOMNAME = e.value; }
    
    e = document.getElementsByName("roomsite")[0];
    if (e) { $$_BLANKTAIL = e.value; }
    
    $$_RESETBUTTON = findResetButton();
  }
  
  
  tailList = {
    "soi": {
      "url": "http://soi.hyperchat.com/",
      "mainRoom": "soi",
      "hotRoom": "hotlist",
      "gossipRoom": "babble",
      "hotUrl": "http://soi.hyperchat.com/cgi-bin/soi.cgi?EParms=ru|kqw29tRmwmpkv%22ru|vk9g/Gkjpvkh/GajpvaDwkm%22ru|le9Rmwmpkv&vqvab=soi@soi&vqvaa=hotlist&vqxti=1219268970#newtalk",
      "SeeAllUrl": "http://ssom10.hyperchat.com/cgi-bin/som10.cgi?EParms=ru|kqw29tRmwmpkv%22ru|vk9feffhaDwkm%22ru|le9Rmwmpkv&vqvab=soi@soi&vqxti=1219269053#newtalk",
      "name": "State of insanity",
      "background": "/state/frgback.jpg",
      "roomBase" : "http://soiroom.hyperchat.com/!!!/",
      "userBase" :"http://soiuser.hyperchat.com/!!!/"
    },
    "bwr": {
      "url": "http://bwr.hyperchat.com/",
      "mainRoom": "beware",
      "hotRoom": "hotlist",
      "gossipRoom": "gossip",
      "hotUrl": "http://sbwr.hyperchat.com/newchat-cgi/bwr.cgi?vqxus=Visitor&vqxro=c+Control+Centre@bwr&vqxha=Visitor&vqvab=beware@bwr&vqvaa=hotlist&vqxti=1219269328#newtalk",
      "SeeAllUrl": "http://sbwr.hyperchat.com/newchat-cgi/bwr.cgi?vqxus=Visitor&vqxro=gossip@bwr&vqxha=Visitor&vqvab=beware@bwr&vqxti=1219269220#newtalk",
      "name": "Beware Castle",
      "background": "/bwr/defback.jpg",
      "roomBase" : "",
      "userBase" : "http://!!!.castlebeware.com/"
    },
    "jag": {
      "url": "http://jag.hyperchat.com/",
      "mainRoom": "jaghall",
      "hotRoom": "hotlist",
      "gossipRoom": "seeall",
      "hotUrl": "http://jag.hyperchat.com/newchat-cgi/jag.cgi?vqxus=Visitor&vqxro=c+Control+Centre@jag&vqxha=Visitor&vqvab=jaghall@jag&vqvaa=hotlist&vqxti=1219269469#newtalk",
      "SeeAllUrl": "http://sbwr.hyperchat.com/newchat-cgi/bwr.cgi?vqxus=Visitor&vqxro=gossip@bwr&vqxha=Visitor&vqvab=beware@bwr&vqxti=1219269220#newtalk",
      "name": "Justice Alliance of Gor",
      "background": "/jag/defback.jpg",
      "roomBase" : "http://jagroom.hyperchat.com/!!!/",
      "userBase" : "http://!!!.jaghome.com/"
    },
    "gor": {
      "url": "http://gor.hyperchat.com/",
      "mainRoom": "gor",
      "hotRoom": "hotlist",
      "gossipRoom": "seeall",
      "hotUrl": "http://gor.hyperchat.com/newchat-cgi/gor.cgi?vqxus=Visitor&vqxro=c+Control+Centre@gor&vqxha=Visitor&vqvab=m@gor&vqvaa=hotlist&vqxti=1219270100#newtalk",
      "SeeAllUrl": "http://gor.hyperchat.com/newchat-cgi/gor.cgi?vqxus=Visitor&vqxro=seeall@gor&vqxha=Visitor&vqvab=m@gor&vqxti=1219270120#newtalk",
      "name": "The Gorean Realm",
      "background": "/gor/defback.jpg",
      "roomBase" : "http://gor.hyperchat.com/newchat/r/!!!/~gor/",
      "userBase" : "http://!!!.realgor.com/"
    },
    "ns": {
      "url": "http://ns.hyperchat.com/",
      "mainRoom": "homeroom",
      "hotRoom": "hotlist",
      "gossipRoom": "seeall",
      "hotUrl": "http://ns.hyperchat.com/newchat-cgi/ns.cgi?vqxus=Visitor&vqxro=c+Control+Centre@ns&vqxha=Visitor&vqvab=m@ns&vqvaa=hotlist&vqxti=1219270287#newtalk",
      "SeeAllUrl": "http://ns.hyperchat.com/newchat-cgi/ns.cgi?vqxus=Visitor&vqxro=seeall@ns&vqxha=Visitor&vqvab=m@ns&vqxti=1219270217#newtalk",
      "name": "The Night Sky",
      "background": "/ns/frgback.jpg",
      "roomBase" : "http://nsroom.hyperchat.com/!!!/",
      "userBase" : ""
    },
    "my": {
      "url": "http://medievalyore.com/",
      "mainRoom": "tavern",
      "hotRoom": "hotlist",
      "gossipRoom": "seeall",
      "SeeAllUrl": "http://myore.hyperchat.com/newchat-cgi/my.cgi?vqxus=Visitor&vqxro=seeall@my&vqxha=Visitor&vqvab=tavern@my&vqxti=1219267293#newtalk",
      "hotUrl": "http://myore.hyperchat.com/newchat-cgi/my.cgi?vqxus=Visitor&vqxro=c+Control+Centre@my&vqxha=Visitor&vqvab=tavern@my&vqvaa=hotlist&vqxti=1219267323#newtalk",
      "name": "Medieval Yore",
      "background": "/frgback.jpg",
      "roomBase" : "http://room.medievalyore.com/!!!/",
      "userBase" : "http://!!!.medievalyore.com/"
    },
    "soe": {
      "url": "http://soe.hyperchat.com/",
      "mainRoom": "honor",
      "hotRoom": "hotlist",
      "gossipRoom": "view",
      "SeeAllUrl": "http://soe.hyperchat.com/newchat-cgi/soe.cgi?vqxus=Visitor&vqxro=view@soe&vqxha=Visitor&vqvab=honor@soe&vqxti=1219270685#newtalk",
      "hotUrl": "http://soe.hyperchat.com/newchat-cgi/soe.cgi?vqxus=Visitor&vqxro=c+Control+Centre@soe&vqxha=Visitor&vqvab=honor@soe&vqvaa=hotlist&vqxti=1219270690#newtalk",
      "name": "State of Enchantment",
      "background": "soe/defback.jpg",
      "roomBase" : "http://soe.hyperchat.com/newchat/r/!!!/~soe/",
      "userBase" : "http://soe.hyperchat.com/newchat/u/!!!/~soe/"
    },
    "mansion": {
      "url": "http://mansion.hyperchat.com/",
      "mainRoom": "lobby",
      "hotRoom": "hotlist",
      "gossipRoom": "talking",
      "SeeAllUrl": "http://mansion.hyperchat.com/newchat-cgi/mansion.cgi?vqxus=Visitor&vqxro=talking@mansion&vqxha=Visitor&vqvab=lobby@mansion&vqxti=1219270780#newtalk",
      "hotUrl": "http://mansion.hyperchat.com/newchat-cgi/mansion.cgi?vqxus=Visitor&vqxro=c+Control+Centre@mansion&vqxha=Visitor&vqvab=lobby@mansion&vqvaa=hotlist&vqxti=1219270798#newtalk",
      "name": "The Mansion",
      "background": "/mansion/defback.jpg",
      "roomBase" : "http://mansion.hyperchat.com/newchat/r/!!!/~mansion/",
      "userBase" : "http://mansion.hyperchat.com/newchat/u/!!!/~mansion/"
    },
    "isle": {
      "url": "http://isle.hyperchat.com/",
      "mainRoom": "tc",
      "hotRoom": "hotlist",
      "gossipRoom": "seeall",
      "SeeAllUrl": "http://isle.hyperchat.com/newchat-cgi/isle.cgi?vqxus=Visitor&vqxro=seeall@isle&vqxha=Visitor&vqvab=tc@isle&vqxti=1219270873#newtalk",
      "hotUrl": "http://isle.hyperchat.com/newchat-cgi/isle.cgi?vqxus=Visitor&vqxro=c+Control+Centre@isle&vqxha=Visitor&vqvab=tc@isle&vqvaa=hotlist&vqxti=1219270939#newtalk",
      "name": "Isle of Pain and Pleasure",
      "background": "/isle/defback.jpg",
      "roomBase" : "http://isleroom.hyperchat.com/!!!/",
      "userBase" : "http://isleuser.hyperchat.com/!!!/"
    },
    "resort": {
      "url": "http://resort.hyperchat.com/",
      "mainRoom": "labrys",
      "hotRoom": "hotlist",
      "gossipRoom": "loft",
      "SeeAllUrl": "http://resort.hyperchat.com/newchat-cgi/resort.cgi?vqxus=Visitor&vqxro=loft@resort&vqxha=Visitor&vqvab=labrys@resort&vqxti=1219271019#newtalk",
      "hotUrl": "http://resort.hyperchat.com/newchat-cgi/resort.cgi?vqxus=Visitor&vqxro=c+Control+Centre@resort&vqxha=Visitor&vqvab=labrys@resort&vqvaa=hotlist&vqxti=1219271069#newtalk",
      "name": "The Rainbow Resort",
      "background": "/resort/defback.jpg",
      "roomBase" : "http://resort.hyperchat.com/newchat/r/!!!/~resort/",
      "userBase" : "http://resort.hyperchat.com/newchat/u/!!!/~resort/"
    },
    "war": {
      "url": "http://www.war-site.com/",
      "mainRoom": "war",
      "hotRoom": "hotlist",
      "gossipRoom": "seeall",
      "SeeAllUrl": "http://www.war-site.com/newchat-cgi/war.cgi?vqxus=Visitor&vqxro=seeall@war&vqxha=Visitor&vqvab=war@war&vqxti=1219272545#newtalk",
      "hotUrl": "http://www.war-site.com/newchat-cgi/war.cgi?vqxus=Visitor&vqxro=c+Control+Centre@war&vqxha=Visitor&vqvab=war@war&vqvaa=hotlist&vqxti=1219272570#newtalk",
      "name": "The Warriors Realm",
      "background": "/defback.jpg",
      "roomBase" : "http://room.war-site.com/!!!/",
      "userBase" : "http://!!!.war-site.com"
    },
    "waw": {
      "url": "http://waw.hyperchat.com/",
      "mainRoom": "ooc",
      "hotRoom": "hotlist",
      "gossipRoom": "seeall",
      "SeeAllUrl": "http://waw.hyperchat.com/newchat-cgi/waw.cgi?vqxus=Visitor&vqxro=seeall@waw&vqxha=Visitor&vqvab=ooc@waw&vqxti=1219762304#newtalk",
      "hotUrl": "http://waw.hyperchat.com/newchat-cgi/waw.cgi?vqxus=Visitor&vqxro=c+Control+Centre@waw&vqxha=Visitor&vqvab=ooc@waw&vqvaa=hotlist&vqxti=1219762298#newtalk",
      "name": "Witches and Wizards RPG",
      "background": "/waw/frgback.jpg",
      "roomBase" : "http://wawroom.hyperchat.com/!!!/",
      "userBase" : "http://!!!.wawhome.com/"
    }
  };
  
  //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  function prepToolbar() {
    var bar = document.createElement("div");    
    var inn = "span";
    var logo = document.createElement(inn);
    
    bar.id = "hchat_toolbar";
    bar.className = "hchat";
    
    var ver = myDom.createTag("span", " (Version: " + myStats.version + ")");
    
    logo.appendChild(myDom.createATag(homeUrl + "hchat_controls.html", "[ChatPlus Controls]"));
    logo.appendChild(ver);
    
    logo.appendChild(document.createTextNode("["));
    logo.appendChild(myDom.createLinkToRoom("chatplus@soi", "#r-chatplus@soi"));
    logo.appendChild(document.createTextNode("] for latest news and comments"));
    logo.style.textAlign="left";
    logo.style.width = "70%";
    bar.appendChild(logo);
    
    if (isABetaVersion) {
      logo = document.createElement(inn);
      logo.appendChild(document.createTextNode(" . . . . . "));
      
      logo.appendChild(document.createTextNode("[DEBUG]"));
      logo.style.textAlign="right";
      logo.style.width = "30%";
      bar.appendChild(logo);
      
      
      addEvent(bar, 'click',
               (function() {
               return function(event) {
                       myDom.displayPopupDiv(event);
                       };
               }())
               );
    }
    
    //document.body.insertBefore(logo, document.body.firstChild);
    document.body.insertBefore(bar, document.body.firstChild);
  }    
  
  //alert("Clearing realm list");
  //GM_setValue("realmList", defaultRealmList.toSource());
  
  var XX;
  XX = getRealmList();
  
  realmList = eval( "(" + XX + ")");
  
  if (isHot || isChatRoom || $$_MAILFORM || isFtpRoom || isNickRoom) {
    addEvent(window, "load", function(event) {
             makeFormIds();
             fixmyList(realmList);
             fixmyList(newRealm);
             
             var master = realmList[":masterSettings:"];
             
             prepToolbar();
             if (!chatPlusLocal) {
               GM_update(myStats.sname, myStats.version, myStats.updateUrl, myStats.versionUrl);
             }
             
             
             var style = [];
             style.push('div.hchat {');
             style.push('margin: 0 auto 0 auto;');
             style.push('border-bottom: 1px solid #000000; margin-bottom: 5px;');
             style.push('font-size: small; background-color: #000000;');
             style.push('color: #ffffff;');
             style.push('}');
             
             style.push('.popupdiv {');
             style.push('position: absolute;');
             style.push('width: auto;');
             style.push('padding: 5px;');
             style.push('background: #ffc;');
             style.push('border-style:ridge;');
             style.push('color: #000;');
             style.push('z-index: 1000;');
             
             style.push('}');
             
             style.push('.popupdiv a {color: green; text-decoration: none;}');
             
             style.push('div.hchat a {');
             style.push('color: white;');
             style.push('text-decoration: none;');
             style.push('}');
             
             style.push('a.subtle { border: 1px dotted; font-size:.5em }');
             
             style.push('div.hchat p {');
             style.push('margin: 2px 0 1px 0;');
             style.push('}');
             
             style.push('.cssbutton {');
             style.push(' background: #fff;');
             style.push(' padding: 1px;');
             style.push(' font-size: small;');
             style.push(' font-variant : small-caps;');
             style.push(' border : 1px solid #aaa;');
             style.push(' text-align: center;');
             style.push('}');
             
             style.push('.cssbutton .buttonleft {');
             style.push(' color: #f8f8f8;');
             style.push(' background: #a42;');
             style.push(' padding: 0px 3px 0px 3px;');
             style.push(' text-align: center;');
             style.push('}');
             
             style.push('.cssbutton .buttonright {');
             style.push(' color: #f8f8f8;');
             style.push(' background: #886;');
             style.push(' padding: 0px 2px 0px 3px;');
             style.push(' text-align: center;');
             style.push('}');
             
             style.push('table.hotTable {border: 5px ridge; width: 80%;}');
             style.push('table.hotTable tr {border: 2px ridge; width: 100%;}');
             style.push('table.hotTable td.left {border: 2px ridge; width: 20%;}');
             style.push('table.hotTable td.right {border: 2px ridge; width: 80%;}');
             
             style.push('#centerdiv {');
             style.push(' width: 80% ;');
             style.push(' margin-left: auto ;');
             style.push(' margin-right: auto ;');
             style.push(' color: white;');
             style.push(' background: black;');
             style.push('}');
             
             style.push("fieldset.hchat_mail {");
             style.push("  background-image:url('http://soiroom.hyperchat.com/chatplus/BG-Puzzle.gif');");
             style.push("  color: black;");
             style.push("}");
             
             style.push(".chatplus_replace {");
             style.push("  background: black;");
             style.push("  color: yellow;");
             style.push("}");
             
             style.push('.chatPlus_nick {');
             if (isChatRoom && master.showhp !== "false") {
               style.push('border-bottom-style:dotted;');
             }
             style.push(' cursor: pointer;');
             style.push('}');
             
             if (master.ulinemode === "reset") {
               style.push('a { text-decoration:underline !important;}');
               style.push('A:HOVER { cursor: pointer !important; }');
             }
             
             GM_addStyle(style.join("\r\n"));
             
             
    } );
  }
    
  if (isHot) {
    //prepHotRoom();
    // MyaddEvent(node, evname, _fn) {
    addEvent(window, "load", function(event) {
             hotListBuilder();
             });
  }
  
  
  if (isNickRoom) {
    addEvent(window, "load", function(event) {
             upgradeNickRoom();
             } );
  }
  
  if (isFtpRoom) {
    addEvent(window, "load", function(event) {
             upgradeFtpRoom();
             } );
  }
  
  if (isChatRoom) {
    addEvent(window, "load", function(event) {
             upgradeChat();
             } );
  }
  
  if (window.location.toString().indexOf("chatplus_homepage") !== -1) {
    addEvent(window, "load", function(event) {
             
             var returnLink = GM_getValue("returnLink");
             if (!returnLink) {
               return;
             }
             var a;
             var c;
             
             a = myDom.createATag(returnLink, "[Return to Room]");
             c = myDom.createTag("center", a);
             document.body.insertBefore(c, document.body.firstChild);
             a = myDom.createATag(returnLink, "[Return to Room]");
             c = myDom.createTag("center", a);
             document.body.appendChild(c);
    });
  }
  
  //if (window.location.toString().indexOf("realm_") !== -1) {
  if (document.getElementById("tinker_realm_editor_soi")) {
    fixmyList(realmList);
    fixmyList(newRealm);
    
    userWindow.tailList = tailList;
    userWindow.realmList = realmList;
    userWindow.myStats = myStats;
    userWindow.newRealm = newRealm;
    userWindow.returnLink = GM_getValue("returnLink");
    
    var s = loadBig("saveData");
    if (!s) {
      userWindow.saveData = {};
    } else {
      userWindow.saveData = eval("(" + s + ")");
    }
    
    var getData = function() {
      userWindow.finishData();
      realmList = userWindow.realmList;
      saveRealmList();
    };
    
    if (document.getElementById("realmChange2")) {
      addEvent(document.getElementById("realmChange2"), "click", function(event) {
               getData();
               if (userWindow.nextUrl !== undefined) {
                 window.location.href = userWindow.nextUrl;
               } else {
                 window.location = history.go(-1);
               }
               if (event.preventDefault) {event.preventDefault(); }
               return true;
      });
    }
  }
  //}
  
  function fixIEDisplay()
  // G-d bless Internet explorer!
  // When changing data inside of table cells, the table cell itself is NOT
  // resized.
  // In chat rooms with avatars, this sometimes cuts off the very bottom
  // line of posts from people with avatars.  Hide, then display, every "td"
  // tag to  force a redraw.
  {
    var tdtags = document.getElementsByTagName("td");
    var i = tdtags.length-1;
    var t;
    while(i > 0) {
      t = tdtags[i];
      t.style.display = "none";
      t.style.display = "";
      i--;
    }
  }
  
  //if (is7Pro) {
  addEvent(window, "load", function(event) {
           fixIEDisplay();
           } );
  //}
} //End of testo

// Weird IE bug that sometimes causes ChatPlus to run twice.
// Seems to be related to the MultiLoc code.
if (userWindow.isTouched) {
  $$_ISSOI = false;
}


if ($$_ISSOI) {
  try {
  testo();
  } catch (err) {
    alert(err.toSource());
  }
  userWindow.hchatVersion =  myStats.version;
  userWindow.is7Pro = is7Pro;
  userWindow.isTouched = true;
  
  if (isControl) {
    if (is7Pro) {
      // Keep the page from displaying until it is ready...
      document.body.style.visibility = "hidden";
    }
  }
}