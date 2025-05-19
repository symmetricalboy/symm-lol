/**
 * Formats a number with commas and optional decimal places
 * @param {number} number - The number to format
 * @param {number} [decimalPlaces=0] - Number of decimal places to display
 * @returns {string} - The formatted number as a string
 */
export function formatNumber(number, decimalPlaces = 0) {
  if (number === null || number === undefined || isNaN(number)) {
    return '--';
  }
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  }).format(number);
}

/**
 * Formats a large number with abbreviated suffixes (K, M, B)
 * @param {number} number - The number to format
 * @returns {string} - The formatted number with appropriate suffix
 */
export function formatCompactNumber(number) {
  if (number === null || number === undefined || isNaN(number)) {
    return '--';
  }
  
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short'
  }).format(number);
} 