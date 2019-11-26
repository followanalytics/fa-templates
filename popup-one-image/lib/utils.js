export const isAndroidDevice = () => {
  return window.navigator.platform === 'Android' ||
         _.startsWith(window.navigator.platform, 'Linux') ||
         window.navigator.platform === null;
}
