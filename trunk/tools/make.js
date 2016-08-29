var srcdir = "..\\src";
var destdir = "..\\bin";
//destdir = "C:\\Program Files (x86)\\EasyPHP-Devserver-16.1\\eds-www"
//destdir = "C:\\Users\\jjs\\Desktop\\Network\\WebTest\\EasyPHP\\www\\chatplus";

var ftpDestDir = "/rooms/chatplus";
//var ftpDestDir = "/rooms/innoff";

var uscriptdest = destdir + "\\chatplus###VERSION###.user.js";
var htadest = destdir + "\\chatplus###VERSION###.hta";
var checkversionfilename = destdir + "\\checkversion.js";

var httpSource = "http://soiroom.hyperchat.com/chatplus/";

var uscriptfilename;
var htafilename;

var filesToSend = [];

function initMake() {
  document.getElementById("version_number").value = ie_readFile('version.txt');
  document.getElementById("build_number").value = (+ie_readFile('build.txt') + 1);
  document.getElementById("build_date").value = new Date().toString();
  document.getElementById("build_comments").value = "";
}


function readJs(f) {
  return ie_readFile(srcdir + "\\" + f);
}

function build() {
  function makeUpdateCheck() {
    var f = srcdir + "\\checkversion.txt";
    var code = ie_readFile(f);
    code = doReplacement(code);
    ie_writeFile(checkversionfilename, code);
    filesToSend.push(checkversionfilename);
  }

  function doReplacement(s) {
    var i;
    s = s.replace(/###VERSION###/g, stats.version_number);
    s = s.replace(/###BUILD###/g, stats.build_number);
    s = s.replace(/ {1,40}/g, ' ');
    s = s.replace(/\t/g, ' ');
    return s;
  }

  function combine_js(fnames) {
    var out = [];
    var s;
    fnames.forEach(function (file) {
      s = readJs(file);
      out.push(s);
    });
    return out.join("\n\r")
  }

  function updateBuildHistory(o, replace) {
    var fname = "build_history.json";
    var tmp = ie_readFile(fname);
    tmp = JSON.parse(tmp);
    if (replace) {
      tmp.pop();
    }
    tmp.push(o);
    ie_writeFile(fname, JSON.stringify(tmp, undefined, 2));
  }


  var stats = {};
  stats.version_number = +document.getElementById("version_number").value;
  stats.build_number = +document.getElementById("build_number").value;
  stats.build_date = document.getElementById("build_date").value;
  stats.build_comments = document.getElementById("build_comments").value;
  updateBuildHistory(stats, false);

  ie_writeFile('build.txt', stats.build_number);
  ie_writeFile('version.txt', stats.version_number);

  var uscript = ie_readFile(srcdir + "\\user_blank.txt");
  var htatext = ie_readFile(srcdir + "\\hta_blank.txt");

  var s;


  var bodyfiles = ["onerror.js", "globals.js", "controlpanel.js", "text.js", "taillist.js", "utils.js", "upgrade_nickroom.js", "upgrade_ftproom.js", "upgrade_chat.js", "upgrade_mail.js", "upgrade_hotlist.js", "upgrade_cork.js", "preptoolbar.js", "buddypanel.js", 'mainbody.js', 'shortcut.js'];
  var jscripts = combine_js(bodyfiles);

  //var hta_files = ['hta.js', 'fix_ie.js'];
  //var htascripts = combine_js(hta_files);

  uscript = uscript.replace("{SCRIPTS}", jscripts);
  uscript = doReplacement(uscript);

  uscriptfilename = uscriptdest.replace(/###VERSION###/g, "-latest");
  ie_writeFile(uscriptfilename, uscript);
  filesToSend.push(uscriptfilename);

  uscriptfilename = uscriptdest.replace(/###VERSION###/g, stats.version_number);
  ie_writeFile(uscriptfilename, uscript);
  filesToSend.push(uscriptfilename);

  /*
  htatext = htatext.replace("{SCRIPTS}", jscripts);
  htatext = htatext.replace("{SCRIPTS2}", htascripts);
  htatext = doReplacement(htatext);

  htafilename = htadest.replace(/###VERSION###/g, stats.version_number);
  ie_writeFile(htafilename, htatext);
  filesToSend.push(htafilename);

  htafilename = htadest.replace(/###VERSION###/g, "-latest");
  ie_writeFile(htafilename, htatext);
  filesToSend.push(htafilename);
  */


  stats.status = "build success";
  updateBuildHistory(stats, true);

  makeUpdateCheck();

  document.getElementById("publish_button").disabled = false;
  initMake(); // Refresh the screen with new information.
  setStatus("build Complete");
}

function setStatus(s) {
  document.getElementById("status").innerHTML = s;
}

function runCommand(cmd, params, callback) {
  var rnd = new Date().getTime();

  var batchFileName = getWindowsTempDir() + "\\cpfname" + rnd + ".bat";
  var batchFileOutput = getWindowsTempDir() + "\\cpout_" + rnd + ".out";
  var batchFileDoneFlag = getWindowsTempDir() + "\\cpflag_" + rnd + ".txt";
  ie_writeFile(batchFileDoneFlag, "Running");

  function checkDone() {
    var reply;
    var s = ie_readFile(batchFileDoneFlag);
    setStatus("[" + s + "]");
    if (s !== "Running") {
      window.clearInterval(flagT);
      if (callback) {
        reply = {};
        reply.text = ie_readFile(batchFileOutput);
        alert("Run Command\n" + reply.text);
        callback(reply);
      }
    }
  }
  // Ok, we have set up the flag -- now lets use it.
  var flagT = window.setInterval(checkDone, 1000);

  var txt = [];
  txt[txt.length] = "@echo off";
  txt[txt.length] = "@echo Running FTP command";
  txt[txt.length] = [cmd, params, '>', batchFileOutput].join(" ");
  txt[txt.length] = "echo %ERRORLEVEL% >> " + batchFileOutput;
  txt[txt.length] = "echo done>" + batchFileDoneFlag;
  ie_writeFile(batchFileName, txt.join("\r\n"));

  var oShell = new ActiveXObject("Shell.Application");
  oShell.ShellExecute(batchFileName, "", "", "open", "1");
}

function getFtpLoginText() {
  var ftpscript = [];
  var user_name = document.getElementById("soi_user").value;
  var password = document.getElementById("soi_ftp_password").value;

  if (user_name === "" || password == "") {
    throw ("Username or password blank");
  }
  ftpscript.push(user_name); // First answer the user name
  ftpscript.push(password); // Then the pass word
  return ftpscript;
}

function runFtpCommand(ftpscript, callback) {
  var fname = getWindowsTempDir() + "\\chatplus_build1.txt";
  var s = ftpscript.join("\r\n")
  ftpscript.push("quit");
  ie_writeFile(fname, s);
  //alert(s);
  // -a passive mode.  -s: run script
  //runCommand("ftps", "-quiterror -s:" + fname + " ftp.hyperchat.com", callback);
  runCommand("ftp", "-s:" + fname + " ftp.hyperchat.com", callback);
}

function ftpUploadFile(src, destdir, callback) {
  var n = src.split("\\");
  n = n[n.length-1];

  var ftpscript = getFtpLoginText();
  ftpscript.push("passive");
  ftpscript.push("debug");
  ftpscript.push("bin");
  ftpscript.push("prompt");
  ftpscript.push("cd " + destdir);

  // Horrible, horrible ... but for some reason it seems to work.
  // If I only use one mput, the upload is never complete.

  //ftpscript.push("mput " + src);
  ftpscript.push("del " + n);
  ftpscript.push("mput " + src);
  //ftpscript.push("mput " + src);
  //ftpscript.push("mput " + src);

  //ftpscript.push("put " + src + " " + n);
  ftpscript.push("dir");
  runFtpCommand(ftpscript, callback);
}

function publish() {
  var idx = 0;

  //filesToSend.length = 1;

  function sendNext() {
    var f = filesToSend[idx];
    var l = filesToSend.length;
    setStatus(["Sending: ", f, idx, 'of', l].join(" "));
    if (idx == l) {
      window.setTimeout(doneSending, 1);
      return;
    }
    ftpUploadFile(f, ftpDestDir, sendNext);
    idx++;
  }
  sendNext();
  //doneSending();

  function doneSending() {
    ftpscript = getFtpLoginText();
    ftpscript.push("cd " + ftpDestDir);
    ftpscript.push("dir");
    runFtpCommand(ftpscript, showdir);

  } //

  function getSizes() {
    var i, l, sizes = {};
    var fname, s;
    var sname;
    l = filesToSend.length;
    for (i = 0; i < l; i++) {
      fname = filesToSend[i];
      s = ie_readFile(fname);
      sname = fname.split("\\").pop();
      sizes[sname] = s.length;
    }
    return sizes;
  }

  function showdir(ftpReply) {
    var sizes = getSizes();
    var data = ftpReply.text.split(/\r\n|\r|\n/);

//	document.write(JSON.stringify(data));

    var i, l = data.length;
    var s, bits;
    var ftpFileName, ftpFileLength;
    var localFileName, localFileLength;
    var out = [];
    var badUpload = false;
    var filesChecked = 0;
    var filesOnServer = [];
    // -rwxrwxrwx   1 owner    group          71342 Aug 22 16:58 chatplus-latest.hta
    // -rwxrwxrwx   1 owner    group           2722 Mar 12 17:15 question_mark.jpg
    for (i = 0; i < l; i++) {
      s = data[i];

      // Nuke all the extra white space.
      s = s.replace(/ {1,100}/g, " ");
      s = s.replace("\r", "");
      s = s.replace("\n", "");

      bits = s.split(" ");

      if (bits[3] === "group") {
        ftpFileName = bits[bits.length - 1];
        ftpFileLength = +bits[4];
        localFileName = ftpFileName;
        localFileLength = sizes[localFileName]

        if (localFileLength !== undefined) {
          filesChecked++;
          if (localFileLength !== ftpFileLength) {
            out.push("File did not upload correctly: " + ftpFileName + ":" + [localFileLength, ftpFileLength]);
            badUpload = true;
          }
        }
        filesOnServer.push({
          name: ftpFileName,
          size: ftpFileLength
        });

      }
    }


    if (filesChecked !== filesToSend.length) {
      badUpload = true;
      out.push("One or more files did not upload");
      out.push("Expected: " + filesToSend.length + " found " + filesChecked);
    }

    if (badUpload) {
      alert("Trouble with upload");
      alert(out.join("\r\n"));
    } else {
      setStatus("Upload went well.");
      makeVersionsHtml(filesOnServer);
    }
  }

  function makeVersionsHtml(filesOnServer) {
    var out = [];

    var html = ie_readFile("html_blank.txt");

    out[out.length] = "<h1>Chat Plus Versions.</h1>"
    out[out.length] = "<p>Please use the latest version unless ";
    out[out.length] = "there is a reason to use one of the others.</p>";
    out[out.length] = "<p>If upgrading from one of the 2.x versions of ChatPlus ";
    out[out.length] = "<br><strong>BACK UP YOUR DATA</strong> before going on.<br>There is a special version ";
    out[out.length] = "of the backup page <a href='https://soiroom.hyperchat.com/chatplus/b3/hchat_backup2.html'>Here</a>";
    out[out.length] = "</p>";
    out[out.length] = "<p>If you have not installed ChatPlus before:<br>";
    out[out.length] = "<strong><a href='https://soiroom.hyperchat.com/chatplus/install_cp.html'>READ THIS PAGE</a>";
    out[out.length] = "<br>You must install a plugin first.</p>";

    out[out.length] = "<table border = '1'>";

    filesOnServer.forEach(function (file) {
      filename = file.name;
      var txt, line;

      if (filename.indexOf("chatplus") === 0) {

        var type;
        if (filename.endsWith(".hta")) {
          txt = "Windows stand alone version";
        } else {
          txt = "Firefox/Chrome/SeaMonkey plugin";
        }

        line = ["<a href='", httpSource + filename, "'>", filename, "</a>", " - ", txt].join("");

        out[out.length] = "<tr><td>";
        out[out.length] = line;
        out[out.length] = "</td></tr>";
      }
    });
    out[out.length] = "</table>";
    setStatus("Sending update page.");

    html = html.replace("###BODY###", out.join("\r\n"));
    ie_writeFile("update.html", html);
    ftpUploadFile("update.html", ftpDestDir, updateDone);

    function updateDone() {
      setStatus("Upload of update.html complete.");
    }
  }
}

String.prototype.endsWith = function (suffix) {
  return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

window.onerror = function (a, b, c) {
  alert("Global error " + a + b + c);
}
