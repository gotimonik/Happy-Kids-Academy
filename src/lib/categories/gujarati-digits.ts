const GUJARATI_DIGITS = ["૦", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯"] as const;

/** Replaces ASCII digits (0-9) in a string with their Gujarati numeral glyphs. */
export function toGujaratiNumerals(value: string): string {
  return value.replace(/[0-9]/g, (digit) => GUJARATI_DIGITS[Number(digit)] ?? digit);
}
