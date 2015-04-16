@echo off
del *~
echo Copying Edited Version to various places.
copy /y hchat.ieuser.js hchat.user.js  

copy /y hchat.ieuser.js "c:\Documents and Settings\jjs\Application Data\Mozilla\Firefox\Profiles\5fxcgu75.default\gm_scripts\chatplus\chatplus.user.js" 
copy /y hchat.ieuser.js "c:\Program Files\IEPro\userscripts\hchat.ieuser.js" 

copy /y hchat.ieuser.js "C:\Documents and Settings\Owner\Application Data\Mozilla\SeaMonkey\Profiles\wu8xuqmw.default\gm_scripts\chatplus-1\chatplus.user.js"


copy /y hchat.ieuser.js "c:\Documents and Settings\jjs\Application Data\Mozilla\Firefox\Profiles\67vqymbc.default\gm_scripts\chatplus\chatplus.user.js"




