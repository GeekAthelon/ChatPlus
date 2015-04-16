var upgradeCork = function () {
  "use strict";
  
  var roomName = document.getElementsByName("vqxro")[0].value;
  var timeStamp, reactions;
  var aElement;
  var span;
  var liData;
  var oldLiData;
  var userHasSeen = getBucket();
  var newBucket = {};

  var els;
  var node;
  var list = [];
  
  var tmp;
  // First, let us just read through the current ol and make a list of the message timestamp and 
  // reactions.  The timestamp is the closest thing we have to a message ID right now.  

  els = document.querySelectorAll("li a i");
    
  for (var i = 0; i < els.length; i++) {
    node = els[i].parentNode.parentNode;
	
	aElement = node.querySelector("a");
    timeStamp = aElement.textContent;

	var reactionsEls = node.querySelectorAll("i");
	reactionsEls = reactionsEls[reactionsEls.length-1]
	reactions = reactionsEls.textContent;
    reactions = parseInt(reactions, 10);


    oldLiData = userHasSeen[timeStamp];
    if (!oldLiData) {
      oldLiData = {
        reactions: 0
      };
    }

    liData = {};
    liData.timeStamp = timeStamp;
    liData.reactions = oldLiData.reactions;
    liData.highlight = false;
	
    if (!userHasSeen[timeStamp]  || oldLiData.isNew) {
      liData.status = '*';
      liData.message = "New message";
      liData.highlight = true;
	  liData.isNew = true;
    } else if (userHasSeen[timeStamp].reactions === undefined) {
      liData.status = '*';
      liData.message = "This post has never been read";
    } else if (+reactions === +oldLiData.reactions) {
      liData.status = '-';
      liData.message = "All messages on this thread read";
    } else {
      liData.highlight = true;
      tmp =  reactions - oldLiData.reactions;
      liData.status = tmp;
      if (tmp === 1) {
        liData.message = "" + tmp + " message unread";
      } else {
        liData.message = "" + tmp + " messages unread";
      }
    }

    newBucket[timeStamp] = liData;
    list.push([node, aElement, liData, reactions]);
  }

  saveBucket(newBucket)

  var i;
  for (i = 0; i < list.length; i++) {
    node = list[i][0];
    aElement = list[i][1];
    liData = list[i][2];
    reactions = list[i][3];

    span = document.createElement("span");
    span.appendChild(document.createTextNode(" [" + liData.status + "]"));
    span.className = "chatplus_cork_count";
	if (liData.highlight) {
	  span.className += ' chatplus_cork_highlight';
	}
	
    aElement.title = liData.message;

    var f = (function (z, _reactions) {
      return function (event) {
        updateSeen(z, _reactions)
      };
    }(liData, reactions));

    aElement.appendChild(span);
    addEvent(aElement, 'click', f);

    /*
	span = document.createElement("span");	
    span.appendChild(document.createTextNode(" EraseData-Testing "));
    addEvent(span, 'click',  nuke);
	node.appendChild(span);
    //*/
  }

  function updateSeen(liData, reactions) {
    var userHasSeen = getBucket();

    var e = userHasSeen[liData.timeStamp];
    e.reactions = reactions;
	e.isNew = false;
    userHasSeen[liData.timeStamp] = e;
    saveBucket(userHasSeen);
  }


  function nuke() {
    alert("Data nuked");
    saveBucket({});
  }

  function saveBucket(s) {
    s = JSON.stringify(s);
    localStorage.setItem("cork_" + roomName, s);
  }

  function getBucket() {
    var s = localStorage.getItem("cork_" + roomName);
    if (!s) {
      return {};
    }

    try {
      s = JSON.parse(s);
    } catch (e) {
      alert("Bucket error - clearing");
      s = {};
    }
    //cpConsole.log(JSON.stringify(s));	
    return s;
  }

};