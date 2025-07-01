import { Language } from '../types'; // Assuming Language might be used later

// Define a basic structure for a success story, can be expanded later
export interface SuccessStory {
  id: string;
  title: { [lang in Language]: string };
  description: { [lang in Language]: string };
  imageUrl?: string;
  videoUrl?: string; // YouTube or other video link
  tags?: string[];
}

// This file can be populated with success story data later.
// For now, it exports an empty array to be a valid module.
export const successStories: SuccessStory[] = [];

export default successStories;
