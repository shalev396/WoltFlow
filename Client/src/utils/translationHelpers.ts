/**
 * Utility functions for safely handling i18n translations
 */

/**
 * Safely converts a translation result to an array.
 * Returns an empty array if the translation is not yet loaded or is not an array.
 * 
 * @param translationResult - The result from the t() function with returnObjects: true
 * @returns An array of the expected type, or an empty array if the translation is not loaded
 */
export function safeTranslationArray<T = string>(
  translationResult: unknown
): T[] {
  return Array.isArray(translationResult) ? translationResult : [];
}

