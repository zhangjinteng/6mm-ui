const DECIMAL_PATTERN = /^([+-]?)(\d*)(?:\.(\d*))?$/;
const SCIENTIFIC_PATTERN = /^([+-]?)(\d*\.?\d+)[eE]([+-]?\d+)$/;
const MAX_EXPANDED_DIGITS = 1_000;

function expandScientificNotation(value: string): string | null {
  if (!/[eE]/.test(value)) return value;

  const match = value.match(SCIENTIFIC_PATTERN);
  if (!match) return null;

  const [, sign, coefficient, exponentText] = match;
  const exponent = Number(exponentText);
  if (
    !Number.isSafeInteger(exponent) ||
    Math.abs(exponent) > MAX_EXPANDED_DIGITS
  ) {
    return null;
  }

  const [integerPart = "", decimalPart = ""] = coefficient.split(".");
  const digits = `${integerPart}${decimalPart}`;
  const decimalIndex = integerPart.length + exponent;

  if (decimalIndex <= 0) {
    return `${sign}0.${"0".repeat(Math.abs(decimalIndex))}${digits}`;
  }
  if (decimalIndex >= digits.length) {
    return `${sign}${digits}${"0".repeat(decimalIndex - digits.length)}`;
  }
  return `${sign}${digits.slice(0, decimalIndex)}.${digits.slice(decimalIndex)}`;
}

/**
 * Converts a decimal value to plain notation while preserving all meaningful
 * fractional digits. Trailing fractional zeroes and negative zero are removed.
 */
export function normalizeDecimal(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;

  const plainValue = expandScientificNotation(
    String(value).trim().replace(/,/g, ""),
  );
  if (plainValue == null) return null;

  const match = plainValue.match(DECIMAL_PATTERN);
  if (!match || (!match[2] && !match[3])) return null;

  const [, sign, integerPartRaw = "", decimalPartRaw = ""] = match;
  const integerPart = integerPartRaw.replace(/^0+(?=\d)/, "") || "0";
  const decimalPart = decimalPartRaw.replace(/0+$/, "");
  const normalized = decimalPart
    ? `${integerPart}.${decimalPart}`
    : integerPart;

  if (/^0(?:\.0*)?$/.test(normalized)) return "0";
  return sign === "-" ? `-${normalized}` : normalized;
}

export function formatSignedDecimal(value: unknown): string {
  const normalized = normalizeDecimal(value);
  if (normalized == null) return "-";
  if (normalized === "0" || normalized.startsWith("-")) return normalized;
  return `+${normalized}`;
}
