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

export const escapeHtml = (string) => {
  return !!string ? String(string).replace(BANNED_HTML_CHARS_REGEX, (s) => bannedHtmlChars[s]) : '';
}

export const escapeAttr = (string) => {
  return !!string ? String(string).replace(BANNED_ATTR_CHARS_REGEX, (s) => bannedAttrChars[s]) : '';
}

export const handleConsoleMessage = (e) => {
  if (typeof e === 'string') {
    console.error(`Error: ${e}`);
  }
  switch (e.severity) {
    case 'warning':
      console.warn(`Warning: ${e.message}`);
      break;
    case 'error':
      console.error(`Error: ${e.message}`);
      break;
    default:
      console.error(`${e}`);
  }
}
