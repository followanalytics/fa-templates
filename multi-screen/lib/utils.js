export const getIconDimensions = (size) => {
  switch (size) {
    case 'x-small':
      return {height: '2em', width: '3em'};
    case 'small':
      return {height: '3em', width: '4em'};
    case 'large':
      return {height: '5em', width: '6em'};
    case 'x-large':
      return {height: '6em', width: '7em'};
    case 'medium':
    default:
      return {height: '4em', width: '5em'};
  }
};

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

// Converts any color in hexadecimal to RGB format
export function hexToRgb(hex = '') {
  var bigint = parseInt(hex.substring(1), 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;

  return {r, g, b};
}

export function checkSDKVersion(version, minMajor, minMinor = 0, minTertiary = 0) {
  const versionNums = _.split(version, '.');
  const currentMajor = versionNums[0];
  const currentMinor = versionNums[1];
  const currentTertiary = _.split(versionNums[2], '-')[0];
  return currentMajor >= minMajor && currentMinor >= minMinor && currentTertiary >= minTertiary;
}
