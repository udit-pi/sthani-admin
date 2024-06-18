import moment from 'moment-timezone';

const TIMEZONE = 'Asia/Dubai';
const DATE_FORMAT = 'DD/MM/YYYY hh:mm A'; // Standard SQL datetime format, you can customize this as needed

/**
 * Formats a date into the Dubai timezone.
 * @param {string | Date} date - The date to format. Can be a Date object or a string.
 * @returns {string} The formatted date string.
 */
export const formatDateUAE = (date) => {
  return moment(date).tz(TIMEZONE).format(DATE_FORMAT);
};
