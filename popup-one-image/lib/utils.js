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
