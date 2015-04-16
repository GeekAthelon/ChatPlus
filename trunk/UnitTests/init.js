QUnit.config.autostart = false;

var Promise = ES6Promise.Promise

var allScripts = {};

function getScript(url) {

  var loadingWindow = document.getElementById("loading-screen");
  var div = document.createElement("div");
  div.innerHTML = "Loading ..." + url;
  loadingWindow.appendChild(div);

  return new Promise(function(m_resolve, m_reject) {
    var ajaxPromise = new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
	        allScripts[url] = this.response;
            resolve(this.response);
          } else {
            var msg = 'getScript: `' + url + '` failed with status: [' + this.status + ']'
            failure(msg);
            reject(new Error(msg));
          }
        }
      };
    });

    var scriptPromise = new Promise(function(resolve, reject) {
      var script = document.createElement("script");
      document.body.appendChild(script);

      script.onload = function() {
        resolve();
      };

      script.onerror = function(err) {
        console.log(arguments);
        reject("getScript failed on " + url + ":");
      }

      script.src = url;
      return;
    });

    Promise.all([ajaxPromise, scriptPromise]).then(function() {
      loadingWindow.removeChild(div);
      m_resolve();
    }, function(err) {
      m_reject(err)
    });
  });
}

function getHtml(url) {
  function failure(reason) {
    var loadingWindow = document.getElementById("loading-screen");
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(reason));
    loadingWindow.appendChild(div);
  }

  var loadingWindow = document.getElementById("loading-screen");
  var div = document.createElement("div");
  div.innerHTML = "Loading ..." + url;
  loadingWindow.appendChild(div);

  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', url);
    xhr.onreadystatechange = handler;
    //xhr.responseType = 'json';
    //xhr.setRequestHeader('Accept', 'application/json');
    xhr.send();

    function handler() {
      if (this.readyState === this.DONE) {
        if (this.status === 200) {
          loadingWindow.removeChild(div);
          resolve(this.response);
        } else {
          var msg = 'getHtml: `' + url + '` failed with status: [' + this.status + ']'
          failure(msg);
          reject(new Error(msg));
        }
      }
    };
  });
}

/*
				      getHtml('pages/chatroom-demo.html').then(function(html) {
				        alert("Success: html length = " + html.length);
				      }, function(reason) {
				        alert("Died: " + reason);
				      });
				*/
function getIframeWindow(iframe_object) {
  var doc;

  if (iframe_object.contentWindow) {
    return iframe_object.contentWindow;
  }

  if (iframe_object.window) {
    return iframe_object.window;
  }

  if (!doc && iframe_object.contentDocument) {
    doc = iframe_object.contentDocument;
  }

  if (!doc && iframe_object.document) {
    doc = iframe_object.document;
  }

  if (doc && doc.defaultView) {
    return doc.defaultView;
  }

  if (doc && doc.parentWindow) {
    return doc.parentWindow;
  }

  return undefined;
}

function fillTemplate(name, html) {
  var ifrm = document.createElement("iframe");
  ifrm.src = "about:blank";
  document.body.appendChild(ifrm);
  var w = getIframeWindow(ifrm);

  var iframeDoc = ifrm.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(html);
  iframeDoc.close();

  var bodyHtml = iframeDoc.getElementsByTagName("body")[0].innerHTML;

  var container = document.createElement("script");
  container.id = name;
  container.type = "text/html";
  container.innerHTML = bodyHtml;

  //document.body.insertBefore(container, document.body.firstChild);
  document.body.appendChild(container);

  ifrm.parentNode.removeChild(ifrm);
}

function loadPages() {
  return new Promise(function(resolve, reject) {
    Promise.all([
      getHtml('pages/chatroom.html'),
      getHtml('pages/hotlist.html'),
      getHtml('pages/mailroom.html'),
      getHtml('pages/internal-structures.html'),
      getHtml('pages/controls-nickname.html'),
      getHtml('pages/controls-ftp-files.html'),
      getHtml('pages/cork.html'),
      getHtml('pages/chatroom-auto.html')
    ]).then(function(values) {
      fillTemplate("chatroom-template", values[0]);
      fillTemplate("hotlist-template", values[1]);
      fillTemplate("mailroom-template", values[2]);
      fillTemplate("internal-structures-template", values[3]);
      fillTemplate("controls-nickname-template", values[4]);
      fillTemplate("controls-ftp-files-template", values[5]);
      fillTemplate("cork-template", values[6]);
      fillTemplate("chatroom-auto-template", values[7]);
      resolve();
    });
  })
}

/*
				//<zscript src="qtests/chatroom-refresh.js"></zscript>
				function loadScripts() {
				  return new Promise(function(resolve, reject) {

				    getScript('../trunk/src/globals.js')
				      .then(function() {
				        return getScript('../trunk/src/taillist.js')
				      })
				      .then(function() {
					    console.log(arguments);
				        return getScript('../trunk/src/utils.js')
				      })
				      .then(function() {
				        return getScript('../trunk/src/shortcut.js')
				      })
				      .then(function() {
				        return getScript('../trunk/src/text.js')
				      })
				      .then(function() {
				        return getScript('../trunk/src/mainbody.js')
				      })
				      .then(function() {
				        return getScript('../trunk/src/upgrade_hotlist.js')
				      })
				      .then(function() {
				        return getScript('../trunk/src/upgrade_chat.js')
				      })
				      .then(function() {
				        return getScript('../trunk/src/upgrade_mail.js')
				      })
				      .then(function() {
				        return getScript('../trunk/src/buddypanel.js')
				      })
				      .then(function() {
				        return getScript('../trunk/src/upgrade_nickroom.js')
				      })
				      .then(function() {
				        return getScript('../trunk/src/upgrade_ftproom.js')
				      })
				      .then(function() {
				        return getScript('../trunk/src/upgrade_cork.js')
				      })
				      .then(function() {
				        return getScript('../trunk/src/preptoolbar.js')
				      })
				      .then(function() {
				        return getScript('../trunk/src/controlpanel.js')
				      })
				      .then(function() {
				        return getScript('qtests/internals.js')
				      })
				      .then(function() {
				        return getScript('qtests/hotlist.js')
				      })
				      .then(function() {
				        return getScript('qtests/chatroom.js')
				      })
				      .then(function() {
				        return getScript('qtests/mailroom.js')
				      })
				      .then(function() {
				        return getScript('qtests/controls-nickname.js')
				      })
				      .then(function() {
				        return getScript('qtests/controls-ftp-files.js')
				      })
				      .then(function() {
				        return getScript('qtests/cork.js')
				      })
				      .then(function() {
				        resolve();
				      }, function(err) {
					    reject(err);
				      });
				  });
				}
				*/

var scripts = [
  '../src/globals.js',
  '../src/taillist.js',
  '../src/utils.js',
  '../src/shortcut.js',
  '../src/text.js',
  '../src/mainbody.js',
  '../src/upgrade_hotlist.js',
  '../src/upgrade_chat.js',
  '../src/upgrade_mail.js',
  '../src/buddypanel.js',
  '../src/upgrade_nickroom.js',
  '../src/upgrade_ftproom.js',
  '../src/upgrade_cork.js',
  '../src/preptoolbar.js',
  '../src/controlpanel.js',
  'qtests/internals.js',
  'qtests/hotlist.js',
  'qtests/chatroom.js',
  'qtests/mailroom.js',
  'qtests/controls-nickname.js',
  'qtests/controls-ftp-files.js',
  'qtests/cork.js',
  'post-test.js'
];

function loadScripts() {
  var prevPromise = Promise.resolve(); // initial Promise always resolves

  scripts.forEach(function(title) { // loop through each title
    prevPromise = prevPromise.then(function() { // prevPromise changes in each iteration
      return getScript(title);
    });
  });

  return prevPromise;
}

function lockAndLoad() {
  var test1 = loadPages();
  var test2 = loadScripts();

  Promise.all([test1, test2]).then(function() {
      //return values;
      var loading = document.getElementById("loading-screen");
      loading.parentNode.removeChild(loading);
      QUnit.start();
    },
    function(err) {
      alert(err);
    });
}

window.addEventListener("load", function() {
  window.setTimeout(lockAndLoad, 1);
});

var promise = new Promise(function(resolve, reject) {
  // on success		
  //resolve("Resolved");
  // on failure
  //reject(reason);
});

promise.then(function(value) {
  alert("Resolve");
}, function(reason) {
  alert("Rejected " + reason);
});