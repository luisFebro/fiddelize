// recoruse: https://web.dev/optimize-lcp/

/*
A list of useful properties that you can use:

navigator.connection.effectiveType: Effective connection type
navigator.connection.saveData: Data-saver enabled/disabled
navigator.hardwareConcurrency: CPU core count
navigator.deviceMemory: Device Memory
 */

if (navigator.connection && navigator.connection.effectiveType) {
  if (navigator.connection.effectiveType === '4g') {
    // Load video
  } else {
    // Load image
  }
}