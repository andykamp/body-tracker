type Obj = Record<string, unknown>

/**
 * Checks if the given value is an object.
 *
 * @param {unknown} obj - The value to be checked.
 * @returns {boolean} True if the value is an object, false otherwise.
 */
export function isObj(obj: unknown) {
  return obj && typeof obj === "object";
}

/**
 * Safely parses a JSON string or object into a JavaScript object or returns null if parsing fails.
 *
 * @template T - The expected return type of the parsed JSON (default: Obj).
 * @param {unknown} val - The JSON string or object to be parsed.
 * @returns {T | null} The parsed JavaScript object, or null if parsing fails.
 */
export function safeJSONParse<T = Obj>(val: unknown): T {
  try {
    if (typeof val === "string") {
      return JSON.parse(val)
    }
    if (isObj(val)) {
      const z = Object.keys(val)
      return z.length > 0
        ? val as T
        : null
    }
    return null
  } catch {
    return null
  }
}
