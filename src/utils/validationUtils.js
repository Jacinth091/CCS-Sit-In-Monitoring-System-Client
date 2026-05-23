/**
 * Validation Utilities for the CCS Sit-In Monitoring System
 */

/**
 * Validates an ID number (must be exactly 8 digits, no special characters)
 * @param {string} id 
 * @returns {boolean}
 */
export const validateIdNumber = (id) => {
  const re = /^\d{8}$/;
  return re.test(String(id));
};

/**
 * Validates a name field (letters, spaces, hyphens, apostrophes, and dots allowed)
 * Supports standard letters and Filipino characters like ñ/Ñ.
 * @param {string} name 
 * @returns {boolean}
 */
export const validateName = (name) => {
  // Supports letters, spaces, hyphens, apostrophes, and dots (for Jr., etc.)
  // Includes ñ/Ñ for Filipino names
  const re = /^[a-zA-Z\s\-'.ñÑ]+$/;
  return re.test(String(name));
};

/**
 * Validates an email address
 * @param {string} email 
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validates an address (Optional, any string allowed)
 * @param {string} address 
 * @returns {boolean}
 */
export const validateAddress = (address) => {
  // Guide: Optional | Any string allowed
  return true; 
};
