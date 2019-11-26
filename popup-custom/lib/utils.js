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
