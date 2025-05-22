export const toCamelCase = (s: string) =>
  s.replace(/([A-Z])/g, "_$1").toLowerCase();
