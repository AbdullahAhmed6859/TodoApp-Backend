export const toSnakeCase = (s: string) =>
  s.replace(/([A-Z])/g, "_$1").toLowerCase();

export const toCamelCase = (s: string) =>
  s.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

export const objToCamelCase = <T extends Record<string, any>>(
  obj: T
): Record<string, any> => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => objToCamelCase(item));
  }

  const result: Record<string, any> = {};
  Object.keys(obj).forEach((key) => {
    const camelCaseKey = toCamelCase(key);
    result[camelCaseKey] = objToCamelCase(obj[key]);
  });

  return result;
};
