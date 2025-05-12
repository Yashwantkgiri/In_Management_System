/**
 * Sort array of objects by specified property
 */
export const sortByProperty = (array, property, ascending = true) => {
  return array.sort((a, b) => {
    if (a[property] < b[property]) return ascending ? -1 : 1;
    if (a[property] > b[property]) return ascending ? 1 : -1;
    return 0;
  });
};

/**
 * Deep clone an object or array
 */
export const deepClone = (data) => {
  return JSON.parse(JSON.stringify(data));
};

/**
 * Capitalize the first letter of a string
 */
export const capitalizeFirstLetter = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Generate a random ID (UUID v4)
 */
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Check if an object is empty
 */
export const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

/**
 * Find the maximum value in an array of objects based on a property
 */
export const findMaxValue = (array, property) => {
  if (!array.length) return 0;
  return Math.max(...array.map(item => item[property] || 0));
};

/**
 * Find the minimum value in an array of objects based on a property
 */
export const findMinValue = (array, property) => {
  if (!array.length) return 0;
  return Math.min(...array.map(item => item[property] || 0));
};

/**
 * Convert bytes to a readable size format (e.g., KB, MB, GB)
 */
export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Remove duplicates from an array of objects based on a property
 */
export const removeDuplicates = (array, property) => {
  return array.filter((value, index, self) =>
    index === self.findIndex((t) => t[property] === value[property])
  );
};

/**
 * ✅ Generate chart colors (Newly added)
 */
export const generateChartColors = (count) => {
  const colors = [
    '#4caf50', '#ff9800', '#2196f3', '#f44336', '#9c27b0',
    '#00bcd4', '#ffeb3b', '#795548', '#607d8b', '#ff5722'
  ];
  return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
};

/**
 * ✅ Format a number to currency format (Newly added)
 */
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};
