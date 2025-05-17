export const stringToSlug = (str: string): string => {
  return str
    .toLowerCase() // Convert to lowercase
    .trim() // Remove whitespace from both ends
    .replace(/[^a-z0-9\s-]/g, "") // Remove all non-word characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Collapse multiple hyphens
};
