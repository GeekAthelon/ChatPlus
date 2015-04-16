//===TOP-LEVEL VARIABLES & TOP-LEVEL FUNCTION
n=0;
var nameArray=new Array();
var addressArray=new Array();
function makeaddress(name,address) {
nameArray[n] = name;
addressArray[n] = address;
n++; }
//###BEGIN LIST
makeaddress("~*~ Hong Kong RPG ~*~ ","");
makeaddress(" ","");
makeaddress("~*~ Realm Information ~*~ ","");
makeaddress("IC/OOC Cork","!!!hkcork@soi");
makeaddress("Map Cork","!!!hkmap@soi");
makeaddress(" ","");
makeaddress("~*~ Special Events ~*~ ","");
makeaddress("Hong Kong Museum of Coastal Defence","!!!hkcd@soi");
makeaddress(" ","");
makeaddress("~*~ City Businesses - Dining/Bar ~*~ ","");
makeaddress("The American Dragon Cafe","!!!diner1@soi");
makeaddress("The Tonno Club","!!!tonno@soi");
makeaddress("Cafe India","!!!cafein@soi");
makeaddress("Blackbird Tea Room","!!!gacafe@soi");
makeaddress("Tiffin Gardens","!!!tiffin@soi");
makeaddress(" ","");
makeaddress("~*~ Hong Kong Businesses ~*~ ","");
makeaddress("Dunross Shipping","!!!dunross@soi");
makeaddress("RedRoss Publications","!!!redross@soi");
makeaddress("---Nika's Apartment","!!!nikasapa @soi");
makeaddress("---Keiko's Apartment","!!!keikorm@soi");
makeaddress("---Helen & Seth's Apt","!!!dasari@soi");
makeaddress("Wan Chai Commercial Bank","!!!wccbank@soi");
makeaddress("Happy Valley Racing","!!!hkjclub@soi");
makeaddress("Times Square Shopping Mall","!!!hkmall@soi");
makeaddress("Valchrista","!!!valcrist@soi");
makeaddress("---Sonja's Apartment","!!!sonapart@soi");
makeaddress("---Pia's Apartment","!!!piares@soi");
makeaddress(" ","");
makeaddress("~*~ Hong Kong Hotel/Living ~*~ ","");
makeaddress("Azzure Dragon Hotel","!!!azzure@soi");
makeaddress("---Ahmed - Suite 1804","!!!rashrm@soi");
makeaddress("Hags Castle Bed & Breakfast","!!!hkcastle@soi");
makeaddress("Ice House Arms","!!!hkhirise@soi");
makeaddress("---Raymond Shaw","!!!rsipent@soi");
makeaddress("---Beth Holmes Apartment","!!!beths@soi");
makeaddress("---Dylan Devers Apartment","!!!dylans@soi");
makeaddress(" ","");
makeaddress("~*~ Hong Kong Residences ~*~ ","");
makeaddress("Dunross Junk","!!!thehag@soi");
makeaddress("The Valhalla","!!!theval@soi");
makeaddress(" ","");
makeaddress("~*~ Hong Kong Sights ~*~ ","");
makeaddress("Ocean Park","!!!ophk@soi");
makeaddress("Beachs/Cliffs","!!!cliffs@soi");
makeaddress(" ","");
makeaddress("~*~ Transportation/Roadways ~*~ ","");
makeaddress("HK Alleys/Streets/Transport","!!!hkong@soi");
makeaddress("Ferry","!!!star@soi");
makeaddress("Peak Tram","!!!peaktram@soi");
makeaddress("Hong Kong Airport","!!!hkair@soi");
makeaddress("Kowloon Slums Streets","!!!hkslums@soi");
makeaddress(" ","");
makeaddress("~*~ City Government/Community Bldgs ~*~ ","");
makeaddress("Hong Kong PD","!!!hkpd@soi");
makeaddress(" ","");
makeaddress("~*~ Kowloon Businesses ~*~ ","");
makeaddress("Hung Fat Pawn Shop","!!!fatpawn@soi");
makeaddress("Dr L Chan's Ofc","!!!lchan@soi");
makeaddress("Nathan Road Commerce Bldg","!!!nrcb@soi");
makeaddress(" ","");
makeaddress("~*~ Kowloon Sights ~*~ ","");
makeaddress("Kowloon Docks","!!!kowdock@soi");
makeaddress("Heritage Discovery Museum","!!!apart@soi");
makeaddress(" ","");
makeaddress("~*~ Kowloon - Residences ~*~ ","");
makeaddress("Hong Kong Hostel","!!!hostel@soi");
makeaddress("Silver Cloud Apts","!!!slvrclwd@soi");
makeaddress("---Ling Liu's Home","!!!ling@soi");
makeaddress(" ","");
makeaddress("~*~ Residental Outskirts ~*~ ","");
makeaddress("Drake Family Estate","!!!reginald@soi");
makeaddress(" ","");
makeaddress("~*~ Outskirts ~*~ ","");
makeaddress("Mountain Areas","!!!hkmount@soi");
makeaddress("---Remote Mountain Cabin","!!!hkflood@soi");
makeaddress("---Mount Hua Tea Room","!!!islcliff@soi");
makeaddress(" ","");
makeaddress("~*~ Connected Realms ~*~ ","");
makeaddress("Milan Airport","!!!milan@soi");
makeaddress("The City Airport","!!!cityair@soi");

//###END LIST

//===WRITE THE FORM TO HTML
document.write("<form name=\"myform\">\n<select name=\"room\">\n"); 
i=0; do {
  document.write("<Option>"+nameArray[i]+"\n"); i++; } 
while (nameArray[i]); 
document.write("</select>\n<input type=\"button\" name=\"go\" value=\"Ni Hao\" onclick=\"changeroom(this.form)\">\n</form>\n"); 
//===CHANGE THE ROOM.
//If Soi/Bwr/Jag chat box exists, use number of form to find user's nick.
//Otherwise send them to room as Visitor.
function changeroom(form) { 
j=0; do {
  if (window.document.forms[j].vqxha) { 
    window.location = addressArray[form.room.selectedIndex].replace ("!!!", "http://ssom3.hyperchat.com/cgi-bin/som3.exe?vqxha=" + parsename(document.forms[j].vqxha.value) + "&vqxro="); 
    return; }
  j++; }
while (window.document.forms[j]);
window.location = addressArray[form.room.selectedIndex].replace ("!!!", "http://ssom3.hyperchat.com/cgi-bin/som3.exe?vqxus=Visitor&vqxro="); }
function parsename(name) { return name.replace(/ /g, "+"); }
