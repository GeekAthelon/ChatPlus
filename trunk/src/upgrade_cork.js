var upgrades = upgrades || {};

upgrades.cork = (function() {
  "use strict";

  var corkPosts;
  window.soiDetails = identifySoi();

  function nuke() {
    saveBucket({});
  }

  function saveBucket(v) {
    var s = JSON.stringify(v);
    localStorage.setItem("cork_" + window.soiDetails.fullRoomName, s);
  }

  function getBucket() {
    var s = localStorage.getItem("cork_" + window.soiDetails.fullRoomName);
    if (!s) {
      return {};
    }

    try {
      s = JSON.parse(s);
    } catch (e) {
      alert("Bucket error - clearing");
      s = {};
    }

    return s;
  }

  function parseCork() {
    // There might be another list on the page, so be specific.
    var lis = document.querySelectorAll("li a i");
    corkPosts = [];

    var results = [];
    forEachNode(lis, function(el, idx) {
      try {
        var post = this;
        while (post.tagName.toLowerCase() !== 'li') {
          post = post.parentNode;
        }

        var result = {};

        result.timeStamp = post.querySelector("a").textContent.trim();
        result.isCitizenPost = null;
        result.nickElement = post.querySelector("b").textContent;
        result.title = post.querySelector("i ~ i").previousSibling.textContent;
        result.reactions = parseInt(post.querySelector("i ~ i").textContent, 10);
        result.title = result.title.slice(0, -3).trim();

        corkPosts.push(post);
        results.push(result);
      } catch (err) {
        cpConsole.log("parseCork: Died on cork entry - " + idx + 1);
      }
    });

    return results;
  }

  function createClickHandler(post) {
    return function(_post) {
      var userHasSeen = getBucket();
      var lastLook = userHasSeen[_post.timeStamp] || {};
      lastLook.reactions = _post.reactions;
      lastLook.isNew = false;
      userHasSeen[_post.timeStamp] = lastLook;

      // Have any posts expired?
      var dateElements = document.querySelectorAll("li > a");
      var dates = [];
      forEachNode(dateElements, function(dateElement) {
        var date = dateElement.textContent.substring(0, 16);
        dates.push(date);
      });

      Object.keys(userHasSeen).forEach(function(date) {
        if (dates.indexOf(date) === -1) {
          delete userHasSeen[date];
          //console.log("Deleting memory of cork entry: " + date);
        }
      });

      saveBucket(userHasSeen);
    }(post);
  }

  function renderNewFlags(posts) {
    var userHasSeen = getBucket();

    posts.forEach(function(post, i) {
      var lastLook = userHasSeen[post.timeStamp];

      var title;
      var flag;

      if (!lastLook) {
        lastLook = {
          reactions: 0,
          isNew: true
        };
      }

      if (lastLook.isNew) {
        flag = '*';
        title = "This post has never been read";
      } else if (lastLook.reactions === post.reactions) {
        flag = '-';
        title = "All messages on this thread read";
      } else {
        var tmp = post.reactions - lastLook.reactions;
        flag = tmp;
        if (tmp === 1) {
          title = "" + tmp + " message unread";
        } else {
          title = "" + tmp + " messages unread";
        }
      }

      var link = corkPosts[i].querySelector("a");
      link.innerHTML += " <b class='chatplus_cork_count'>[" + flag + "]</b>";
      link.title = title;
      link.setAttribute("data-cp-cork-flag", flag);

      //TESTING
      link.setAttribute("data-cp-cork-reactions", post.reactions);

      addEvent(link, 'click', function(e) {
        if (typeof QUnit === "object") {
          e.stopPropagation();
          e.preventDefault();
        }
        createClickHandler(post);
      });

      var name = link.parentNode.querySelector("a + b");
      if (name) {
        var info = createUserInfo(name);
        name.className += "chatPlus_nick";
        name.title = info.text;
        name.setAttribute("data-nick", info.fullSoiStyleName);
      }

    });

    saveBucket(userHasSeen);
  }

  function renderTimeAgo(posts, soiTimeStamp, isDst) {
    var soiDate = new Date(soiTimeStamp * 1000);

    posts.forEach(function(post, i) {
      var el = corkPosts[i].querySelector("i");
      var corkDateStamp = el.textContent;
      var corkDate =  dateTimeHandler.getDateFromDateString(corkDateStamp, soiTimeStamp, isDst);

      var ago = dateTimeHandler.timeDifference(soiDate, corkDate);
      var span = document.createElement("span");
      span.innerHTML = ago;
      span.className = "cp-corkago";

      el.parentNode.parentNode.insertBefore(span, el.parentNode);

    });
  }


  function upgrade() {
    //TEST
    var old = document.querySelectorAll(".chatplus_cork_count");
    forEachNode(old, function() {
      this.parentNode.removeChild(this);
    });

    var form = document.querySelector("[name=vqvaj]");
    while (form.tagName.toLowerCase() !== "form") {
      form = form.parentNode;
    }

    var soiTimeString = form.textContent;
    var soiTimeStamp = document.querySelector("[name=vqxti]").value;
    var isDst = dateTimeHandler.isSoiDst(soiTimeStamp, soiTimeString);

    var posts = parseCork();
    renderNewFlags(posts);
    // renderTimeAgo(posts, soiTimeStamp, isDst);
  }

  var internals = {
    parseCork: parseCork,
    nuke: nuke,
    saveBucket: saveBucket,
    getBucket: getBucket
  };

  return {
    upgrade: upgrade,
    internals: internals
  };
}());
