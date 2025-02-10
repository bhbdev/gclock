import timezones from 'timezones-list';

// Common timezone selections covering major regions
export const commonTimezones = timezones.filter(tz => [
  // UTC
  'UTC',
  // North America
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  // Europe
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  // Asia
  'Asia/Dubai',
  'Asia/Singapore',
  'Asia/Tokyo',
  // Pacific
  'Pacific/Auckland',
  // Australia
  'Australia/Sydney',
].includes(tz.tzCode));

// Alternative format if you need label/value pairs
export const timezoneOptions = commonTimezones.map(tz => ({
  label: `${tz.name} (${tz.tzCode})`,
  value: tz.tzCode
}));

