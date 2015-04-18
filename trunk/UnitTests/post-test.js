/* jshint ignore:start */
var jsHintOptions = {
  bitwise: true, //This option prohibits the use of bitwise operators such as ^ (XOR), | (OR) and others. Bitwise operators are very rare in JavaScript programs and quite often & is simply a mistyped &&.
  //_camelcase: null, //This option allows you to force all variable names to use either camelCase style or UPPER_CASE with underscores.
  curly: true, //This option requires you to always put curly braces around blocks in loops and conditionals. JavaScript allows you to omit curly braces when the block consists of only one statement, for example:
  //_enforceall: null, //This option is a short hand for the most strict JSHint configuration. It enables all enforcing options and disables all relaxing options.
  eqeqeq: true, //This options prohibits the use of == and != in favor of === and !==. The former try to coerce values before comparing them which can lead to some unexpected results. The latter don't do any coercion so they are generally safer. If you would like to learn more about type coercion in JavaScript, we recommend Truth, Equality and JavaScript by Angus Croll.
  es3: false, //This option tells JSHint that your code needs to adhere to ECMAScript 3 specification. Use this option if you need your program to be executable in older browsers—such as Internet Explorer 6/7/8/9—and other legacy JavaScript environments.
  //es5: true, //This option enables syntax first defined in the ECMAScript 5.1 specification. This includes allowing reserved keywords as object properties.
  forin: false, //This option requires all for in loops to filter object's items. The for in statement allows for looping through the names of all of the properties of an object including those inherited through the prototype chain. This behavior can lead to unexpected items in your object so it is generally safer to always filter inherited properties out as shown in the example:
  freeze: true, //This options prohibits overwriting prototypes of native objects such as Array, Date and so on.
  futurehostile: true, //This option enables warnings about the use of identifiers which are defined in future versions of JavaScript. Although overwriting them has no effect in contexts where they are not implemented, this practice can cause issues when migrating codebases to newer versions of the language.
  globals: "", //This option can be used to specify a white list of global variables that are not formally defined in the source code. This is most useful when combined with the undef option in order to suppress warnings for project-specific global variables.
  //Setting an entry to true enables reading and writing to that variable. Setting it to false will trigger JSHint to consider that variable read-only.
  //See also the "environment" options: a set of options to be used as short hand for enabling global variables defined in common JavaScript environments.
  globalstrict: true, //This option suppresses warnings about the use of global strict mode. Global strict mode can break third-party widgets so it is not recommended.
  //_immed: null, //This option prohibits the use of immediate function invocations without wrapping them in parentheses. Wrapping parentheses assists readers of your code in understanding that the expression is the result of a function, and not the function itself.
  //_indent: null, //This option sets a specific tab width for your code.
  iterator: false, //This option suppresses warnings about the __iterator__ property. This property is not supported by all browsers so use it carefully.
  latedef: true, //This option prohibits the use of a variable before it was defined. JavaScript has function scope only and, in addition to that, all variables are always moved—or hoisted— to the top of the function. This behavior can lead to some very nasty bugs and that's why it is safer to always use variable only after they have been explicitly defined.
  //Setting this option to "nofunc" will allow function declarations to be ignored.
  //maxcomplexity	
  //This option lets you control cyclomatic complexity throughout your code. Cyclomatic complexity measures the number of linearly independent paths through a program's source code. Read more about cyclomatic complexity on Wikipedia.
  //maxdepth	
  //This option lets you control how nested do you want your blocks to be:
  maxerr: 60, //This options allows you to set the maximum amount of warnings JSHint will produce before giving up. Default is 50.
  //_maxlen: null, //This option lets you set the maximum length of a line.
  maxparams: 5, //This option lets you set the max number of formal parameters allowed per function:
  //maxstatements	: 99, //This option lets you set the max number of statements allowed per function:
  //_newcap: null, //This option requires you to capitalize names of constructor functions. Capitalizing functions that are intended to be used with new operator is just a convention that helps programmers to visually distinguish constructor functions from other types of functions to help spot mistakes when using this.
  noarg: true, //This option prohibits the use of arguments.caller and arguments.callee. Both .caller and .callee make quite a few optimizations impossible so they were deprecated in future versions of JavaScript. In fact, ECMAScript 5 forbids the use of arguments.callee in strict mode.
  nocomma: true, //This option prohibits the use of the comma operator. When misused, the comma operator can obscure the value of a statement and promote incorrect code.
  //_noempty: null, //This option warns when you have an empty block in your code. JSLint was originally warning for all empty blocks and we simply made it optional. There were no studies reporting that empty blocks in JavaScript break your code in any way.
  nonbsp: true, //This option warns about "non-breaking whitespace" characters. These characters can be entered with option-space on Mac computers and have a potential of breaking non-UTF8 web pages.
  nonew: true, //This option prohibits the use of constructor functions for side-effects. Some people like to call constructor functions without assigning its result to any variable:
  notypeof: false, //This option suppresses warnings about invalid typeof operator values. This operator has only a limited set of possible return values. By default, JSHint warns when you compare its result with an invalid value which often can be a typo.
  //_quotmark: null, //This option enforces the consistency of quotation marks used throughout your code. It accepts three values: true if you don't want to enforce one particular style but want some consistency, "single" if you want to allow only single quotes and "double" if you want to allow only double quotes.
  shadow: false, //This option suppresses warnings about variable shadowing i.e. declaring a variable that had been already declared somewhere in the outer scope.
  singleGroups: false, //This option prohibits the use of the grouping operator when it is not strictly required. Such usage commonly reflects a misunderstanding of unary operators, for example:
  unused: true, //This option warns when you define and never use your variables. It is very useful for general code cleanup, especially when used in addition to undef.
  asi: false, //This option suppresses warnings about missing semicolons. There is a lot of FUD about semicolon spread by quite a few people in the community. The common myths are that semicolons are required all the time (they are not) and that they are unreliable. JavaScript has rules about semicolons which are followed by all browsers so it is up to you to decide whether you should or should not use semicolons in your code.
  boss: false, //This option suppresses warnings about the use of assignments in cases where comparisons are expected. More often than not, code like if (a = 10) {} is a typo. However, it can be useful in cases like this one:
  debug: false, //This option suppresses warnings about the debugger statements in your code.
  elision: false, //This option tells JSHint that your code uses ES3 array elision elements, or empty elements (for example, [1, , , 4, , , 7]).
  eqnull: false, //This option suppresses warnings about == null comparisons. Such comparisons are often useful when you want to check if a variable is null or undefined.
  esnext: false, //This option tells JSHint that your code uses ECMAScript 6 specific syntax. Note that these features are not finalized yet and not all browsers implement them.
  evil: false, //This option suppresses warnings about the use of eval. The use of eval is discouraged because it can make your code vulnerable to various injection attacks and it makes it hard for JavaScript interpreter to do certain optimizations.
  expr: false, //This option suppresses warnings about the use of expressions where normally you would expect to see assignments or function calls. Most of the time, such code is a typo. However, it is not forbidden by the spec and that's why this warning is optional.
  lastsemic: false, //This option suppresses warnings about missing semicolons, but only when the semicolon is omitted for the last statement in a one-line block:
  //_laxbreak: null, //This option suppresses most of the warnings about possibly unsafe line breakings in your code. It doesn't suppress warnings about comma-first coding style. To suppress those you have to use laxcomma (see below).
  //_laxcomma: null, //Warning This option has been deprecated and will be removed in the next major release of JSHint. JSHint is limiting its scope to issues of code correctness. If you would like to enforce rules relating to code style, check out the JSCS project.
  loopfunc: true, //This option suppresses warnings about functions inside of loops. Defining functions inside of loops can lead to bugs such as this one:
  moz: false, //This options tells JSHint that your code uses Mozilla JavaScript extensions. Unless you develop specifically for the Firefox web browser you don't need this option.
  //_multistr: null, //This option suppresses warnings about multi-line strings. Multi-line strings can be dangerous in JavaScript because all hell breaks loose if you accidentally put a whitespace in between the escape character (\) and a new line.
  noyield: false, //This option suppresses warnings about generator functions with no yield statement in them.
  phantom: false, //This option defines globals available when your core is running inside of the PhantomJS runtime environment. PhantomJS is a headless WebKit scriptable with a JavaScript API. It has fast and native support for various web standards: DOM handling, CSS selector, JSON, Canvas, and SVG.
  plusplus: false, //This option prohibits the use of unary increment and decrement operators. Some people think that ++ and -- reduces the quality of their coding styles and there are programming languages—such as Python—that go completely without these operators.
  proto: false, //This option suppresses warnings about the __proto__ property.
  scripturl: false, //This option suppresses warnings about the use of script-targeted URLs—such as javascript:....
  strict: false, //This option requires all functions to run in ECMAScript 5's strict mode. Strict mode is a way to opt in to a restricted variant of JavaScript. Strict mode eliminates some JavaScript pitfalls that didn't cause errors by changing them to produce errors. It also fixes mistakes that made it difficult for the JavaScript engines to perform certain optimizations.
  sub: true, //DEPRECIATED This option suppresses warnings about using [] notation when it can be expressed in dot notation: person['name'] vs. person.name.
  supernew: false, //This option suppresses warnings about "weird" constructions like new function () { ... } and new Object;. Such constructions are sometimes used to produce singletons in JavaScript:
  validthis: false, //This option suppresses warnings about possible strict violations when the code is running in strict mode and you use this in a non-constructor function. You should use this option—in a function scope only—when you are positive that your use of this is valid in the strict mode (for example, if you call your function using Function.call).
  withstmt: false, //This option suppresses warnings about the use of the with statement. The semantics of the with statement can cause confusion among developers and accidental definition of global variables.
  browser: true, //This option defines globals exposed by modern browsers: all the way from good old document and navigator to the HTML5 FileReader and other new developments in the browser world.
  browserify: false, //This option defines globals available when using the Browserify tool to build a project.
  couch: false, //This option defines globals exposed by CouchDB. CouchDB is a document-oriented database that can be queried and indexed in a MapReduce fashion using JavaScript.
  devel: true, //This option defines globals that are usually used for logging poor-man's debugging: console, alert, etc. It is usually a good idea to not ship them in production because, for example, console.log breaks in legacy versions of Internet Explorer.
  dojo: false, //This option defines globals exposed by the Dojo Toolkit.
  jasmine: false, //This option defines globals exposed by the Jasmine unit testing framework.
  jquery: false, //This option defines globals exposed by the jQuery JavaScript library.
  mocha: false, //This option defines globals exposed by the "BDD" and "TDD" UIs of the Mocha unit testing framework.
  mootools: false, //This option defines globals exposed by the MooTools JavaScript framework.
  node: false, //This option defines globals available when your code is running inside of the Node runtime environment. Node.js is a server-side JavaScript environment that uses an asynchronous event-driven model. This option also skips some warnings that make sense in the browser environments but don't make sense in Node such as file-level use strict pragmas and console.log statements.
  nonstandard: false, //This option defines non-standard but widely adopted globals such as escape and unescape.
  prototypejs: false, //This option defines globals exposed by the Prototype JavaScript framework.
  qunit: true, //This option defines globals exposed by the QUnit unit testing framework.
  rhino: false, //This option defines globals available when your code is running inside of the Rhino runtime environment. Rhino is an open-source implementation of JavaScript written entirely in Java.
  shelljs: false, //This option defines globals exposed by the ShellJS library.
  typed: false, //This option defines globals for typed array constructors.
  worker: false, //This option defines globals available when your code is running inside of a Web Worker. Web Workers provide a simple means for web content to run scripts in background threads.
  wsh: false, //This option defines globals available when your code is running as a script for the Windows Script Host.
  yui: true //This option defines globals exposed by the YUI JavaScript framework.
};
/* jshint ignore:end */

QUnit.done(function(details) {

  function showFixture(templateId, details) {
    var fixture = document.getElementById("qunit-fixture");
    fixture.style.position = "static";
    fixture.style.height = "inherit";
    fixture.style.width = "inherit";
    fixture.innerHTML = "";
    if (details.failed) {
      fixture.style.border = "2px solid red";
    }
  }

  function jsHintTests(templateId, details) {
    showFixture(templateId, details);
    var fixture = document.getElementById("qunit-fixture");

    var template = "{line}:{character} {formatted}  <i>{evidence}</i>";

    var keys = Object.keys(allScripts);

    keys.forEach(function(key) {
      if (key === "../trunk/src/shortcut.js") {
        return;
      }

      var status = JSHINT(allScripts[key], jsHintOptions);

      if (status) {
        return;
      }

      var out = "<h1>" + key + ":" + status + "</h1>";
      out += "<pre>";

      JSHINT.errors.forEach(function(err) {
        out += "<p>";
        if (!err) {
          return;
        }

        err.formatted = stringFormat(err.raw, err);
        out += stringFormat(template, err);
        out += "</p>";
      });

      out += "</pre>";

      fixture.innerHTML += out;
    });
  }

  function prepAfterDone(templateId, details) {
    if (templateId === "--jshint--") {
      jsHintTests(templateId, details);
      return;
    }
    resetGlobals();
    addGlobalListeners();

    var div = document.querySelectorAll("#hchat_toolbar");
    forEachNode(div, function() {
      this.parentNode.removeChild(this);
    });

    showFixture(templateId, details);
    var fixture = document.getElementById("qunit-fixture");

    var template = document.getElementById(templateId);
    if (!template) {
      return;
    }
    var html = template.innerHTML;
    fixture.innerHTML = "";

    fixture.innerHTML = html;

    myStats = {
      "sname": "QUNIT TEST",
      "updateUrl": "http://invalidhomeurl.invalid",
      "version": "###VERSION### (build ###BUILD###)",
      "ver": +"###VERSION###"
    };

    soiDetails = identifySoi();

    var master = realmList[":masterSettings:"];
    prepToolbar();
    setStyles(master);

    if (soiDetails.isHot) {
      fixmyList(realmList);
      fixmyList(newRealm);
    }

    if (soiDetails.isHot) {
      upgrades.hotlist.upgrade();
    }

    if (soiDetails.isNickRoom) {
      upgrades.control_nicknames.upgrade();
    }

    if (soiDetails.isFtpRoom) {
      upgrades.control_ftp_files.upgrade();
    }

    if (soiDetails.isChatRoom) {
      upgrades.chatroom.upgrade();
    }

    if (soiDetails.isCork) {
      var test1 = {
        "Mon Feb 02 18:11": {
          reactions: 3
        }
      };

      upgrades.cork.internals.saveBucket(test1);
      upgrades.cork.upgrade();
    }
  }

  function addButton(txt, id) {
    var button = document.createElement("button");
    button.innerHTML = txt;
    div.appendChild(button);

    button.onclick = function() {
      window.name = id;
      prepAfterDone(id, details);
    };
    div.appendChild(document.createTextNode(" "));
  }

  console.log("Total: ", details.total, " Failed: ", details.failed, " Passed: ", details.passed, " Runtime: ", details.runtime);
  var templates = document.querySelectorAll('[id$="-template"]');

  var div;
  div = document.getElementById("switcher");
  if (div) {
    div.parentNode.removeChild(div);
  }

  div = document.createElement("div");
  div.id = 'switcher';

  div.innerHTML = "Choose a page to view:";

  document.body.insertBefore(div, document.body.firstChild);

  addButton("**NONE**", null);
  forEachNode(templates, function() {
    var id = this.id;
    if (id === "internal-structures-template") {
      return;
    }
    var txt = id.replace("-template", "");
    addButton(txt, id);
  });
  addButton("--jshint--", "--jshint--");

  if (window.name) {
    prepAfterDone(window.name, details);
  }
});