/* exported setStyles */
/* exported prepToolbar */

function prepToolbar() {
   "use strict";

 function showLog(cp_event) {
   function closeLog() {   
     myDom.hidePopupDiv();
   }
   var atTop = true;
   var el = myDom.displayPopupDiv(cp_event, atTop);
   var closeButton = myDom.createInnerJump(closeLog, "Close Log");
   el.appendChild(closeButton);
   el.appendChild(document.createElement("br"));
   el.className += "chatPlus_popupok controlPanel";
   cpConsole.show(el);
 }

   
   window.soiDetails = identifySoi(); //jshint ignore:line
   var bar = document.createElement("div");
   var inn = "span";
   var logo = document.createElement(inn);

   bar.id = "hchat_toolbar";
   bar.className = "hchat";

   var ver = myDom.createTag("span", " (Version: " + myStats.version + ")");

   var controlsButton = myDom.createInnerJump(controlPanel.main, "ChatPlus Controls");
   controlsButton.className += " chatPlus_popupok";
   logo.appendChild(controlsButton);
   logo.appendChild(ver);

   logo.appendChild(document.createTextNode("["));
   logo.appendChild(myDom.createLinkToRoom("chatplus@soi", "#r-chatplus@soi"));
   logo.appendChild(document.createTextNode("] for latest news and comments"));
   logo.style.textAlign = "left";
   logo.style.width = "70%";

   bar.appendChild(logo);

   var logButton = myDom.createInnerJump(showLog, "Show Log");
   logButton.id = "logButton";
   controlsButton.className += " chatPlus_popupok";
   logo.appendChild(logButton);

   document.body.insertBefore(bar, document.body.firstChild);
 }

 function setStyles(master) {
   "use strict";
   window.soiDetails = identifySoi(); //jshint ignore:line

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
   style.push(' cursor: pointer;');
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

   style.push('.cpbutton {');
   style.push(' text-align: center;');
   style.push('	opacity: 0.5;');
   style.push(' font-variant : small-caps;');
   style.push('}');

   style.push('.fullButton {');
   style.push(' display:block;');
   style.push('	width: 100%;');
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

   style.push(".chatplus_cork_count {");
   style.push('  font-size: small;');
   style.push('  text-decoration:none !important;');
   style.push("}");

   style.push(".chatplus_cork_highlight {");
   //style.push("  background: yellow;");
   //style.push("  color: black;");
   style.push("}");

   style.push(".popup2 {");
   style.push('  position: absolute;');
   style.push('  background-color: gray;');
   style.push('  color: yellow;');
   style.push('  border: 1px solid white;');
   style.push("}");


   style.push('.chatPlus_nick {');
   if (window.soiDetails.isChatRoom && master.showhp !== "false") {
     style.push('border-bottom-style:dotted;');
   }
   style.push(' cursor: pointer;');
   style.push(' display: inline-block;');
   style.push('}');

   if (master.ulinemode === "reset") {
     style.push('a { text-decoration:underline !important;}');
     style.push('A:HOVER { cursor: pointer !important; }');
   }

   style.push('.controlPanel, .controlPanel form, .controlPanel td {');
   style.push('  color: blue !important;');
   style.push('}');

   style.push('.controlPanel input {');
   style.push('  color: yellow !important;');
   style.push('  background-color: blue !important;');
   style.push('}');

   style.push('.onlineBuddy {');
   style.push('}');

   style.push('.cp-underline-bar {');
   style.push('  border-bottom: 1px solid Scrollbar;');
   style.push('}');   
   
   style.push('.cp-popup-visible,');
   style.push('.cp-popup-hidden {');
   style.push('overflow: hidden;');
   style.push('  /* This container should not have padding, borders, etc. */');
   style.push('}');

   style.push('.cp-popup-hidden .cpbutton, ');
   style.push('.cp-popup-visible .cpbutton {');
   style.push('  display:block;');
   style.push('  width: 100%;');
   style.push('  margin-top: 0.5em;');
   style.push('  background-color: ButtonFace;');
   style.push('  color: ButtonText;');
   style.push('}');

   style.push('.cp-popup-visible {');
   style.push('  visibility: visible;');
   style.push('  opacity: 1;');
   style.push('  transition: opacity 0.25s linear;');
   style.push('}');

   style.push('.cp-popup-hidden {');
   style.push('  visibility: hidden;');
   style.push('  opacity: 0;');
   style.push('  transition: visibility 0s 0.25s, opacity 0.25s linear;');
   style.push('}');

   style.push('.cp-popup-visible > div,');
   style.push('.cp-popup-hidden > div {');
   style.push('  background-color: Window;');
   style.push('  color: WindowText;');
   style.push('  /* Put any padding, border, min-height, etc. here. */');
   style.push('}');

   style.push('.cp-popup-nickname-menu {');
   style.push('  border: 1px solid WindowFrame;');
   style.push('  padding: 0.5em;');
   style.push('}');

   style.push('.cp-popup-hidden > div {');
   style.push('  margin-top: -10000px;');
   style.push('  transition: margin-top 0s 0.5s;');
   style.push('}');

   style.push('.modalDialog {');
   style.push('  position: fixed;');
   style.push('  font-family: Arial, Helvetica, sans-serif;');
   style.push('  top: 0;');
   style.push('  right: 0;');
   style.push('  bottom: 0;');
   style.push('  left: 0;');
   style.push('  background: rgba(0,0,0,0.8);');
   style.push('  z-index: 99999;');
   style.push('  opacity:0;');
   style.push('  -webkit-transition: opacity 400ms ease-in;');
   style.push('  -moz-transition: opacity 400ms ease-in;');
   style.push('  transition: opacity 400ms ease-in;');
   style.push('  pointer-events: none; ');
   style.push('}');

   style.push('.modalDialog:target {');
   style.push('  opacity:1;');
   style.push('  pointer-events: auto;');
   style.push('}');

   style.push('.modalDialog > div {');
   style.push('  width: 400px;');
   style.push('  position: relative;');
   style.push('  margin: 10% auto;');
   style.push('  padding: 5px 20px 13px 20px;');
   style.push('  border-radius: 10px;');
   style.push('  background: #fff;');
   style.push('  background: -moz-linear-gradient(#fff, #999);');
   style.push('  background: -webkit-linear-gradient(#fff, #999);');
   style.push('  background: -o-linear-gradient(#fff, #999);');
   style.push('  color: #000;');
   style.push('}');

   style.push('.modalDialogClose {');
   style.push('  background: #606061;');
   style.push('  color: #FFFFFF;');
   style.push('  line-height: 25px;');
   style.push('  position: absolute;');
   style.push('  right: -12px;');
   style.push('  text-align: center;');
   style.push('  top: -10px;');
   style.push('  width: 24px;');
   style.push('  text-decoration: none;');
   style.push('  font-weight: bold;');
   style.push('  -webkit-border-radius: 12px;');
   style.push('  -moz-border-radius: 12px;');
   style.push('  border-radius: 12px;');
   style.push('  -moz-box-shadow: 1px 1px 3px #000;');
   style.push('  -webkit-box-shadow: 1px 1px 3px #000;');
   style.push('  box-shadow: 1px 1px 3px #000;');
   style.push('}');

   style.push('.modalDialogClose { background: #00d9ff; }');
   
   GM_addStyle(style.join("\r\n")); //jshint ignore:line
 }