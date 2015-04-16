/*
window.onerror = function(msg, url, linenumber) {
  var logButton;
  if (document && document.getElementById) {
    logButton = document.getElementById("logButton");
  }  
 
 if (cpConsole && cpConsole.error  && logButton) {   
   cpConsole.error(msg, url, linenumber);
   logButton.innerHTML = "**ERROR**";
 } else {
   alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
 }
 return true;
}
*/