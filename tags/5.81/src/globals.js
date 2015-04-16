// Internal references to help ChatPlus find things on the screen

var soiDetails;

var $$_MACRO_KEY_LIST = "1234567890abcdefghijklmnopqrstuvwxyz".split("");

var fakeHash; // For HTAs that have no window object.

// GreaseMonkey = !local
var chatPlusLocal;

// GreaseMonkey references
var unsafeWindow; 
var userWindow = unsafeWindow ? unsafeWindow : window;

var allRooms = []; // I forget what this one even is

var realmList; // The big list of places.
var nameList; // What names were found in the document.
var onlineBuddies;
var allKnownTails;

var elementIndex = {};

var myStats;

// Flags to know what kind of page we are looking at
var isHot;
var isChatRoom;
var isFtpRoom;
var isNickRoom;
var isCork;

// set/get values
var gmSetValue;
var gmGetValue;

// Function that can only run after the DOM is ready
var getOptionValue;
