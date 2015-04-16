
/////////////////////////////////////////////////////////////////////////////
//Taken from:
//http://users.on.net/~ihatescarves/addEvent.html


function addEvent(obj, evType, fn)
{
  if (obj.addEventListener)
    return obj.addEventListener(evType, fn, false);
  
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
    if (obj['on' + evType] && (obj['on' + evType] != null))
      obj.eventCache[evType].push(obj['on' + evType]);
    
    obj['on' + evType] = addEvent.raiseEvents;
  }
  
  // Make sure the event is only added once
  if (obj.eventCache[evType].indexOf(fn) < 0)
    obj.eventCache[evType].push(fn);  
}

//
// Removes an event - parameters are the same as addEvent.
//
function removeEvent(obj, evType, fn)
{
  if (obj.removeEventListener)
    return obj.removeEventListener(evType, fn, false);
  
  if (!obj.eventCache || !obj.eventCache[evType])
    return;
  
  var index = obj.eventCache[evType].indexOf(fn);
  
  if (index > -1)
    obj.eventCache[evType].splice(index, 1);
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
    r = (((typeof(fr) == 'undefined') || fr) && r);
  }
  
  // Only return if false - otherwise it screws onbeforeunload up
  if (!r)
    return false;
}

//
// Unloads all the added events on unload to free memory in IE
//
addEvent.unloadEvents = function(e)
{
  if (! window.eventObjects) return;
  if (! window.eventObjects.length) return;
  
  for (var i = 0; i < window.eventObjects.length; i++)
  {
    for (var n in window.eventObjects[i].eventCache)
      window.eventObjects[i]['on' + n] = null;
    
    window.eventObjects[i].eventCache = null;
  }
  
  window.eventObjects = null;
};


// Array methods
if (!Array.indexOf)
  Array.prototype.indexOf = function(searchElement, fromIndex)
{
  if (!fromIndex)
    fromIndex = 0;
  
  // If fromIndex is less than zero it's an offset from the end
  if (fromIndex < 0)
    fromIndex = (this.length + fromIndex <= 0) ? 0 : this.length - 1 + fromIndex;
  
  // Make sure it's an object at the very least
  for (var i = fromIndex; i < this.length; i++)
  {
    if (this[i] == searchElement)
      return i;
  }
  return -1;
}

if (!Array.push)
  Array.prototype.push = function(elements)
{
  for (var i = 0; i < arguments.length; i++)
    this[this.length] = arguments[i];
  return this.length;		
}

if (!Array.splice)
  Array.prototype.splice = function(index, howMany, elements)
{
  var removed = [];
  var numberToAdd = arguments.length - 2;
  var difference  = numberToAdd - howMany;
  var newLength   = this.length + difference;
  
  if (index > this.length)
    index = this.length;
  
  if (index < 0)
    index = (this.length + index < 0) ? 0 : this.length - 1 + index;
  
  if (howMany < 0)
    howMany = 0;
  
  // Remove anything to be removed
  if ((howMany > 0) && (index < this.length))
  {
    if (index + howMany > this.length)
      howMany = this.length - index;
    
    for (var i = index; i < index + howMany; i++)
      removed.push(this[i]);
  }
  
  // Move the remaning elements back and chop off the remainder
  if (howMany > numberToAdd)
  {
    for (i = index + numberToAdd; i < newLength; i++)
      this[i] = this[i - difference];
    
    this.length = newLength;
  }
  
  // Make room for the new stuff
  if (howMany < numberToAdd)
  {	
    var count = 1;
    for (i = this.length - 1; i >= index + howMany; i--)
    {
      this[newLength - count] = this[i];
      count++;
    }
  }
  
  // Add any items that need adding
  for (var i = 0; i < numberToAdd; i++)
    this[index + i] = arguments[i + 2];
  
  return removed;
}


var oHead = document.getElementsByTagName('HEAD')[0]
var oScript= document.createElement("script");
oScript.type = "text/javascript";
oScript.src="hchat2.js";
oHead.appendChild( oScript);

