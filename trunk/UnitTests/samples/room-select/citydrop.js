/* Dropdown navigation script *
 * Written/Created By: Derek Bryan            *
 * Updated: Jan 28, 2015
      *
 * List maintained by zia selene Steele*/

var addressArray = new Array();
var searchtext = "Travel";
var searchsize = "1";
var linkstonewwindow = "0";

function getFindForm()
{
  for (var i=0; document.forms[i]; i++)
  {
    if (typeof(document.forms[i].vqxfi) != 'undefined')
    {
      return document.forms[i];
    }
  }
  return false;
}

function changeRoom()
{
  var searchbox = document.getElementById('sb');
  var theTarget = searchbox.options[searchbox.selectedIndex].value;
  var theType = addressArray[searchbox.selectedIndex][0];
  var findform = getFindForm();
  if (theType == "URL" && theTarget)
  {
    if (linkstonewwindow)
    {
      thewindow= window.open(theTarget, "_blank", "resizable,width=800,height=600,location=1,status=1,scrollbars=1");
    }
    else
    {
      document.location.href=theTarget;
    }
  }
  if (theType == "Room" && theTarget && findform)
  {
    findform.vqxfi.value = theTarget;
    findform.submit();
  }
  else
  {
//    alert("Could not find acceptable location");
  }
}

function writeSearchBox()
{
  document.write("<select name='sb' id='sb' size='" + searchsize + "'>");
  for (var i=0; addressArray[i]; i++)
  {
    if (addressArray[i][0] == "header")
    {
      document.write("<option value=''>" + addressArray[i][1] + "</option>");
    }
    else if (addressArray[i][0] == "spacer")
    {
      document.write("<option value=''></option>");
    }
    else if (addressArray[i][0] == "URL")
    {
      document.write("<option value=\"" + addressArray[i][1] + "\">" + addressArray[i][2] + "</option>");
    }
    else if (addressArray[i][0] == "Room")
    {
      document.write("<option value=\"" + addressArray[i][1] + "\">" + addressArray[i][2] + "</option>");
    }
  }
  document.write("</select> <input type=button onclick='changeRoom()' value=\"" + searchtext + "\">");
}

1;

searchtext="Go"; // Text for travel button
searchsize="1";        // How many options to show at a time on the dropdown
linkstonewwindow="0";  // Open URLs in new window?

addressArray = [
[ "header", " -=-CITY RPG-=- " ],
[ "spacer" ],
[ "header", " -+- STATE,CITY,LOCAL GOVERNMENT ETC. -+- " ],
[ "spacer" ],
[ "Room", "chconfrm@soi", "City Council Chambers" ],
[ "Room", "court@soi", "City Courtroom" ],
[ "Room", "cityhall@soi", "City Hall" ],
[ "Room", "tugboat@soi", "City Harbor Patrol" ],
[ "Room", "cityjail@soi", "City Jail" ],
[ "Room", "daoffice@soi", "DA's Office" ],
[ "Room", "firehouz@soi", "Fire Station" ],
[ "Room", "8thprec@soi", "Police Department" ],
[ "Room", "citybook@soi", "Public Library" ],
[ "Room", "sheriff@soi", "Sheriff's Office" ],
[ "Room", "stlands@soi", "State-Owned Lands" ],
[ "spacer" ],
[ "header", " -+- CORE RPG ROOMS & RESOURCES -+- " ],
[ "spacer" ],
[ "Room", "9thcork@soi", "City IC/OOC Cork" ],
[ "URL", "http://scarlettsomers.hyperchat.com/claims.html", "Claims Page"],
[ "Room", "Citymap@soi", "City Map" ],
[ "Room", "welcome2@soi", "OOC Chat" ],
[ "spacer" ],
[ "header", " -+- CHURCHES & RELIGIOUS PLACES -+- " ],
[ "spacer" ],
[ "Room", "emek@soi", "Temple Emek Shalom" ],
[ "Room", "ndchurch@soi", "Church of Perpetual Prayers" ],
[ "spacer" ],
[ "header", " -+- BUSINESSES & MISCELLANEOUS -+- " ],
[ "spacer" ],
[ "Room", "radio@soi", "99.9 WCTY" ],
[ "Room", "stageset@soi", "Acme Holding Co" ],
[ "Room", "amosoff@soi", "Amos Moreau's Office" ],
[ "Room", "artsake@soi", "Art For Art's Sake" ],
[ "Room", "faldoor@soi", "Autumn's Gilded Door" ],
[ "Room", "baywing@soi", "Baywing Mall" ],
[ "Room", "bwise@soi", "Be Wise Towing & Garage" ],
[ "Room", "boardwlk@soi", "Boardwalk" ],
[ "Room", "saddles@soi", "Boots & Saddles" ],
[ "Room", "catpjs@soi", "The Cat's Pajamas Vintage Clothes" ],
[ "Room", "ctaz@soi", "City Aquarium & Zoo" ],
[ "Room", "arbo@soi", "City Arboretum" ],
[ "Room", "thebay@soi", "City Bay" ],
[ "Room", "ctbeach@soi", "City Beach -NW-" ],
[ "Room", "citybowl@soi", "City Bowl" ],
[ "Room", "ctycem@soi", "City Cemetery" ],
[ "Room", "launder@soi", "City Laundry" ],
[ "Room", "ctlight@soi", "City Lighthouse" ],
[ "Room", "zoned@soi", "City Museum of Fine Arts" ],
[ "Room", "ctpark@soi", "City Park" ],
[ "Room", "tugboat@soi", "City Port Authority" ],
[ "Room", "townsqr@soi", "City Square" ],
[ "Room", "cityuni@soi", "City University" ],
[ "Room", "dance@soi", "City Dance & Music Co." ],
[ "Room", "ctvoice@soi", "City Voice Offices" ],
[ "Room", "yatdock@soi", "City Yacht Club" ],
[ "Room", "vlbcrib@soi", "Condemned Building" ],
[ "Room", "darkdays@soi", "Dark Days" ],
[ "Room", "choppers@soi", "Dead Man Choppers" ],
[ "Room", "boxingym@soi", "Edgewater Boxing Academy" ],
[ "Room", "nrstore@soi", "Flights of Fantasy Bookstop" ],
[ "Room", "floozlob@soi", "Floozy Productions" ],
[ "Room", "fans@soi", "Galaxy Memorabilia" ],
[ "Room", "goldsgym@soi", "Gold's Gym" ],
[ "Room", "hillente@soi", "Hildebrant Enterprises" ],
[ "Room", "icandye@soi", "I Candye Modeling Agency" ],
[ "Room", "benje@soi", "Ice Cream Parlour" ],
[ "Room", "9ball@soi", "Jake's 9 Ball" ],
[ "Room", "jessiclo@soi", "Jessi's Closet" ],
[ "Room", "pictures@soi", "LightSource Photography" ],
[ "Room", "lucklady@soi", "Lucky Lady Casino" ],
[ "Room", "slumpark@soi", "MLK Park" ],
[ "Room", "artistes@soi", "MM Management" ],
[ "Room", "ctybank@soi", "National Bank of City" ],
[ "Room", "nerdvana@soi", "Nerdvana" ],
[ "Room", "antique@soi", "One of a Kind Antiques" ],
[ "Room", "pier3@soi", "Pier 3" ],
[ "Room", "piersix@soi", "Pier 6" ],
[ "Room", "pier9@soi", "Pier 9" ],
[ "Room", "plush@soi", "Plush Angel" ],
[ "Room", "powers@soi", "Powers' Tower" ],
[ "Room", "pdl@soi", "Prostitutes Defense League" ],
[ "Room", "pubmar@soi", "Public Marina" ],
[ "Room", "events@soi", "RM King Performance Hall " ],
[ "Room", "flix@soi", "Roxy Theater" ],
[ "Room", "slumbooz@soi", "Sharrett's Liquor Store" ],
[ "Room", "silkrope@soi", "Silk Rope Tattoo" ],
[ "Room", "couture@soi", "Strada" ],
[ "Room", "elounge@soi", "Suede Lounge" ],
[ "Room", "antiques@soi", "Time & Chance Antiques" ],
[ "Room", "tracks@soi", "Tracks Music Shop" ],
[ "Room", "unicredit@soi", "UniCredit Bank" ],
[ "Room", "unionhal@soi", "Union Hall" ],
[ "Room", "smshop@soi", "University Smoke Shop" ],
[ "Room", "collina@soi", "Villa la Collina" ],
[ "Room", "wrenad@soi", "Wren Alexander Advertising & Marketing" ],
[ "Room", "tww@soi", "Written Word Book Shoppe" ],
[ "Room", "movieset@soi", "Zeitgeist Studios" ],
[ "spacer" ],
[ "header", " -+-DOCTORS OFC, MEDICAL & HOSPITAL AFFILIATIONS -+- " ],
[ "spacer" ],
[ "Room", "cdc@soi", "Center for Disease Control" ],
[ "Room", "medoff@soi", "Women & Childrens Hospital" ],
[ "Room", "cottagea@soi", "Dr. Ben's Home and Office" ],
[ "Room", "dystopia@soi", "Private Practice(Dr. Hannibal Lecter" ],
[ "Room", "psyexp@soi", "Dr. Hawkins Psychology Experiment" ],
[ "Room", "pcoffice@soi", "Paul Crawford Ph.D." ],
[ "Room", "hospital@soi", "New Hope Medical Center" ],
[ "Room", "medoff@soi", "MLK Free Clinic" ],
[ "Room", "wchosp2@soi", "Women & Children's Annex & Planned Parenthood" ],
[ "spacer" ],
[ "header", " -+- FOOD STORES & MARKETS -+- " ],
[ "spacer" ],
[ "Room", "lakestor@soi", "Cove lake Market" ],
[ "Room", "minimart@soi", "De'Monte's MiniMart" ],
[ "Room", "fishmkt@soi", "Freeman's Fish Market" ],
[ "Room", "kwikstop@soi", "Kwik-E-Stop" ],
[ "Room", "ssbus@soi", "The Place" ],
[ "Room", "safeway@soi", "Safeway Grocery" ],
[ "Room", "zeytinia@soi", "Zeytinia Gourmet Market" ],

[ "spacer" ],
[ "header", " -+- HOUSING, MOTELS/HOTELS & SHELTERS -+- " ],
[ "spacer" ],
[ "Room", "auroraa@soi", "Aurora Apartments" ],
[ "Room", "brown@soi", "Brownstone Apartments" ],
[ "Room", "thetower@soi", "Cambridge" ],
[ "Room", "ahousing@soi", "Cityville Affordable Housing" ],
[ "Room", "wcshelt@soi", "Haven Shelter for Woman & kids" ],
[ "Room", "honeyspo@soi", "Honeyspot Motel" ],
[ "Room", "soup@soi", "Hope House" ],
[ "Room", "mim@soi", "Hotel Mimosa" ],
[ "Room", "casino", "Imperial Casino" ],
[ "Room", "imperial", "Imperial Hotel" ],
[ "Room", "inandout@soi", "In and Out Hourly Motel" ],
[ "Room", "themad@soi", "Madison" ],
[ "Room", "themarin@soi", "Marina Hotel" ],
[ "Room", "hopehse@soi", "New Beginnings Shelter" ],
[ "Room", "parkv@soi", "ParkView" ],
[ "Room", "slumroom@soi", "Reynolds Ave Row Housing" ],
[ "Room", "walkup@soi", "Rooms for Rent" ],
[ "Room", "sshill@soi", "Sheraton Society Hill Hotel" ],
[ "Room", "turner@soi", "Turner Warehouse" ],
[ "Room", "voodooap@soi", "Voodoo Apartments" ],
[ "spacer" ],
[ "header", " -+- LAWYERS,JUDGES & LEGAL  -+- " ],
[ "spacer" ],
[ "Room", "smshop@soi", "Downy Drain, Esq.'s Office" ],
[ "Room", "eva@soi", "Eva Santos Law Office & Residence" ],
[ "Room", "gritswu@soi", "Wu Law Firm" ],
[ "spacer" ],
[ "header", " -+- RESTAURANTS, BARS AND NIGHTCLUBS -+- " ],
[ "spacer" ],
[ "Room", "3fingers@soi", "3 Fingers of Jazz" ],
[ "Room", "1010@soi", "10-10" ],
[ "Room", "141@soi", "141 Restaurant & Lounge" ],
[ "Room", "9thdiner@soi", "Big Al's Diner" ],
[ "Room", "diner@soi", "BJ's Diner" ],
[ "Room", "bpearl@soi", "Black Pearl Restaurant" ],
[ "Room", "bdclub@soi", "Blue Diamond Night Club" ],
[ "Room", "blue@soi", "Blue Seafood Restaurant" ],
[ "Room", "cheers@soi", "Charlie's Bar & Grill" ],
[ "Room", "chuys@soi", "Chuy's Tex-Mex Cantina" ],
[ "Room", "cittav@soi", "City Tavern" ],
[ "Room", "clubred@soi", "Club Red" ],
[ "Room", "blueshos@soi", "Corner Stone Blues House" ],
[ "Room", "slumbar@soi", "Dames Bar" ],
[ "Room", "adive@soi", "Dive Bar" ],
[ "Room", "-italia@soi", "Felidia Restaurante" ],
[ "Room", "sidedine@soi", "Good Morning Coffee Shop" ],
[ "Room", "govindas@soi", "Govinda's" ],
[ "Room", "hbc3@soi", "HeartBreakers Cabaret" ],
[ "Room", "hellfyre@soi", "Hellfyre Fetish Club" ],
[ "Room", "hooligan@soi", "Hooligans Bar" ],
[ "Room", "ilcielo2@soi", "Il Cielo Pizzeria" ],
[ "Room", "karaklub@soi", "The Karaoke Klub" ],
[ "Room", "sereniss@soi", "La Serenissima" ],
[ "Room", "leftys@soi", "Lefty's Bar" ],
[ "Room", "menage@soi", "Menage a Trois" ],
[ "Room", "nicos@soi", "Nico's Restaurant" ],
[ "Room", "oasiswp@soi", "Oasis" ],
[ "Room", "pandoras@soi", "Pandora's Box Internet Cafe & Bakery" ],
[ "Room", "pizza1@soi", "Pizza and Subs" ],
[ "Room", "steak@soi", "Prime Steakhouse" ],
[ "Room", "rdoffice@soi", "Rendezvous Office" ],
[ "Room", "coffeehs@soi", "Sacred Grounds" ],
[ "Room", "sodom@soi", "Sodom" ],
[ "Room", "taproom@soi", "Twelfth Night English Pub" ],
[ "Room", "wicked1@soi", "Wicked BDSM Club" ],
[ "Room", "whtwo@soi", "Wild Horse Saloon" ],
[ "Room", "xseas@soi", "X Seas Strategies" ],
[ "Room", "xios@soi", "Xios" ],
[ "spacer" ],
[ "header", " -+- STREETS & PUBLIC TRANSPORTATION -+- " ],
[ "Room", "side@soi", "9th Ave" ],
[ "Room", "nshore@soi", "Bayview" ],
[ "Room", "chanspan@soi", "Bay Bridge" ],
[ "Room", "beachdr@soi", "Beach Drive" ],
[ "Room", "tcbridge@soi", "Bridge to the Hood" ],
[ "Room", "clddrives@soi", "Cove Lake Drive" ],
[ "Room", "dkalley@soi", "Dark Alley" ],
[ "Room", "easyst@soi", "Easy Street" ],
[ "Room", "edgwater@soi", "Edgewater" ],
[ "Room", "5th@soi", "Fifth Ave" ],
[ "Room", "moonrd@soi", "Harvest Moon Drive" ],
[ "Room", "highline", "Highline Elevated Park Space" ],
[ "Room", "layden@soi", "Layden Lane" ],
[ "Room", "slumave@soi", "Madison Ave" ],
[ "Room", "mblane@soi", "Mayberry Ln" ],
[ "Room", "michave@soi", "Michigan Ave" ],
[ "Room", "mdwayav@soi", "Midway Ave" ],
[ "Room", "northedg", "North Edgewater" ],
[ "Room", "primrose@soi", "Primrose Ave" ],
[ "Room", "ranchrd@soi", "Ranch Road" ],
[ "Room", "richblvd@soi", "Richards Blvd" ],
[ "Room", "reynolds@soi", "Reynolds Ave" ],
[ "Room", "remblvd@soi", "Remembrance Blvd" ],
[ "Room", "shadyln@soi", "Shady Ln" ],
[ "Room", "slumroad@soi", "Steward Street" ],
[ "Room", "avetwil@soi", "Twilight Ave" ],
[ "Room", "cityair@soi", "City Airport" ],
[ "Room", "rail@soi", "Railyards & Station" ],
[ "spacer" ],
[ "header", " -+- RESIDENCES -+- " ],
[ "spacer" ],
[ "Room", "covelake@soi", "21 acre Cove Lake" ],
[ "Room", "404@soi", "404 Beach Drive" ],
[ "Room", "hapsplac@soi", "A Bungalow" ],
[ "Room", "comitiva@soi", "Alison Wonderland Residence" ],
[ "Room", "erosapt@soi", "Amor Home" ],
[ "Room", "bchrent@soi", "Beach House Rental" ],
[ "Room", "sumhome@soi", "Bode Residence" ],
[ "Room", "brians@soi", "Brian Thornton Residence" ],
[ "Room", "rblkhous@soi", "Casa de Batista" ],
[ "Room", "cavallo@soi", "Cavallo Residence" ],
[ "Room", "clarylft@soi", "Clary's Loft" ],
[ "Room", "dlsandro@soi", "Dalesandro Estate" ],
[ "Room", "pdplace@soi", "Das Beach House" ],
[ "Room", "cmp@soi", "Dev's Pad" ],
[ "Room", "cugini@soi", "DiBattista Villa" ],
[ "Room", "beachhse@soi", "Dolly's House on Beach" ],
[ "Room", "drakhome@soi", "Drakon's Residence" ],
[ "Room", "beached@soi", "Driftwood" ],
[ "Room", "jjroom@soi", "Her place" ],
[ "Room", "jeffwu@soi", "Hill Cottage" ],
[ "Room", "regans@soi", "Hunter Regan's Penthouse" ],
[ "Room", "illys@soi", "Illeana Pippen's Residence" ],
[ "Room", "janplay@soi", "Jannie Residence" ],
[ "Room", "jjroom@soi", "Jazmin Jackson Residence" ],
[ "Room", "coxcabin@soi", "Jordan Cox cabin" ],
[ "Room", "gatehous@soi", "Kyle's Abode" ],
[ "Room", "tidal@soi", "Low Tide" ],
[ "Room", "2020@soi", "Lucas MacManus & Sidney Wren" ],
[ "Room", "rayshome@soi", "Lucian and Ray's Place" ],
[ "Room", "luthers@soi", "Luthers IceHouse" ],
[ "Room", "mirhome@soi", "Martha and Mirella's Home" ],
[ "Room", "jmhome@soi", "Mercanti Home" ],
[ "Room", "mollys@soi", "Molly's Beach Home" ],
[ "Room", "bplace@soi", "Night Stranger's home" ],
[ "Room", "nikaeddi@soi", "Nika and Eddies Cottage" ],
[ "Room", "noahs@soi", "Noah and Jon's Lake House" ],
[ "Room", "noxhome@soi", "Nox Residence" ],
[ "Room", "cityfarm@soi", "Oakwood Farms" ],
[ "Room", "beachspt@soi", "Ocean Beach" ],
[ "Room", "oceanhom@soi", "Ocean Front Property" ],
[ "Room", "powers@soi", "Powers' Tower" ],
[ "Room", "reggiebh@soi", "Reginald Drake's residence" ],
[ "Room", "kriscor@soi", "Rocking KC Ranch" ],
[ "Room", "rowhouse@soi", "Rowhouse 1 - Liam Reid" ],
[ "Room", "rh4@soi", "Rowhouse 4 - Soren Lindstrom" ],
[ "Room", "hayes@soi", "Sanctuary" ],
[ "Room", "lakeprop@soi", "Schultz Coast Home" ],
[ "Room", "resortsp@soi", "Serenity B&B and Spa" ],
[ "Room", "rodeo@soi", "Stetson Rodeo Arena" ],
[ "Room", "tysplace@soi", "Tyler Adams' Place" ],
[ "Room", "mansuit@soi", "Vanderbilt Estate" ],
[ "Room", "villa@soi", "Villa - Daniel Thorne Estate" ],
[ "Room", "windycor@soi", "Windy Corner Estate" ],
[ "Room", "wrenapt@soi", "Wren Alexander's Apt" ],
[ "Room", "jzmain@soi", "Zia Selene Estate" ],
[ "spacer" ],
[ "header", " -+- OUTSKIRTS OF CITY -+- " ],
[ "spacer" ],
[ "Room", "thebay@soi", "City Bay" ],
[ "Room", "Refinery@soi", "City Oil Refinery" ],
[ "Room", "channel@soi", "City Ship Channel" ],
[ "Room", "dshipco@soi", "Dalesandro Shipping Company" ],
[ "Room", "eqtrans@soi", "Equine Transport Services" ],
[ "Room", "malejail@soi", "Gull Island State Prison" ],
[ "Room", "necabin@soi", "Nika and Eddies Cabin" ],
[ "Room", "tracced@soi", "Race Track" ],
[ "Room", "stpeter@soi", "St. Peters" ],
[ "Room", "snowvly1@soi", "Snow Valley Village & Ski Lodge" ],
[ "Room", "spaav@soi", "SPA Aviation" ],
[ "Room", "comcen@soi", "SPA Headquarters" ], 
[ "Room", "ranchhom@soi", "Double Bar S Ranch -Steele Residence-" ],
[ "spacer" ],
[ "header", " -+- HOOD -+- " ],
[ "spacer" ],
[ "Room", "hdsalon @soi", "Beauty Shop" ],
[ "Room", "chopsho@soi", "Chop Shop" ],
[ "Room", "hoodfood@soi", "Harris Diner" ],
[ "Room", "9ball@soi", "Jake's 9 Ball" ],
[ "Room", "nighttri@soi", "Night Trips" ],
[ "Room", "hoodally@soi", "O'Malley's Alley" ],
[ "Room", "otb@soi", "OTB Parlor" ],
[ "Room", "mpawn@soi", "Pawn Dog" ],
[ "Room", "riverdri@soi", "River Drive" ],
[ "Room", "riveroak@soi", "River Oaks Apartments" ],

];

writeSearchBox();