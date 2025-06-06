import {EventType} from '@customTypes/Alert';

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
export const tripTypes = ['Adventure', 'Relaxation', 'Cultural', 'Culinary', 'Nature'] as const;
export const alertTypes: Record<EventType, string> = {
  DR: 'Drought',
  EQ: 'Earthquake',
  FL: 'Flood',
  TS: 'Tsunami',
  VO: 'Volcano',
  WF: 'Forest Fire',
  TC: 'Cyclone',
};
