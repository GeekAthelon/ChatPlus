// Internal references to help ChatPlus find things on the screen

/* exported $$_MACRO_KEY_LIST */
/* exported fakeHash */
/* exported userWindow */
/* exported allRooms */
/* exported realmList */
/* exported onlineBuddies */
/* exported myStatus */
/* exported getOptionValue */
/* exported allKnownTails */
/* exported myStats  */

var $$_MACRO_KEY_LIST = "1234567890abcdefghijklmnopqrstuvwxyz".split("");

var fakeHash; // For HTAs that have no window object.


// GreaseMonkey references
var unsafeWindow; 
var userWindow = unsafeWindow ? unsafeWindow : window;

var allRooms = []; // I forget what this one even is

var realmList; // The big list of places.
var onlineBuddies;

// Function that can only run after the DOM is ready
var getOptionValue;

var allKnownTails;
var myStats;
