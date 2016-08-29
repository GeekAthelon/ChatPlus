"use strict";

function getWindowsTempDir() {
  return new ActiveXObject("Scripting.FileSystemObject").GetSpecialFolder(2);
}

function mkdir_r(dir) {
  var fso = new ActiveXObject("Scripting.FileSystemObject");
  var bits = dir.split("\\");

  var bit;
  var i, l;
  var s;

  l = bits.length;
  s = bits[0];
  for (i = 1; i < l; i++) {
    bit = bits[i];
    s += "/" + bit;
    if (!fso.FolderExists(s)) {
      fso.CreateFolder(s);
    }
  }
}

function getSaveDir() {
  var LOCALAPPDATA = 0x1c;
  var path = new ActiveXObject("Shell.Application").NameSpace(LOCALAPPDATA).Self.Path;
  path += "\\athelon\\chatplus";
  mkdir_r(path);
  return path;
}

var gmGetValue = function (p1, p2) {
  var p = getSaveDir();
  var fname = p + "\\" + p1;
  var r = ie_readFile(fname);
  if (r === null) {
    return p2;
  } else {
    return JSON.parse(r);
  }
};

var gmSetValue = function (p1, p2) {
  var p = getSaveDir();
  var fname = p + "\\" + p1;
  var v = JSON.stringify(p2);
  var r = ie_writeFile(fname, v);
};


function GM_addStyle(css) {
  var doc = changeFrame();
  var heads = doc.getElementsByTagName("head");
  var style = doc.createElement("style");
  style.setAttribute("type", "text/css");
  if (style.styleSheet) { // IE
    style.styleSheet.cssText = css;
  } else { // w3c
    var cssText = doc.createTextNode(css);
    style.appendChild(cssText);
  }
  heads[0].appendChild(style);
}

function GM_getResourceText(r) {
  var fname = resources[r];
  if (!fname) {
    throw ("GM_getResourceText: unknown resource");
  }
  return ie_readFile(fname);
}


var resources = {
  version: "js/version.txt"
};

function resize() {
  var tbar = document.getElementById('toolbar');
  var tbharh = tbar.offsetHeight;

  var iframe = document.getElementById('ifrm');
  setIframeHeight('ifrm', 1, tbharh);
  iframe.style.position = "absolute";
  iframe.style.top = "0px";
  iframe.style.left = "0px";
  iframe.style.width = "100%";
}

function setIframeHeight(id, h, offset) {
  if (document.getElementById) {
    var theIframe = document.getElementById(id);
    if (theIframe) {
      dw_Viewport.getWinHeight();
      theIframe.style.height = Math.round((h * dw_Viewport.height)) - offset + "px";
      //theIframe.style.marginTop = Math.round((dw_Viewport.height - parseInt(theIframe.style.height)) / 2) + "px";
      theIframe.style.marginTop = offset;
    }
  }
}

var dw_Viewport = {
  getWinWidth: function () {
    this.width = 0;
    if (window.innerWidth) this.width = window.innerWidth - 18;
    else if (document.documentElement && document.documentElement.clientWidth) this.width = document.documentElement.clientWidth;
    else if (document.body && document.body.clientWidth) this.width = document.body.clientWidth;
    return this.width;
  },

  getWinHeight: function () {
    this.height = 0;
    if (window.innerHeight) this.height = window.innerHeight - 18;
    else if (document.documentElement && document.documentElement.clientHeight) this.height = document.documentElement.clientHeight;
    else if (document.body && document.body.clientHeight) this.height = document.body.clientHeight;
    return this.height;
  },

  getScrollX: function () {
    this.scrollX = 0;
    if (typeof window.pageXOffset == "number") this.scrollX = window.pageXOffset;
    else if (document.documentElement && document.documentElement.scrollLeft) this.scrollX = document.documentElement.scrollLeft;
    else if (document.body && document.body.scrollLeft) this.scrollX = document.body.scrollLeft;
    else if (window.scrollX) this.scrollX = window.scrollX;
    return this.scrollX;
  },

  getScrollY: function () {
    this.scrollY = 0;
    if (typeof window.pageYOffset == "number") this.scrollY = window.pageYOffset;
    else if (document.documentElement && document.documentElement.scrollTop) this.scrollY = document.documentElement.scrollTop;
    else if (document.body && document.body.scrollTop) this.scrollY = document.body.scrollTop;
    else if (window.scrollY) this.scrollY = window.scrollY;
    return this.scrollY;
  },

  getAll: function () {
    this.getWinWidth();
    this.getWinHeight();
    this.getScrollX();
    this.getScrollY();
  }
}


function changeFrame() {
  var oIframe = document.getElementById("ifrm");
  var oDoc = oIframe.contentWindow || oIframe.contentDocument;
  if (oDoc.document) {
    oDoc = oDoc.document;
  }
  return oDoc;
}


var globalFunction = null;

function runIt() {
  iFrameHistory.onload();
  var ifrm = document.getElementById("ifrm");
  ifrm.contentWindow.document.body.onclick = function () {
    var e = ifrm.contentWindow.event;
    if (globalFunction) {
      globalFunction(e);
    }
    globalFunction = null;
  }

  function i2() {
    if (ifrm.readyState === "complete") {
      runAll(changeFrame(), true, window);
    }
    window.setTimeout(i2, 500); // See if the document changed.
  }
  window.setTimeout(i2, 1);
}

function chatPlusHtaInit() {
  var iframe = document.getElementById('ifrm');

  document.body.appendChild(iframe);
  resize();
}
window.onload = chatPlusHtaInit;

window.onresize = function () {
  resize()
};



// Domain Public by Eric Wendelin http://eriwen.com/ (2008)
//                  Luke Smith http://lucassmith.name/ (2008)
//                  Loic Dachary <loic@dachary.org> (2008)
//                  Johan Euphrosine <proppy@aminche.com> (2008)
//                  Oyvind Sean Kinsey http://kinsey.no/blog (2010)
//                  Victor Homyakov <victor-homyakov@users.sourceforge.net> (2010)
/**
* Main function giving a function stack trace with a forced or passed in Error
*
* @cfg {Error} e The error to create a stacktrace from (optional)
* @cfg {Boolean} guess If we should try to resolve the names of anonymous functions
* @return {Array} of Strings with functions, lines, files, and arguments where possible
*/
function printStackTrace(options) {
  options = options || {
    guess: true
  };
  var ex = options.e || null,
  guess = !! options.guess;
  var p = new printStackTrace.implementation(),
  result = p.run(ex);
  return (guess) ? p.guessAnonymousFunctions(result) : result;
}

printStackTrace.implementation = function () {};

printStackTrace.implementation.prototype = {
  /**
  * @param {Error} ex The error to create a stacktrace from (optional)
  * @param {String} mode Forced mode (optional, mostly for unit tests)
  */
  run: function (ex, mode) {
    ex = ex || this.createException();
    // examine exception properties w/o debugger
    //for (var prop in ex) {alert("Ex['" + prop + "']=" + ex[prop]);}
    mode = mode || this.mode(ex);
    if (mode === 'other') {
      return this.other(arguments.callee);
    } else {
      return this[mode](ex);
    }
  },

  createException: function () {
    try {
      this.undef();
    } catch (e) {
      return e;
    }
  },

  /**
  * Mode could differ for different exception, e.g.
  * exceptions in Chrome may or may not have arguments or stack.
  *
  * @return {String} mode of operation for the exception
  */
  mode: function (e) {
    if (e['arguments'] && e.stack) {
      return 'chrome';
    } else if (typeof e.message === 'string' && typeof window !== 'undefined' && window.opera) {
      // e.message.indexOf("Backtrace:") > -1 -> opera
      // !e.stacktrace -> opera
      if (!e.stacktrace) {
        return 'opera9'; // use e.message
      }
      // 'opera#sourceloc' in e -> opera9, opera10a
      if (e.message.indexOf('\n') > -1 && e.message.split('\n').length > e.stacktrace.split('\n').length) {
        return 'opera9'; // use e.message
      }
      // e.stacktrace && !e.stack -> opera10a
      if (!e.stack) {
        return 'opera10a'; // use e.stacktrace
      }
      // e.stacktrace && e.stack -> opera10b
      if (e.stacktrace.indexOf("called from line") < 0) {
        return 'opera10b'; // use e.stacktrace, format differs from 'opera10a'
      }
      // e.stacktrace && e.stack -> opera11
      return 'opera11'; // use e.stacktrace, format differs from 'opera10a', 'opera10b'
    } else if (e.stack) {
      return 'firefox';
    }
    return 'other';
  },

  /**
  * Given a context, function name, and callback function, overwrite it so that it calls
  * printStackTrace() first with a callback and then runs the rest of the body.
  *
  * @param {Object} context of execution (e.g. window)
  * @param {String} functionName to instrument
  * @param {Function} function to call with a stack trace on invocation
  */
  instrumentFunction: function (context, functionName, callback) {
    context = context || window;
    var original = context[functionName];
    context[functionName] = function instrumented() {
      callback.call(this, printStackTrace().slice(4));
      return context[functionName]._instrumented.apply(this, arguments);
    };
    context[functionName]._instrumented = original;
  },

  /**
  * Given a context and function name of a function that has been
  * instrumented, revert the function to it's original (non-instrumented)
  * state.
  *
  * @param {Object} context of execution (e.g. window)
  * @param {String} functionName to de-instrument
  */
  deinstrumentFunction: function (context, functionName) {
    if (context[functionName].constructor === Function && context[functionName]._instrumented && context[functionName]._instrumented.constructor === Function) {
      context[functionName] = context[functionName]._instrumented;
    }
  },

  /**
  * Given an Error object, return a formatted Array based on Chrome's stack string.
  *
  * @param e - Error object to inspect
  * @return Array<String> of function calls, files and line numbers
  */
  chrome: function (e) {
    var stack = (e.stack + '\n').replace(/^\S[^\(]+?[\n$]/gm, '').
    replace(/^\s+at\s+/gm, '').
    replace(/^([^\(]+?)([\n$])/gm, '{anonymous}()@$1$2').
    replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, '{anonymous}()@$1').split('\n');
    stack.pop();
    return stack;
  },

  /**
  * Given an Error object, return a formatted Array based on Firefox's stack string.
  *
  * @param e - Error object to inspect
  * @return Array<String> of function calls, files and line numbers
  */
  firefox: function (e) {
    return e.stack.replace(/(?:\n@:0)?\s+$/m, '').replace(/^\(/gm, '{anonymous}(').split('\n');
  },

  opera11: function (e) {
    // "Error thrown at line 42, column 12 in <anonymous function>() in file://localhost/G:/js/stacktrace.js:\n"
    // "Error thrown at line 42, column 12 in <anonymous function: createException>() in file://localhost/G:/js/stacktrace.js:\n"
    // "called from line 7, column 4 in bar(n) in file://localhost/G:/js/test/functional/testcase1.html:\n"
    // "called from line 15, column 3 in file://localhost/G:/js/test/functional/testcase1.html:\n"
    var ANON = '{anonymous}',
    lineRE = /^.*line (\d+), column (\d+)(?: in (.+))? in (\S+):$/;
    var lines = e.stacktrace.split('\n'),
    result = [];

    for (var i = 0, len = lines.length; i < len; i += 2) {
      var match = lineRE.exec(lines[i]);
      if (match) {
        var location = match[4] + ':' + match[1] + ':' + match[2];
        var fnName = match[3] || "global code";
        fnName = fnName.replace(/<anonymous function: (\S+)>/, "$1").replace(/<anonymous function>/, ANON);
        result.push(fnName + '@' + location + ' -- ' + lines[i + 1].replace(/^\s+/, ''));
      }
    }

    return result;
  },

  opera10b: function (e) {
    // "<anonymous function: run>([arguments not available])@file://localhost/G:/js/stacktrace.js:27\n" +
    // "printStackTrace([arguments not available])@file://localhost/G:/js/stacktrace.js:18\n" +
    // "@file://localhost/G:/js/test/functional/testcase1.html:15"
    var ANON = '{anonymous}',
    lineRE = /^(.*)@(.+):(\d+)$/;
    var lines = e.stacktrace.split('\n'),
    result = [];

    for (var i = 0, len = lines.length; i < len; i++) {
      var match = lineRE.exec(lines[i]);
      if (match) {
        var fnName = match[1] ? (match[1] + '()') : "global code";
        result.push(fnName + '@' + match[2] + ':' + match[3]);
      }
    }

    return result;
  },

  /**
  * Given an Error object, return a formatted Array based on Opera 10's stacktrace string.
  *
  * @param e - Error object to inspect
  * @return Array<String> of function calls, files and line numbers
  */
  opera10a: function (e) {
    // "  Line 27 of linked script file://localhost/G:/js/stacktrace.js\n"
    // "  Line 11 of inline#1 script in file://localhost/G:/js/test/functional/testcase1.html: In function foo\n"
    var ANON = '{anonymous}',
    lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
    var lines = e.stacktrace.split('\n'),
    result = [];

    for (var i = 0, len = lines.length; i < len; i += 2) {
      var match = lineRE.exec(lines[i]);
      if (match) {
        var fnName = match[3] || ANON;
        result.push(fnName + '()@' + match[2] + ':' + match[1] + ' -- ' + lines[i + 1].replace(/^\s+/, ''));
      }
    }

    return result;
  },

  // Opera 7.x-9.2x only!
  opera9: function (e) {
    // "  Line 43 of linked script file://localhost/G:/js/stacktrace.js\n"
    // "  Line 7 of inline#1 script in file://localhost/G:/js/test/functional/testcase1.html\n"
    var ANON = '{anonymous}',
    lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
    var lines = e.message.split('\n'),
    result = [];

    for (var i = 2, len = lines.length; i < len; i += 2) {
      var match = lineRE.exec(lines[i]);
      if (match) {
        result.push(ANON + '()@' + match[2] + ':' + match[1] + ' -- ' + lines[i + 1].replace(/^\s+/, ''));
      }
    }

    return result;
  },

  // Safari, IE, and others
  other: function (curr) {
    var ANON = '{anonymous}',
    fnRE = /function\s*([\w\-$]+)?\s*\(/i,
      stack = [],
      fn, args, maxStackSize = 10;
      while (curr && stack.length < maxStackSize) {
        fn = fnRE.test(curr.toString()) ? RegExp.$1 || ANON : ANON;
        args = Array.prototype.slice.call(curr['arguments'] || []);
        stack[stack.length] = fn + '(' + this.stringifyArguments(args) + ')';
        curr = curr.caller;
      }
      return stack;
    },

    /**
    * Given arguments array as a String, subsituting type names for non-string types.
    *
    * @param {Arguments} object
    * @return {Array} of Strings with stringified arguments
    */
    stringifyArguments: function (args) {
      var result = [];
      var slice = Array.prototype.slice;
      for (var i = 0; i < args.length; ++i) {
        var arg = args[i];
        if (arg === undefined) {
          result[i] = 'undefined';
        } else if (arg === null) {
          result[i] = 'null';
        } else if (arg.constructor) {
          if (arg.constructor === Array) {
            if (arg.length < 3) {
              result[i] = '[' + this.stringifyArguments(arg) + ']';
            } else {
              result[i] = '[' + this.stringifyArguments(slice.call(arg, 0, 1)) + '...' + this.stringifyArguments(slice.call(arg, -1)) + ']';
            }
          } else if (arg.constructor === Object) {
            result[i] = '#object';
          } else if (arg.constructor === Function) {
            result[i] = '#function';
          } else if (arg.constructor === String) {
            result[i] = '"' + arg + '"';
          } else if (arg.constructor === Number) {
            result[i] = arg;
          }
        }
      }
      return result.join(',');
    },

    sourceCache: {},

    /**
    * @return the text from a given URL
    */
    ajax: function (url) {
      var req = this.createXMLHTTPObject();
      if (req) {
        try {
          req.open('GET', url, false);
          req.send(null);
          return req.responseText;
        } catch (e) {}
      }
      return '';
    },

    /**
    * Try XHR methods in order and store XHR factory.
    *
    * @return <Function> XHR function or equivalent
    */
    createXMLHTTPObject: function () {
      var xmlhttp, XMLHttpFactories = [

        function () {
          return new XMLHttpRequest();
        }, function () {
          return new ActiveXObject('Msxml2.XMLHTTP');
        }, function () {
          return new ActiveXObject('Msxml3.XMLHTTP');
        }, function () {
          return new ActiveXObject('Microsoft.XMLHTTP');
        }];
        for (var i = 0; i < XMLHttpFactories.length; i++) {
          try {
            xmlhttp = XMLHttpFactories[i]();
            // Use memoization to cache the factory
            this.createXMLHTTPObject = XMLHttpFactories[i];
            return xmlhttp;
          } catch (e) {}
        }
      },

      /**
      * Given a URL, check if it is in the same domain (so we can get the source
      * via Ajax).
      *
      * @param url <String> source url
      * @return False if we need a cross-domain request
      */
      isSameDomain: function (url) {
        return url.indexOf(location.hostname) !== -1;
      },

      /**
      * Get source code from given URL if in the same domain.
      *
      * @param url <String> JS source URL
      * @return <Array> Array of source code lines
      */
      getSource: function (url) {
        // TODO reuse source from script tags?
        if (!(url in this.sourceCache)) {
          this.sourceCache[url] = this.ajax(url).split('\n');
        }
        return this.sourceCache[url];
      },

      guessAnonymousFunctions: function (stack) {
        for (var i = 0; i < stack.length; ++i) {
          var reStack = /\{anonymous\}\(.*\)@(.*)/,
          reRef = /^(.*?)(?::(\d+))(?::(\d+))?(?: -- .+)?$/,
          frame = stack[i],
          ref = reStack.exec(frame);

          if (ref) {
            var m = reRef.exec(ref[1]),
            file = m[1],
            lineno = m[2],
            charno = m[3] || 0;
            if (file && this.isSameDomain(file) && lineno) {
              var functionName = this.guessAnonymousFunction(file, lineno, charno);
              stack[i] = frame.replace('{anonymous}', functionName);
            }
          }
        }
        return stack;
      },

      guessAnonymousFunction: function (url, lineNo, charNo) {
        var ret;
        try {
          ret = this.findFunctionName(this.getSource(url), lineNo);
        } catch (e) {
          ret = 'getSource failed with url: ' + url + ', exception: ' + e.toString();
        }
        return ret;
      },

      findFunctionName: function (source, lineNo) {
        // FIXME findFunctionName fails for compressed source
        // (more than one function on the same line)
        // TODO use captured args
        // function {name}({args}) m[1]=name m[2]=args
        var reFunctionDeclaration = /function\s+([^(]*?)\s*\(([^)]*)\)/;
        // {name} = function ({args}) TODO args capture
        // /['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*function(?:[^(]*)/
        var reFunctionExpression = /['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*function\b/;
        // {name} = eval()
        var reFunctionEvaluation = /['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*(?:eval|new Function)\b/;
        // Walk backwards in the source lines until we find
        // the line which matches one of the patterns above
        var code = "",
        line, maxLines = Math.min(lineNo, 20),
        m, commentPos;
        for (var i = 0; i < maxLines; ++i) {
          // lineNo is 1-based, source[] is 0-based
          line = source[lineNo - i - 1];
          commentPos = line.indexOf('//');
          if (commentPos >= 0) {
            line = line.substr(0, commentPos);
          }
          // TODO check other types of comments? Commented code may lead to false positive
          if (line) {
            code = line + code;
            m = reFunctionExpression.exec(code);
            if (m && m[1]) {
              return m[1];
            }
            m = reFunctionDeclaration.exec(code);
            if (m && m[1]) {
              //return m[1] + "(" + (m[2] || "") + ")";
              return m[1];
            }
            m = reFunctionEvaluation.exec(code);
            if (m && m[1]) {
              return m[1];
            }
          }
        }
        return '(?)';
      }
    };


    var iFrameHistory = {
      history: [],
      pos: 0,
      ignore: false,

      updateUI: function () {
        var el;

        // Enable / disable back button?
        el = document.getElementById('back');
        if (iFrameHistory.pos === 1) el.className = 'disabled';
        else el.className = '';

        // Enable / disable forward button?
        el = document.getElementById('forward');
        if (iFrameHistory.pos >= iFrameHistory.history.length) el.className = 'disabled';
        else el.className = '';
      },

      back: function () {
        var newPos = Math.max(1, this.pos - 1);
        if (newPos !== this.pos) {
          this.pos = newPos;
          this.ignore = true;
          document.getElementById('ifrm').src = this.history[this.pos - 1];

          this.updateUI();
        }
      },
      forward: function () {
        var newPos = Math.min(this.history.length, this.pos + 1);
        if (newPos !== this.pos) {
          this.pos = newPos;
          this.ignore = true;
          document.getElementById('ifrm').src = this.history[this.pos - 1];

          this.updateUI();
        }
      },
      reload: function () {
        document.getElementById('ifrm').contentWindow.location.reload();
      },
      onload: function () {
        if (!this.ignore) {
          var href = document.getElementById('ifrm').contentWindow.location.href;
          if (href !== this.history[this.pos - 1]) {
            this.history.splice(this.pos, this.history.length - this.pos);
            this.history.push(href);
            this.pos = this.history.length;

            this.updateUI();
          }
        } else {
          this.ignore = false;
        }
      }
    };

    var ie_writeFile = function (fname, data) {
      var fso, fileHandle;
      try {
        fso = new ActiveXObject("Scripting.FileSystemObject");
        fileHandle = fso.CreateTextFile(fname, true);
        fileHandle.write(data);
        fileHandle.close();
      } catch (err) {
        alert("writeFile " + fname + ":" + err.message);
      }
    };

    var ie_readFile = function (fname) {
      try {
        fso = new ActiveXObject("Scripting.FileSystemObject");
        var fso, filehandle, contents;
        filehandle = fso.OpenTextFile(fname, 1);
        contents = filehandle.ReadAll();
        filehandle.Close();
        return contents;
      } catch (err) {
        alert("readFile " + fname + ":" + err.message);
        return null;
      }
    };




    function XHConn() {
      var xmlhttp, bComplete = false;
      try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {
        try {
          xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {
          try {
            xmlhttp = new XMLHttpRequest();
          } catch (e) {
            xmlhttp = false;
          }
        }
      }
      if (!xmlhttp) return null;
      this.connect = function (sURL, sMethod, sVars, fnDone) {
        if (!xmlhttp) return false;
        bComplete = false;
        sMethod = sMethod.toUpperCase();
        try {
          if (sMethod == "GET") {
            xmlhttp.open(sMethod, sURL + "?" + sVars, true);
            sVars = "";
          } else {
            xmlhttp.open(sMethod, sURL, true);
            xmlhttp.setRequestHeader("Method", "POST " + sURL + " HTTP/1.1");
            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
          }
          xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && !bComplete) {
              bComplete = true;
              fnDone(xmlhttp);
            }
          };
          xmlhttp.send(sVars);
        } catch (z) {
          return false;
        }
        return true;
      };
      return this;
    }

    function GM_xmlhttpRequest(details) {
      var xmlhttp = new ActiveXObject("microsoft.xmlhttp");
      xmlhttp.onreadystatechange = function () {
        var responseState = {
          responseXML: (xmlhttp.readyState == 4 ? xmlhttp.responseXML : ''),
          responseText: (xmlhttp.readyState == 4 ? xmlhttp.responseText : ''),
          readyState: xmlhttp.readyState,
          responseHeaders: (xmlhttp.readyState == 4 ? xmlhttp.getAllResponseHeaders() : ''),
          status: (xmlhttp.readyState == 4 ? xmlhttp.status : 0),
          statusText: (xmlhttp.readyState == 4 ? xmlhttp.statusText : '')
        }
        if (details["onreadystatechange"]) {
          details["onreadystatechange"](responseState);
        }
        if (xmlhttp.readyState == 4) {
          if (details["onload"] && xmlhttp.status >= 200 && xmlhttp.status < 300) {
            details["onload"](responseState);
          }
          if (details["onerror"] && (xmlhttp.status < 200 || xmlhttp.status >= 300)) {
            details["onerror"](responseState);
          }
        }
      }
      try {
        //cannot do cross domain
        xmlhttp.open(details.method, details.url);
      } catch (e) {
        if (details["onerror"]) {
          //simulate a real error
          details["onerror"]({
            responseXML: '',
            responseText: '',
            readyState: 4,
            responseHeaders: '',
            status: 403,
            statusText: 'Forbidden'
          });
        }
        return;
      }
      if (details.headers) {
        for (var prop in details.headers) {
          xmlhttp.setRequestHeader(prop, details.headers[prop]);
        }
      }
      xmlhttp.send((typeof (details.data) != 'undefined') ? details.data : null);
    }
