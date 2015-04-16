function urlDecode (encodedString) {
  var output = encodedString;
  var binVal, thisString;
  var myregexp = /(%[^%]{2})/;
  while ((match = myregexp.exec(output)) != null
             && match.length > 1
             && match[1] != '') {
    binVal = parseInt(match[1].substr(1),16);
    thisString = String.fromCharCode(binVal);
    output = output.replace(match[1], thisString);
  }
  return output;
}




/* dltypeof.js
*  by Peter Belesis. v1.0 040823
*  Copyright (c) 2004 Peter Belesis. All Rights Reserved.
*  Originally published and documented at http://www.dhtmlab.com/
*/

function dltypeof( vExpression )
{
  var sTypeOf = typeof vExpression;
  if( sTypeOf == "function" )
  {
    var sFunction = vExpression.toString();
    if( ( /^\/.*\/$/ ).test( sFunction ) )
    {
      return "regexp";
    }
    else if( ( /^\[object.*\]$/i ).test( sFunction ) )
    {
      sTypeOf = "object"
    }
  }
  if( sTypeOf != "object" )
  {
    return sTypeOf;
  }
  
  switch( vExpression )
  {
  case null:
    return "null";
  case window:
    return "window";
  case window.event:
    return "event";
  }
  
  if( window.event && ( event.type == vExpression.type ) )
  {
    return "event";
  }
  
  var fConstructor = vExpression.constructor;
  if( fConstructor != null )
  {
    switch( fConstructor )
    {
    case Array:
      sTypeOf = "array";
      break;
    case Date:
      return "date";
    case RegExp:
      return "regexp";
    case Object:
      sTypeOf = "jsobject";
      break;
    case ReferenceError:
      return "error";
    default:
      var sConstructor = fConstructor.toString();
      var aMatch = sConstructor.match( /\s*function (.*)\(/ );
                                      if( aMatch != null )
                                      {
                                        return aMatch[ 1 ];
                                      }
    }
  }
  
  var nNodeType = vExpression.nodeType;
  if( nNodeType != null )
  {
    switch( nNodeType )
    {
    case 1:
      if( vExpression.item == null )
      {
        return "domelement";
      }
      break;
    case 3:
      return "textnode";
    }
  }
  
  if( vExpression.toString != null )
  {
    var sExpression = vExpression.toString();
    var aMatch = sExpression.match( /^\[object (.*)\]$/i );
    if( aMatch != null )
    {
      var sMatch = aMatch[ 1 ];
      switch( sMatch.toLowerCase() )
      {
      case "event":
        return "event";
      case "math":
        return "math";
      case "error":
        return "error";
      case "mimetypearray":
        return "mimetypecollection";
      case "pluginarray":
        return "plugincollection";
      case "windowcollection":
        return "window";
      case "nodelist":
      case "htmlcollection":
      case "elementarray":
        return "domcollection";
      }
    }
  }
  
  if( vExpression.moveToBookmark && vExpression.moveToElementText )
  {
    return "textrange";
  }
  else if( vExpression.callee != null )
  {
    return "arguments";
  }
  else if( vExpression.item != null )
  {
    return "domcollection";
  }
  
  return sTypeOf;
}

function populateScreen(thisForm, controlNames, obj) {
  var i;
  var a;
  var o;
  
  for( i = 0; i <controlNames.length; i++) {
    a = controlNames[i];
    o = obj[a];
    if (dltypeof(o).toLowerCase() === "array") {
      thisForm[a].value = o.join("   ");
    } else {
      thisForm[a].value = o; 
    }
  }
}


function populateObject(thisForm, controlNames, obj) {
  var i;
  var a;
  var o;
  
  for( i = 0; i <controlNames.length; i++) {
    a = controlNames[i];
    o = obj[a];
    if (dltypeof(o).toLowerCase() === "array") {
      obj[a] = thisForm[a].value.toLowerCase().split(/\s+/);
    } else {
      obj[a]  = thisForm[a].value; 
    }
  }
}

function doesRealmExist(n)
{
  return (!!realmList[n]); 
}

function isRealmNameValid(n) {
  n = n.toLowerCase();
  var o = n.replace(/[^a-zA-Z0-9]+/g,'');
  
  if (n.length < 2) { return false; }
  if (n.length > 8) { return false; }
  if (o !== n) {return false; }
  return true;
}



Object.prototype.deep_clone = function(){
  eval("var tmp = " + this.toJSON());
  return tmp;
}


Object.prototype.toJSON = function(){
  var json = [];
  for(var i in this){
    if(!this.hasOwnProperty(i)) continue;
    //if(typeof this[i] == "function") continue;
    json.push(
              i.toJSON() + " : " +
              ((this[i] != null) ? this[i].toJSON() : "null")
              )
  }
  return "{\n " + json.join(",\n ") + "\n}";
}
Array.prototype.toJSON = function(){
  for(var i=0,json=[];i<this.length;i++)
    json[i] = (this[i] != null) ? this[i].toJSON() : "null";
  return "["+json.join(", ")+"]"
}

String.prototype.toJSON = function(){
  return '"' +
  this.replace(/(\\|\")/g,"\\$1")
  .replace(/\n|\r|\t/g,function(){
           var a = arguments[0];
           return  (a == '\n') ? '\\n':
           (a == '\r') ? '\\r':
           (a == '\t') ? '\\t': ""
  }) +
  '"'
}
Boolean.prototype.toJSON = function(){return this}
Function.prototype.toJSON = function(){return this}
Number.prototype.toJSON = function(){return this}
RegExp.prototype.toJSON = function(){return this}

// strict but slow
String.prototype.toJSON = function(){
  var tmp = this.split("");
  for(var i=0;i<tmp.length;i++){
    var c = tmp[i];
    (c >= ' ') ?
    (c == '\\') ? (tmp[i] = '\\\\'):
    (c == '"')  ? (tmp[i] = '\\"' ): 0 :
    (tmp[i] = 
     (c == '\n') ? '\\n' :
     (c == '\r') ? '\\r' :
     (c == '\t') ? '\\t' :
     (c == '\b') ? '\\b' :
     (c == '\f') ? '\\f' :
     (c = c.charCodeAt(),('\\u00' + ((c>15)?1:0)+(c%16)))
     )
  }
  return '"' + tmp.join("") + '"';
}


function tagCreate(tag, text)
{
  var t = document.createElement(tag);
  if (typeof text === "undefined") {
  } else if (typeof text === "string") {
    t.appendChild(document.createTextNode(text));
  } else {
    t.appendChild(text);
  }
  return t;
}


function tagCreateA(url, text) {
  var a;
  // HACK:
  // Wiggle our way around event bubbling and trouble preventing defaults
  // by turning dry "#" links into spans.
  if (url !== "#") {
    a = tagCreate("a", text);
    a.href = url;
  } else {
    a = tagCreate("span", text);
    a.style.textDecoration = "underline";
    a.style.cursor = "pointer";
  }
  return a;
}


Array.prototype._swap=function(a, b)
{
  var tmp=this[a];
  this[a]=this[b];
  this[b]=tmp;
};


function arrayToTextField(a)
{
  return a.join("      ");
}


function domClearContent(el) {
  // first clone the object, without it's child elements.
  nEl = el.cloneNode(false);
  // Pop the new element in before the old one.
  el.parentNode.insertBefore(nEl,el);
  // Now get rid of the one that has all that icky content
  el.parentNode.removeChild(el);
}


// Get a parameter from the URL
// Taken from: http://www.netlobo.com/url_query_string_javascript.html
function gup( name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}

function gpn( ) // gpn stands for 'get parameter names'
{
  var params = new Array( );
  var regex = /[\?&]([^=]+)=/g;
  while( ( results = regex.exec( window.location.href ) ) != null )
    params.push( results[1] );
  return params;
}



/*
Developed by Robert Nyman, http://www.robertnyman.com
Code/licensing: http://code.google.com/p/getelementsbyclassname/
*/	
var getElementsByClassName = function (className, tag, elm){
  if (document.getElementsByClassName) {
    getElementsByClassName = function (className, tag, elm) {
      elm = elm || document;
      var elements = elm.getElementsByClassName(className),
      nodeName = (tag)? new RegExp("\\b" + tag + "\\b", "i") : null,
      returnElements = [],
      current;
      for(var i=0, il=elements.length; i<il; i+=1){
        current = elements[i];
        if(!nodeName || nodeName.test(current.nodeName)) {
          returnElements.push(current);
        }
      }
      return returnElements;
    };
  }
  else if (document.evaluate) {
    getElementsByClassName = function (className, tag, elm) {
      tag = tag || "*";
      elm = elm || document;
      var classes = className.split(" "),
      classesToCheck = "",
      xhtmlNamespace = "http://www.w3.org/1999/xhtml",
      namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace)? xhtmlNamespace : null,
      returnElements = [],
      elements,
      node;
      for(var j=0, jl=classes.length; j<jl; j+=1){
        classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
      }
      try	{
        elements = document.evaluate(".//" + tag + classesToCheck, elm, namespaceResolver, 0, null);
      }
      catch (e) {
        elements = document.evaluate(".//" + tag + classesToCheck, elm, null, 0, null);
      }
      while ((node = elements.iterateNext())) {
        returnElements.push(node);
      }
      return returnElements;
    };
  }
  else {
    getElementsByClassName = function (className, tag, elm) {
      tag = tag || "*";
      elm = elm || document;
      var classes = className.split(" "),
      classesToCheck = [],
      elements = (tag === "*" && elm.all)? elm.all : elm.getElementsByTagName(tag),
      current,
      returnElements = [],
      match;
      for(var k=0, kl=classes.length; k<kl; k+=1){
        classesToCheck.push(new RegExp("(^|\\s)" + classes[k] + "(\\s|$)"));
      }
      for(var l=0, ll=elements.length; l<ll; l+=1){
        current = elements[l];
        match = false;
        for(var m=0, ml=classesToCheck.length; m<ml; m+=1){
          match = classesToCheck[m].test(current.className);
          if (!match) {
            break;
          }
        }
        if (match) {
          returnElements.push(current);
        }
      }
      return returnElements;
    };
  }
  return getElementsByClassName(className, tag, elm);
};




// return the value of the radio button that is checked
// return an empty string if none are checked, or
// there are no radio buttons
function getCheckedValue(radioObj) {
  if(!radioObj)
    return "";
  var radioLength = radioObj.length;
  if(radioLength == undefined)
    if(radioObj.checked)
    return radioObj.value;
  else
    return "";
  for(var i = 0; i < radioLength; i++) {
    if(radioObj[i].checked) {
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
  if(!radioObj)
    return;
  var radioLength = radioObj.length;
  if(radioLength == undefined) {
    radioObj.checked = (radioObj.value == newValue.toString());
    return;
  }
  for(var i = 0; i < radioLength; i++) {
    radioObj[i].checked = false;
    if(radioObj[i].value == newValue.toString()) {
      radioObj[i].checked = true;
    }
  }
}

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

function checkVersion2(ver) {
  var needUpgrade = false;
  var current, version;
  
  // A really old version that doesn't export myStats?  Upgrade
  if (!window.myStats) {
    needUpgrade = true;
  }
  
  version = ver.split(".");
  current = window.myStats.version.split(".");
  
  version = expandVersion(version);
  current = expandVersion(current);
  
  if (version > current) {
    needUpgrade = true;
  }
  
  if (needUpgrade) {
    window.location.href = "http://soiroom.hyperchat.com/chatplus/update.html";
  }
}

function checkVersion()
{ 
  var xhr; 
  try {  xhr = new ActiveXObject('Msxml2.XMLHTTP');   }
  catch (e) 
  {
    try {   xhr = new ActiveXObject('Microsoft.XMLHTTP');    }
    catch (e2) 
    {
      try {  xhr = new XMLHttpRequest();     }
      catch (e3) {  xhr = false;   }
    }
  }
  
  xhr.onreadystatechange  = function()
  { 
    if(xhr.readyState  == 4)
    {
      if(xhr.status === 200 || xhr.status === 0) {
        checkVersion2(xhr.responseText);
      } else {
        alert("Error: " + xhr.responseText);
      }
    }
  }; 
  
  xhr.open("POST", "hchatv.txt",  true); 
  xhr.send(null); 
} 


window.prepWindow = function() {  
  if (!window.hchatVersion) {
    window.location = "http://soiroom.hyperchat.com/chatplus/update.html";
  }

  var a;
  var c;
  if (!!window.returnLink) {
    a = tagCreateA(returnLink, "[Return to Room]");
    c = tagCreate("center", a);
    document.body.insertBefore(c, document.body.firstChild);
  }
  checkVersion();
  window.nextUrl = window.returnLink;
}

if (window.is7Pro) {
  if (window.prepWindow) { window.prepWindow(); }
  if (window.testPrep) { window.testPrep(); }
  document.body.style.visibility = "";
} else {
  addEvent(window, 'load', function() {
           if (window.prepWindow) { window.prepWindow(); }
           if (window.testPrep) { window.testPrep(); }
           document.body.style.visibility = "";
  });
}
