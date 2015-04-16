var newRealm = {
  // The prototype for a new Realm.
  "new": {
    "fullName": "Change my name",
    "defaultMode": "include",
    "tailInclude": [],
    "tailExclude": [],
    "roomInclude": [],
    "roomExclude": []
  }
};


var defaultRealmList = {
  "all": {
    "fullName": "Show all rooms",
    "defaultMode": "include",
    "readOnly": true,
    "tailInclude": [],
    "tailExclude": [],
    "roomInclude": [],
    "roomExclude": []
  },
  "favs": {
    "fullName": "My Favorites",
    "defaultMode": "exclude",
    "tailInclude": [],
    "tailExclude": [],
    "roomInclude": [],
    "roomExclude": []
  },

  "beware": {
    "fullName": "Castle Beware",
    "defaultMode": "exclude",
    "tailInclude": ["bwr"],
    "tailExclude": [],
    "roomInclude": ["tobar@soi"],
    "roomExclude": []
  }
};