export const toKebabCase = (str: string) => {
  return str
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .toLowerCase(); // Convert to lowercase
};
