// Filterable fields for Lesson
export const lessonFilterables = ['title'];

// Searchable fields for Lesson
export const lessonSearchableFields = ['title'];

// Helper function for set comparison
export const isSetEqual = (setA: Set<string>, setB: Set<string>): boolean => {
  if (setA.size !== setB.size) return false;
  for (const item of setA) {
    if (!setB.has(item)) return false;
  }
  return true;
};