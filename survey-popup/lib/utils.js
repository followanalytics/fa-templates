/**
 * Escapes any HTML tag characters from a string
 * @param  {String} string - the html as a string
 * @return {String}
 */
const BANNED_HTML_CHARS_REGEX = /[&<>]/g;
const BANNED_ATTR_CHARS_REGEX = /["'\n]/g;

const bannedHtmlChars = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
};

const bannedAttrChars = {
  '"': '&quot;',
  "'": '&#39;',
  '\n': '&#10;',
};

export function escapeHtml(string) {
  return !!string ? String(string).replace(BANNED_HTML_CHARS_REGEX, (s) => bannedHtmlChars[s]) : '';
}

export function escapeAttr(string) {
  return !!string ? String(string).replace(BANNED_ATTR_CHARS_REGEX, (s) => bannedAttrChars[s]) : '';
}

export function checkSDKVersion(version, minMajor, minMinor = 0, minTertiary = 0) {
  const versionNums = _.split(version, '.');
  const currentMajor = versionNums[0];
  const currentMinor = versionNums[1];
  const currentTertiary = _.split(versionNums[2], '-')[0];
  return currentMajor >= minMajor && currentMinor >= minMinor && currentTertiary >= minTertiary;
}

export function setUpFollowAnalyticsSDKMockAPI() {
  window.FollowAnalytics = {
    getUserId: function () {return null;},
    getDeviceId: function () {return 'PREVIEW_DEVICE_ID';},
    logEvent: function (name, arg) { // arg: undefined | null | string | object
      console.log('Followanalytics: Event logged, name:' + name + ' arg:' + arg);
    },
    logError: function (name, arg) { // arg: undefined | null | string | object
      console.log('Followanalytics: Error logged, name:' + name + ' arg:' + arg);
    },
    Gender: {
      MALE: 1,
      FEMALE: 2,
      OTHER: 3
    },
    UserAttributes: {
      setFirstName: function (firstName) {
        console.log('Followanalytics: UserAttributes.setFirstName called, firstName:' + firstName);
      },
      setLastName: function (lastName) {
        console.log('Followanalytics: UserAttributes.setLastName called, lastName:' + lastName);
      },
      setEmail: function (email) {
        console.log('Followanalytics: UserAttributes.setEmail called, email:' + email);
      },
      setDateOfBirth: function (dateOfBirth) { // dateOfBirth: Date|null
        console.log('Followanalytics: UserAttributes.setDateOfBirth called, dateOfBirth:' + dateOfBirth);
        if (FollowAnalytics.__wrong_type(dateOfBirth, ['Null', 'Date'])) {
          console.log('Followanalytics: Warning: dateOfBirth should be a Date or null');
        }
      },
      setGender: function (gender) {
        console.log('Followanalytics: UserAttributes.setGender called, gender:' + gender);
        if (!(gender === FollowAnalytics.Gender.MALE ||
          gender === FollowAnalytics.Gender.FEMALE ||
          gender === FollowAnalytics.Gender.OTHER)) {
          console.log('Followanalytics: Warning: gender is not valid. Please use Gender.MALE, Gender.FEMALE or Gender.OTHER');
        }
      },
      setCountry: function (country) {
        console.log('Followanalytics: UserAttributes.setCountry called, country:' + country);
      },
      setCity: function (city) {
        console.log('Followanalytics: UserAttributes.setCity called, city:' + city);
      },
      setRegion: function (region) {
        console.log('Followanalytics: UserAttributes.setRegion called, region:' + region);
      },
      setProfilePictureUrl: function (profilePictureUrl) {
        console.log('Followanalytics: UserAttributes.setProfilePicture called, profilePictureUrl:' + profilePictureUrl);
      },
      setNumber: function (key, value) {
        console.log('Followanalytics: UserAttributes.setNumber called, key:' + key + ' value:' + value);
        if (FollowAnalytics.__wrong_type(value, ['Null', 'Number'])) {
          console.log('Followanalytics: Warning: value should be a number or null');
        }
      },
      setString: function (key, value) {
        console.log('Followanalytics: UserAttributes.setString called, key:' + key + ' value:' + value);
        if (FollowAnalytics.__wrong_type(value, ['Null', 'String'])) {
          console.log('Followanalytics: Warning: value should be a string or null');
        }
      },
      setBoolean: function (key, value) {
        console.log('Followanalytics: UserAttributes.setBoolean called, key:' + key + ' value:' + value);
        if (FollowAnalytics.__wrong_type(value, ['Null', 'Boolean'])) {
          console.log('Followanalytics: Warning: value should be a boolean or null');
        }
      },
      setDate: function (key, value) { // value: Date|null
        console.log('Followanalytics: UserAttributes.setDate called, key:' + key + ' value:' + value);
        if (FollowAnalytics.__wrong_type(value, ['Null', 'Date'])) {
          console.log('Followanalytics: Warning: value should be a Date or null');
        }
      },
      setDateTime: function (key, value) { // value: Date|null
        console.log('Followanalytics: UserAttributes.setDateTime called, key:' + key + ' value:' + value);
        if (FollowAnalytics.__wrong_type(value, ['Null', 'Date'])) {
          console.log('Followanalytics: Warning: value should be a Date or null');
        }
      },
      clear: function (key) {
        console.log('Followanalytics: UserAttributes.clear called, key:' + key);
      },
      addToSet: function (key) { // use Javascript "arguments" object
        var arg_msg = ['Followanalytics: UserAttributes.addToSet called, key:' + key];
        for (var i = 1; i < arguments.length; i++) {
          arg_msg.push('arg' + (i - 1) + ':' + arguments[i]);
        }
        console.log(arg_msg.join(' '));
        if (arguments.length == 1) {
          console.log('Followanalytics: Warning: Missing arguments');
        }
      },
      removeFromSet: function (key) { // use Javascript "arguments" object
        var arg_msg = ['Followanalytics: UserAttributes.removeFromSet: called, key:' + key];
        for (var i = 1; i < arguments.length; i++) {
          arg_msg.push('arg' + (i - 1) + ': ' + arguments[i]);
        }
        console.log(arg_msg.join(' '));
        if (arguments.length == 1) {
          console.log('Followanalytics: Warning: Missing arguments');
        }
      },
      clearSet: function (key) {
        console.log('Followanalytics: UserAttributes.clearSet called, key:' + key);
      },
    },
    CurrentCampaign: {
      // getType: function() { }, // returns fullscreen, popup, banner or embedded
      close: function () {
        console.log('Followanalytics: CurrentCampaign.close called');
      },
      logAction: function (name) {
        console.log('Followanalytics: Action ' + name + ' is clicked!');
      },
      // getDeviceWidth: function() { },
      // getDeviceHeight: function() { },
      // getWidth: function() { },
      // setWidth: function(value) { }, // only for Popup
      // getHeight: function() { },
      // setHeight: function(value) { }, // only for Popup, Banner
      // getTop: function() { },
      // setTop: function(value) { }, // only for Popup
      // getLeft: function() { },
      // setLeft: function(value) { }, // only for Popup
    },
    // not available on production -----
    __wrong_type: function (arg, array_of_types) {
      regexp = new RegExp('^\\[object (?:' + array_of_types.join('|') + ')\\]$')
      return !regexp.test(Object.prototype.toString.call(arg));
    }
  };
}
