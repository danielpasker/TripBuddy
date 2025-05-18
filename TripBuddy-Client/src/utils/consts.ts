export const genders = ['Female', 'Male', 'Non-binary', 'Other', 'Prefer not to say'] as const;
export const religions = ['Judaism', 'Christianity', 'Islam', 'Hinduism', 'Buddhism', 'Atheism', 'Other'] as const;
export const diets = [
  'Vegetarian',
  'Vegan',
  'Pescatarian',
  'Gluten-free',
  'Halal',
  'Kosher',
  'Nothing Special',
  'Other',
] as const;

export type Gender = (typeof genders)[number];
export type Religion = (typeof religions)[number];
export type Diet = (typeof diets)[number];
