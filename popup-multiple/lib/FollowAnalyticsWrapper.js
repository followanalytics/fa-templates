export class FollowAnalyticsWrapper {
  constructor() {
    if (FollowAnalyticsWrapper.instance) return FollowAnalyticsWrapper.instance;
    else FollowAnalyticsWrapper.instance = this;

    if (!window.FollowAnalytics) {
      console.warn('Using mock API for SDK methods.');
      this.FollowAnalytics = getMockFollowAnalyticsAPI();
    }
    else this.FollowAnalytics = window.FollowAnalytics;

    if (!_.get(this.FollowAnalytics, 'CurrentCampaign')) {
      this.FollowAnalytics.CurrentCampaign = window.CurrentCampaign;
    }
    if (!_.get(this.FollowAnalytics, 'UserAttributes')) {
      this.FollowAnalytics.UserAttributes = window.UserAttributes;
    }

    return this;
  }

  static checkMinSdkVersion(minMajor = 0, minMinor = 0, minTertiary = 0) {
    if (typeof this.instance.FollowAnalytics.getSDKVersion !== 'function') {
      return false;
    }
    const sdkVersion = this.instance.FollowAnalytics.getSDKVersion();
    const versionNums = _.split(sdkVersion, '.');
    const [currentMajor, currentMinor] = versionNums;
    const currentTertiary = _.split(versionNums[2], '-')[0];
    return currentMajor >= minMajor && currentMinor >= minMinor && currentTertiary >= minTertiary;
  }
};

const getMockFollowAnalyticsAPI = () => ({
  getUserId: function () {return null;},
  getDeviceId: function () {return 'PREVIEW_DEVICE_ID';},
  logEvent: function (name, arg) { // arg: undefined | null | string | object
    console.log('Followanalytics: Event logged, name:' + name + ' arg:' + arg);
  },
  logError: function (name, arg) { // arg: undefined | null | string | object
    console.log('Followanalytics: Error logged, name:' + name + ' arg:' + arg);
  },
  setData: function (key, value) {
    console.log(`Setting value ${value} for data with key ${key}`);
  },
  getData: function (key) {
    console.log(`Retrieving the value stored on key ${key}`);
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
    close: function () {
      console.log('Followanalytics: CurrentCampaign.close called');
    },
    logAction: function (name) {
      console.log('Followanalytics: Action ' + name + ' is clicked!');
    },
  },
  __wrong_type: function (arg, array_of_types) {
    regexp = new RegExp('^\\[object (?:' + array_of_types.join('|') + ')\\]$')
    return !regexp.test(Object.prototype.toString.call(arg));
  }
});
