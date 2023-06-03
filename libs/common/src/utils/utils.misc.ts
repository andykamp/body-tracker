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
export function safeJSONParse<T = Obj>(val: unknown): T | null {
  try {
    if (typeof val === "string") {
      return JSON.parse(val) as T;
    }
    if (typeof val === "object" && val !== null) { // assuming isObj checks this
      const keys = Object.keys(val);
      return keys.length > 0 ? (val as T) : null;
    }
    return null;
  } catch {
    return null;
  }
}

export function stripUndefinedFields<T extends object>(obj: T): T {
  const strippedObj = {} as Partial<T>;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key as keyof T];

      if (value !== undefined) {
        if (Array.isArray(value)) {
          strippedObj[key as keyof T] = (value as any[]).map((item) =>
            typeof item === 'object' && item !== null ? stripUndefinedFields(item) : item
          ) as any;
        } else if (typeof value === 'object' && value !== null) {
          strippedObj[key as keyof T] = stripUndefinedFields(value as any) as any;
        } else {
          strippedObj[key as keyof T] = value;
        }
      }
    }
  }

  return strippedObj as T;
}

