const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: unknown, maxLength = 254): value is string {
  return typeof value === 'string' && value.trim().length <= maxLength && EMAIL_REGEX.test(value.trim());
}

export function isNonEmptyString(value: unknown, maxLength = 255): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= maxLength;
}

export function isPositiveFiniteNumber(value: unknown, max = 1_000_000): boolean {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 && num <= max;
}
