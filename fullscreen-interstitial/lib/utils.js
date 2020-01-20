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
