export function checkSDKVersion(version, minMajor, minMinor = 0, minTertiary = 0) {
  const versionNums = _.split(version, '.');
  const currentMajor = versionNums[0];
  const currentMinor = versionNums[1];
  const currentTertiary = _.split(versionNums[2], '-')[0];
  return currentMajor >= minMajor && currentMinor >= minMinor && currentTertiary >= minTertiary;
}
